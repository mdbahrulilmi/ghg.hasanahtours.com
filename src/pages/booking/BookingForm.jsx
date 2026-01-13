import { useEffect, useState } from "react";
import updateSeat from "@/api/updateSeat";
import Swal from "sweetalert2";


const BASE_URL = "https://be.hasanahtours.com/api/v1";

const emptyJamaah = {
  nama: "",
  jenis_kelamin: "",
  no_ktp: "",
  tanggal_lahir: "",
  tempat_lahir: "",
  alamat: "",
  no_telepon: "",
  email: "",
  hubungan_dengan_main: "",
};

export default function BookingForm() {
  const [paketList, setPaketList] = useState([]);
  const [kodePaket, setKodePaket] = useState("");
  const [notes, setNotes] = useState("");
  const [jamaah, setJamaah] = useState([
    { ...emptyJamaah, hubungan_dengan_main: "DIRI SENDIRI" },
  ]);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingPaket, setLoadingPaket] = useState(false);

  const fetchPaket = async (pageNumber = 1) => {
    setLoadingPaket(true);
    try {
      const res = await fetch(
        `${BASE_URL}/paket?page=${pageNumber}&per_page=10`
      );
      const json = await res.json();

      setPaketList(json.data || []);
      setPage(json.meta?.current_page || 1);
      setLastPage(json.meta?.last_page || 1);
    } catch {
      Swal.fire({
      title: "Error!",
      text: `Gagal ambil data paket`,
      icon: "error",
      showConfirmButton: false,
    });
    } finally {
      setLoadingPaket(false);
    }
  };

  useEffect(() => {
    fetchPaket(page);
  }, [page]);

  const selectedPaket = paketList.find(
  (p) => p.kode_paket === kodePaket
);

  const handleJamaahChange = (index, field, value) => {
    setJamaah((prev) =>
      prev.map((j, i) =>
        i === index ? { ...j, [field]: value } : j
      )
    );
  };

  const addJamaah = () => {
    setJamaah([...jamaah, { ...emptyJamaah }]);
  };  

  const removeJamaah = (index) => {
    if (index === 0) return;
    setJamaah(jamaah.filter((_, i) => i !== index));
  };

  const fetchGHG = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/registered-ghg/paket/${id}`);
    const json = await res.json();

    return json
  } catch (err) {
  }
};


  const handleSubmit = async () => {
  
  if (!kodePaket) return Swal.fire({
      title: "Error!",
      text: `Pilih paket terlebih dahulu`,
      icon: "error",
      showConfirmButton: false,
    });;
  
  if (!selectedPaket) return Swal.fire({
      title: "Error!",
      text: `Data paket tidak ditemukan`,
      icon: "error",
      showConfirmButton: false,
    });;

  for (let i = 0; i < jamaah.length; i++) {
    const j = jamaah[i];
    if (!j.nama || !j.jenis_kelamin || !j.no_ktp || !j.tanggal_lahir) {
      Swal.fire({
      title: "Error!",
      text: `Data jamaah ke-${i + 1} belum lengkap`,
      icon: "error",
      showConfirmButton: false,
    });
    }
    if (i !== 0 && !j.hubungan_dengan_main) {
      Swal.fire({
      title: "Error!",
      text: `Hubungan jamaah ke-${i + 1} wajib diisi`,
      icon: "error",
      showConfirmButton: false,
    });
    }
  }

  const totalJamaah = jamaah.length;

  const booked_ghg = selectedPaket.seat_info.booked_ghg;
  const booked_ppiu = selectedPaket.seat_info.booked_ppiu + totalJamaah;
  const maxSlot = selectedPaket.seat_info.total_kursi;
  const sisaSeat = selectedPaket.seat_info.sisa_seat;

  if (totalJamaah > sisaSeat) {
    Swal.fire({
      title: "Error!",
      text: "Sisa seat tidak mencukupi",
      icon: "error",
      showConfirmButton: false,
    });
  }

  const filledSlotBaru = booked_ghg + booked_ppiu;
  const availableSlotBaru = Math.max(maxSlot - filledSlotBaru, 0);

  const payload = {
    kode_paket: kodePaket,
    notes,
    jamaah,
  };

  try {
    const res = await fetch(`${BASE_URL}/booking/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      Swal.fire({
      title: "Error!",
      text: "Gagal Simpan Booking",
      icon: "error",
      showConfirmButton: false,
    });
      return;
    }

    const ghg = await fetchGHG(kodePaket);

    if(ghg.status){
      await updateSeat({
        kode_paket: ghg.data.package_code,
        kode_paket_db: kodePaket,
  
        max_slot: maxSlot,
        filled_slot: filledSlotBaru,
        available_slot: availableSlotBaru,
  
        booked_ghg: booked_ghg,
        booked_ppiu: booked_ppiu,
      });
    }

    Swal.fire({
      title: "Success!",
      text: "Booking Berhasil dibuat",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

    window.location.reload();

  } catch {
    Swal.fire({
      title: "Error!",
      text: "Terjadi Kesalahan Server",
      icon: "error",
      showConfirmButton: false,
    });
  }
};


  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold">Tambah Booking Umroh</h1>

      {/* PILIH PAKET */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Pilih Paket</h2>

        <select
          className="block w-full border p-2 rounded"
          value={kodePaket}
          onChange={(e) => setKodePaket(e.target.value)}
          disabled={loadingPaket}
        >
          <option value="">
            {loadingPaket ? "Loading paket..." : "-- Pilih Paket --"}
          </option>
          {paketList.map((p) => (
            <option key={p.kode_paket} value={p.kode_paket}>
              {p.kode_paket} — {p.nama_paket}
            </option>
          ))}
        </select>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-3 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page {page} / {lastPage}
          </span>

          <button
            disabled={page >= lastPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* STATISTIK */}
      <div className="border p-4 rounded bg-gray-50 flex justify-between">
        <div>
          Total Jamaah: <b>{jamaah.length}</b>
        </div>
        <div>
          Main Jamaah: <b>{jamaah[0]?.nama || "-"}</b>
        </div>
      </div>

      {/* CATATAN */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Catatan</h2>
        <textarea
          className="border p-2 w-full rounded"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* FORM JAMAAH */}
      <div className="space-y-4">
        {jamaah.map((j, i) => (
          <div
            key={i}
            className={`border p-4 rounded ${
              i === 0 ? "bg-yellow-50" : ""
            }`}
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">
                {i === 0 ? "Main Jamaah" : `Jamaah ${i + 1}`}
              </h3>
              {i !== 0 && (
                <button
                  onClick={() => removeJamaah(i)}
                  className="text-red-500 text-sm"
                >
                  Hapus
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                className="border p-2"
                placeholder="Nama Lengkap *"
                value={j.nama}
                onChange={(e) =>
                  handleJamaahChange(i, "nama", e.target.value)
                }
              />

              <select
                className="border p-2"
                value={j.jenis_kelamin}
                onChange={(e) =>
                  handleJamaahChange(i, "jenis_kelamin", e.target.value)
                }
              >
                <option value="">Jenis Kelamin *</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>

              <input
                className="border p-2"
                placeholder="No KTP *"
                value={j.no_ktp}
                onChange={(e) =>
                  handleJamaahChange(i, "no_ktp", e.target.value)
                }
              />

              <input
                type="date"
                className="border p-2"
                value={j.tanggal_lahir}
                onChange={(e) =>
                  handleJamaahChange(i, "tanggal_lahir", e.target.value)
                }
              />

              <input
                className="border p-2"
                placeholder="Tempat Lahir"
                value={j.tempat_lahir}
                onChange={(e) =>
                  handleJamaahChange(i, "tempat_lahir", e.target.value)
                }
              />

              <input
                className="border p-2"
                placeholder="No Telepon"
                value={j.no_telepon}
                onChange={(e) =>
                  handleJamaahChange(i, "no_telepon", e.target.value)
                }
              />

              <input
                className="border p-2 col-span-2"
                placeholder="Email"
                value={j.email}
                onChange={(e) =>
                  handleJamaahChange(i, "email", e.target.value)
                }
              />

              {i !== 0 && (
                <select
                  className="border p-2 col-span-2"
                  value={j.hubungan_dengan_main}
                  onChange={(e) =>
                    handleJamaahChange(
                      i,
                      "hubungan_dengan_main",
                      e.target.value
                    )
                  }
                >
                  <option value="">Hubungan dengan Main Jamaah *</option>
                  <option value="SUAMI">Suami</option>
                  <option value="ISTRI">Istri</option>
                  <option value="ANAK">Anak</option>
                  <option value="ORANG TUA">Orang Tua</option>
                  <option value="LAINNYA">Lainnya</option>
                </select>
              )}
            </div>

            <textarea
              className="border p-2 w-full mt-3 rounded"
              placeholder="Alamat"
              value={j.alamat}
              onChange={(e) =>
                handleJamaahChange(i, "alamat", e.target.value)
              }
            />
          </div>
        ))}
      </div>

      {/* ACTION */}
      <div className="flex justify-between">
        <button
          onClick={addJamaah}
          className="border px-4 py-2 rounded"
        >
          + Tambah Jamaah
        </button>

        <button
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Simpan Booking
        </button>
      </div>
    </div>
  );
}

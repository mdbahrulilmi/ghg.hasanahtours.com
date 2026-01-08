import { useEffect, useState } from "react";

const BASE_URL = "https://be.hasanahtours.com/api/v1";

const emptyJamaah = {
  nama: "",
  jenis_kelamin: "",
  no_ktp: "",
  tanggal_lahir: "", // wajib diisi
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

  useEffect(() => {
    fetch(`${BASE_URL}/paket`)
      .then((res) => res.json())
      .then((json) => setPaketList(json.data || []))
      .catch(() => alert("Gagal ambil data paket"));
  }, []);

  const handleJamaahChange = (index, field, value) => {
    const copy = [...jamaah];
    copy[index] = { ...copy[index], [field]: value };
    setJamaah(copy);
  };

  const addJamaah = () => {
    if (jamaah.length >= 10) return alert("Maksimal 10 jamaah");
    setJamaah([...jamaah, { ...emptyJamaah }]);
  };

  const removeJamaah = (index) => {
    if (index === 0) return;
    setJamaah(jamaah.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!kodePaket) return alert("Pilih paket dulu");

    // Validasi setiap jamaah
    for (let i = 0; i < jamaah.length; i++) {
      const j = jamaah[i];
      if (!j.nama || !j.jenis_kelamin || !j.no_ktp || !j.tanggal_lahir) {
        return alert(`Data jamaah ke-${i + 1} belum lengkap`);
      }
      if (i !== 0 && !j.hubungan_dengan_main) {
        return alert(`Hubungan jamaah ke-${i + 1} wajib diisi`);
      }
    }

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

      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Gagal simpan booking");
        return;
      }

      alert("Booking berhasil dibuat");
      // reset form
      setKodePaket("");
      setNotes("");
      setJamaah([{ ...emptyJamaah, hubungan_dengan_main: "DIRI SENDIRI" }]);
    } catch (err) {
      alert("Terjadi kesalahan server");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Tambah Booking Umroh</h1>

      {/* PILIH PAKET */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Pilih Paket</h2>
        <select
          className="border p-2 w-full"
          value={kodePaket}
          onChange={(e) => setKodePaket(e.target.value)}
        >
          <option value="">-- Pilih Paket --</option>
          {paketList.map((p) => (
            <option key={p.kode_paket} value={p.kode_paket}>
              {p.nama_paket ?? p.tipe_paket?.name ?? p.kode_paket}
            </option>
          ))}
        </select>
      </div>

      {/* STATISTIK */}
      <div className="border p-4 rounded bg-gray-50 flex justify-between">
        <div>Total Jamaah: <b>{jamaah.length}</b></div>
        <div>Main Jamaah: <b>{jamaah[0]?.nama || "-"}</b></div>
      </div>

      {/* CATATAN */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Catatan</h2>
        <textarea
          className="border p-2 w-full"
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
            className={`border p-4 rounded ${i === 0 ? "bg-yellow-50" : ""}`}
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">
                {i === 0 ? "Main Jamaah" : `Jamaah ${i + 1}`}
              </h3>
              {i !== 0 && (
                <button
                  className="text-red-500 text-sm"
                  onClick={() => removeJamaah(i)}
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
              className="border p-2 w-full mt-3"
              placeholder="Alamat"
              value={j.alamat}
              onChange={(e) =>
                handleJamaahChange(i, "alamat", e.target.value)
              }
            />
          </div>
        ))}
      </div>

      {/* ACTION BUTTON */}
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

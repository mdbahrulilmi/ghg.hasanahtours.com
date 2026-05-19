import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const BASE_URL = "https://be.hasanahtours.com/api/v1";
import { useDropzone } from "react-dropzone";

export default function PackageFormPage() {
  const { kodePaket } = useParams();
  const isEdit = !!kodePaket;
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    kode_paket: null,
    nama_paket: "",
    tipe_paket_id: "",
    total_kursi: "",
    airlines_id: "",
    jumlah_hari: "",
    hotel_mekka: "",
    hotel_medina: "",
    hotel_jeddah: "",
    keberangkatan_id: "",
    kota_tujuan_id: "",
    no_penerbangan: "",
    tanggal_berangkat: "",
    kurs_tetap: "",
    hargaber1: 0,
    hargaber2: "",
    hargaber3: "",
    hargaber4: "",
    hargabayi: "",
    harga_perlengkapan: 0,
    gambar: "",
  });

  const [packageTypes, setPackageTypes] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [kotaKeberangkatan, setKotaKeberangkatan] = useState([]);
  const [kotaTujuan, setKotaTujuan] = useState([]);

  // Fetch dropdown data
  const fetchDropdowns = async () => {
    try {
      const [
        resTypes,
        resAirlines,
        resHotels,
        resKotaKeberangkatan,
        resKotaTujuan,
      ] = await Promise.all([
        fetch(`${BASE_URL}/master/tipePaket`).then((r) => r.json()),
        fetch(`${BASE_URL}/master/airlines`).then((r) => r.json()),
        fetch(`${BASE_URL}/master/hotels`).then((r) => r.json()),
        fetch(`${BASE_URL}/master/kotaKeberangkatan`).then((r) => r.json()),
        fetch(`${BASE_URL}/master/kotaTujuan`).then((r) => r.json()),
      ]);

      setPackageTypes(Array.isArray(resTypes.data) ? resTypes.data : []);
      setAirlines(Array.isArray(resAirlines.data) ? resAirlines.data : []);
      setHotels(Array.isArray(resHotels.data.hotels) ? resHotels.data.hotels : []);
      setKotaKeberangkatan(
        Array.isArray(resKotaKeberangkatan.data) ? resKotaKeberangkatan.data : []
      );
      setKotaTujuan(Array.isArray(resKotaTujuan.data) ? resKotaTujuan.data : []);
    } catch (err) {
      setError("Gagal memuat dropdowns");
    }
  };

   const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    return isoString.split("T")[0];
    };


  const fetchPackage = async () => {
    if (!isEdit) return;
    try {
      const res = await fetch(`${BASE_URL}/paket/${kodePaket}`);
      if (!res.ok) throw new Error("Gagal fetch paket");
      const pkg = (await res.json()).data;
      if (pkg) {
        setFormData({
          kode_paket: pkg.kode_paket || null,
          nama_paket: pkg.nama_paket || "",
          tipe_paket_id: pkg.tipe_paket?.id || "",
          total_kursi: pkg.seat_info.total_kursi || "",
          airlines_id: pkg.airline?.id || "",
          jumlah_hari: pkg.jumlah_hari || "",
          hotel_mekka: pkg.hotels?.mekka?.id || "",
          hotel_medina: pkg.hotels?.medina?.id || "",
          hotel_jeddah: pkg.hotels?.jeddah?.id || "",
          keberangkatan_id: pkg.lokasi.keberangkatan?.id || "",
          kota_tujuan_id: pkg.lokasi.tujuan?.id || "",
          no_penerbangan: pkg.penerbangan.no_penerbangan || "",
          tanggal_berangkat: formatDateForInput(pkg.penerbangan.tanggal_berangkat) || "",
          kurs_tetap: pkg.harga?.kurs_tetap || "",
          hargaber1: 0,
          hargaber2: pkg.harga?.ber2 || "",
          hargaber3: pkg.harga?.ber3 || "",
          hargaber4: pkg.harga?.ber4 || "",
          hargabayi: pkg.harga?.bayi || "",
          harga_perlengkapan: 0,
          gambar: pkg.gambar || "",
        });
        setPreviewImage(pkg.gambar || null);
      }
    } catch (err) {
      setError("Gagal memuat data paket");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchDropdowns();
      await fetchPackage();
      setLoading(false);
    };
    loadData();
  }, []);

  const safeMap = (arr) => (Array.isArray(arr) ? arr : []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        setFormData((prev) => ({
          ...prev,
          gambar: file,
        }));

        setPreviewImage(URL.createObjectURL(file));
      }
    },
  });

  const filterHotelsByCity = (cityName) =>
    safeMap(hotels).filter((h) => h.cityname.toLowerCase() === cityName.toLowerCase());

  const handleSubmit = async () => {
  try {
    const endpoint = isEdit
      ? `${BASE_URL}/paket/update`
      : `${BASE_URL}/paket/buat`;

    let imageUrl = formData.gambar;

    if (formData.gambar instanceof File) {
      setUploading(true);

      const body = new FormData();
      body.append("image", formData.gambar);

      const uploadRes = await fetch(`${BASE_URL}/master/upload-image`, {
        method: "POST",
        body,
      });

      const uploadJson = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadJson.message || "Upload gagal");
      }

      imageUrl = uploadJson.data.url;
    }

    const payload = {
      ...(!isEdit ? {} : { kode_paket: formData.kode_paket }),
      nama_paket: formData.nama_paket || undefined,
      tipe_paket_id: formData.tipe_paket_id
        ? Number(formData.tipe_paket_id)
        : undefined,

      gambar: imageUrl || undefined,
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(
        json.message ||
          (isEdit ? "Gagal update paket" : "Gagal buat paket")
      );
    }

    Swal.fire({
      icon: "success",
      title: isEdit
        ? "Berhasil update paket"
        : "Berhasil buat paket",
      timer: 1500,
      showConfirmButton: false,
    });

    navigate("/package");

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message || "Server error",
    });
  } finally {
    setUploading(false);
  }
};

  if (loading) return <p className="p-6">Loading form...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  
 

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Paket" : "Tambah Paket"}</h1>
      <div className="grid grid-cols-2 gap-4">
        {/* Form Fields */}
        {/** Nama Paket **/}
        <FormInput
          label="Nama Paket"
          value={formData.nama_paket}
          onChange={(v) => setFormData({ ...formData, nama_paket: v })}
        />

        {/** Tipe Paket **/}
        <FormSelect
          label="Tipe Paket"
          value={formData.tipe_paket_id}
          options={packageTypes.map((pt) => ({ value: pt.id, label: pt.name }))}
          onChange={(v) => setFormData({ ...formData, tipe_paket_id: v })}
        />

        {/** Total Kursi **/}
        <FormInput
          label="Total Kursi"
          type="number"
          value={formData.total_kursi}
          onChange={(v) => setFormData({ ...formData, total_kursi: v })}
        />

        {/** Airline **/}
        <FormSelect
          label="Airline"
          value={formData.airlines_id}
          options={airlines.map((a) => ({ value: a.idairlines, label: a.airlinesname }))}
          onChange={(v) => setFormData({ ...formData, airlines_id: v })}
        />

        {/** Jumlah Hari **/}
        <FormInput
          label="Jumlah Hari"
          type="number"
          value={formData.jumlah_hari}
          onChange={(v) => setFormData({ ...formData, jumlah_hari: v })}
        />

        {/** Hotel Mekka **/}
        <FormSelect
          label="Hotel Mekka"
          value={formData.hotel_mekka}
          options={filterHotelsByCity("Makkah").map((h) => ({ value: h.idhotel, label: h.hotelname }))}
          onChange={(v) => setFormData({ ...formData, hotel_mekka: v })}
        />

        {/** Hotel Medina **/}
        <FormSelect
          label="Hotel Medina"
          value={formData.hotel_medina}
          options={filterHotelsByCity("Madinah").map((h) => ({ value: h.idhotel, label: h.hotelname }))}
          onChange={(v) => setFormData({ ...formData, hotel_medina: v })}
        />

        {/** Hotel Jeddah **/}
        <FormSelect
          label="Hotel Jeddah"
          value={formData.hotel_jeddah}
          options={filterHotelsByCity("Jeddah").map((h) => ({ value: h.idhotel, label: h.hotelname }))}
          onChange={(v) => setFormData({ ...formData, hotel_jeddah: v })}
        />

        {/** Kota Keberangkatan **/}
        <FormSelect
          label="Kota Keberangkatan"
          value={formData.keberangkatan_id}
          options={kotaKeberangkatan.map((k) => ({ value: k.id, label: k.name }))}
          onChange={(v) => setFormData({ ...formData, keberangkatan_id: v })}
        />

        {/** Kota Tujuan **/}
        <FormSelect
          label="Kota Tujuan"
          value={formData.kota_tujuan_id}
          options={kotaTujuan.map((k) => ({ value: k.id, label: k.name }))}
          onChange={(v) => setFormData({ ...formData, kota_tujuan_id: v })}
        />

        {/** Nomor Penerbangan **/}
        <FormInput
          label="Nomor Penerbangan"
          value={formData.no_penerbangan}
          onChange={(v) => setFormData({ ...formData, no_penerbangan: v })}
        />

        {/** Tanggal Berangkat **/}
        <FormInput
          label="Tanggal Berangkat"
          type="date"
          value={formData.tanggal_berangkat}
          onChange={(v) => setFormData({ ...formData, tanggal_berangkat: v })}
        />

        {/** Kurs Tetap **/}
        <FormInput
          label="Kurs Tetap"
          type="number"
          value={formData.kurs_tetap}
          onChange={(v) => setFormData({ ...formData, kurs_tetap: v })}
        />

        {["hargaber2","hargaber3","hargaber4","hargabayi"].map((field) => (
        <FormInput
          key={field}
          label={{
            hargaber2: "Harga Ber-2 (Double)",
            hargaber3: "Harga Ber-3 (Triple)",
            hargaber4: "Harga Ber-4 (Quad)",
            hargabayi: "Harga Bayi",
          }[field]}
          type="number"
          value={formData[field]}
          onChange={(v) => setFormData({ ...formData, [field]: v })}
        />
      ))}


        {/** Gambar **/}
        <div>
          <label className="block mb-1 font-medium">Gambar</label>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded p-6 text-center cursor-pointer bg-white
              ${isDragActive ? "border-green-500 bg-green-50" : "border-gray-300"}
            `}
          >
            <input {...getInputProps()} />

            {uploading ? (
              <p>Uploading...</p>
            ) : (
              <p>
                Drag & drop gambar di sini, atau klik untuk pilih file
              </p>
            )}
          </div>

          {previewImage && (
            <div className="mt-4">
              <img
                src={previewImage}
                alt="Preview"
                className="w-40 rounded border"
              />
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={() => navigate("/packages")} className="px-5 py-2 bg-gray-300 rounded">
          Batal
        </button>
        <button onClick={handleSubmit} className="px-5 py-2 bg-green-600 text-white rounded">
          Simpan
        </button>
      </div>
    </div>
  );
}

// Reusable form input
const FormInput = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <input
      type={type}
      className="w-full border px-3 py-2 rounded"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// Reusable select
const FormSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <select
      className="w-full border px-3 py-2 rounded"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">-- Pilih {label} --</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

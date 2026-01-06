import { useNavigate } from "react-router-dom";

export default function EditPackagesForm({
  paket,
  formData,
  handleChange,
  handleFileChange,
  itineraryFile,
  handleAddHotel,
  handleRemoveHotel,
  handleHotelChange,
  handleSubmit,
  setFormData,
  airlines,
  hotelsList,
  packageTypes,
  kotaKeberangkatan,
  kotaTujuan
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-4">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Paket Umroh
              </h1>
              <p className="text-gray-500 mt-1">ID: {paket.package_code}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Baris 1: Informasi Dasar & Penerbangan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Kolom Kiri - Informasi Dasar */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Informasi Dasar</h2>
              </div>
              <div className="space-y-5">

                {/* Tipe Paket */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipe Paket
                  </label>
                  <select
                    value={formData.tipe_id || ""}
                    onChange={(e) => {
                      const id = e.target.value;
                      const selected = packageTypes.find(
                        t => String(t.id) === String(id)
                      );

                      setFormData(prev => ({
                        ...prev,
                        tipe_id: id,
                        tipe: selected?.category || ""
                      }));
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="">-- Pilih Tipe Paket --</option>
                    {Array.isArray(packageTypes) && packageTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nama Paket */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Paket
                  </label>
                  <input
                    type="text"
                    name="nama_paket"
                    value={formData.nama_paket}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nama paket umroh"
                  />
                </div>

                {/* Tanggal Berangkat */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal Berangkat
                  </label>
                  <input
                    type="date"
                    name="tgl_berangkat"
                    value={formData.tgl_berangkat}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Jumlah Hari */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jumlah Hari
                  </label>
                  <input
                    type="number"
                    name="jumlah_hari"
                    value={formData.jumlah_hari}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

              </div>
            </div>

            {/* Kolom Kanan - Informasi Penerbangan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Informasi Penerbangan</h2>
              </div>
              <div className="space-y-5">

                {/* Maskapai */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Maskapai
                  </label>
                  <select
                    name="maskapai"
                    value={formData.maskapai}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="">-- Pilih Maskapai --</option>
                    {Array.isArray(airlines) && airlines.map((a) => (
                      <option key={a.id ?? a.airlines} value={a.airlines}>
                        {a.airlinesname}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kode Flight */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kode Flight
                  </label>
                  <input
                    type="text"
                    name="kodeflight"
                    value={formData.kodeflight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Keberangkatan */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Keberangkatan
                  </label>
                  <select
                    name="keberangkatan"
                    value={formData.keberangkatan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="">-- Pilih Kota Keberangkatan --</option>
                    {Array.isArray(kotaKeberangkatan) && kotaKeberangkatan.map((k) => (
                      <option key={k.id ?? k.name} value={k.name}>
                        {k.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Landing */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Landing
                  </label>
                  <select
                    name="landing"
                    value={formData.landing}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="">-- Pilih Kota Tujuan --</option>
                    {Array.isArray(kotaTujuan) && kotaTujuan.map((k) => (
                      <option key={k.id ?? k.name} value={k.name}>
                        {k.name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>
          </div>

          {/* Baris 2: Harga & Slot */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Kolom Kiri - Harga */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Harga Paket</h2>
              </div>
              <div className="space-y-5">
                {[
                  { field: "hrginfant", label: "Harga Infant" },
                  { field: "hrgquad", label: "Harga Quad" },
                  { field: "hrgtriple", label: "Harga Triple" },
                  { field: "hrgdouble", label: "Harga Double" },
                  { field: "hrgperlengkapan", label: "Harga Perlengkapan" }
                ].map(({ field, label }) => (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        Rp
                      </span>
                      <input
                        type="number"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom Kanan - Slot & Gambar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Slot & Kapasitas (readOnly)</h2>
                </div>
                <div className="space-y-5">
                  {[
                    { field: "available_slot", label: "Available Slot" },
                    { field: "filled_slot", label: "Filled Slot" },
                    { field: "max_slot", label: "Max Slot" }
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {label}
                      </label>
                      <input
                        readOnly
                        type="number"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Gambar Paket</h2>
                </div>
                <input
                  type="text"
                  name="imgpaketumroh"
                  value={formData.imgpaketumroh}
                  onChange={handleChange}
                  placeholder="URL Gambar Paket"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

         {/* Hotels Static Grid - Mekkah, Madinah, Jeddah */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Mekkah */}
  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-800">Mekkah</h2>
    </div>

    <div className="space-y-3">
      <select
        value={formData.hotels.find(h => h.kota === 'Makkah')?.nama_hotel || ''}
        onChange={(e) => {
          const selectedHotel = hotelsList.hotels.find(
            h => h.hotelname === e.target.value && (h.cityname === 'Makkah' || h.cityname === 'Mekkah')
          );

          if (selectedHotel) {
            const existingIndex = formData.hotels.findIndex(h => h.kota === 'Makkah');
            
            if (existingIndex >= 0) {
              // Update existing
              handleHotelChange(existingIndex, "nama_hotel", selectedHotel.hotelname);
              handleHotelChange(existingIndex, "kota", "Makkah");
              handleHotelChange(existingIndex, "alamat", selectedHotel.hoteladdress || "");
              handleHotelChange(existingIndex, "jarak", selectedHotel.jarak || "");
              handleHotelChange(existingIndex, "bintang", selectedHotel.bintang || "");
            } else {
              // Add new
              const newHotel = {
                idhotelmitra: formData.hotels.length + 1,
                nama_hotel: selectedHotel.hotelname,
                kota: "Makkah",
                alamat: selectedHotel.hoteladdress || "",
                jarak: selectedHotel.jarak || "",
                bintang: selectedHotel.bintang || ""
              };
              // Tambahkan ke formData.hotels
              setFormData(prev => ({
                ...prev,
                hotels: [...prev.hotels, newHotel]
              }));
            }
          }
        }}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-white"
      >
        <option value="">-- Pilih Hotel --</option>
        {Array.isArray(hotelsList.hotels) &&
          hotelsList.hotels
            .filter(h => h.cityname === 'Makkah' || h.cityname === 'Mekkah')
            .map(h => (
              <option key={h.idhotel} value={h.hotelname}>
                {h.hotelname}
              </option>
            ))}
      </select>

      <input
        type="text"
        value={formData.hotels.find(h => h.kota === 'Makkah')?.kota || 'Makkah'}
        readOnly
        placeholder="Kota"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-600"
      />
      <input
        type="text"
        value={formData.hotels.find(h => h.kota === 'Makkah')?.alamat || ''}
        readOnly
        placeholder="Alamat"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-600"
      />
      <input
        type="text"
        value={formData.hotels.find(h => h.kota === 'Makkah')?.jarak || ''}
        readOnly
        placeholder="Jarak"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-600"
      />
      <input
        type="number"
        value={formData.hotels.find(h => h.kota === 'Makkah')?.bintang || ''}
        readOnly
        placeholder="Bintang"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-600"
      />
    </div>
  </div>

  {/* Madinah */}
  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-800">Madinah</h2>
    </div>

    <div className="space-y-3">
      <select
        value={formData.hotels.find(h => h.kota === 'Madinah')?.nama_hotel || ''}
        onChange={(e) => {
          const selectedHotel = hotelsList.hotels.find(
            h => h.hotelname === e.target.value && h.cityname === 'Madinah'
          );

          if (selectedHotel) {
            const existingIndex = formData.hotels.findIndex(h => h.kota === 'Madinah');
            
            if (existingIndex >= 0) {
              handleHotelChange(existingIndex, "nama_hotel", selectedHotel.hotelname);
              handleHotelChange(existingIndex, "kota", "Madinah");
              handleHotelChange(existingIndex, "alamat", selectedHotel.hoteladdress || "");
              handleHotelChange(existingIndex, "jarak", selectedHotel.jarak || "");
              handleHotelChange(existingIndex, "bintang", selectedHotel.bintang || "");
            } else {
              const newHotel = {
                idhotelmitra: formData.hotels.length + 1,
                nama_hotel: selectedHotel.hotelname,
                kota: "Madinah",
                alamat: selectedHotel.hoteladdress || "",
                jarak: selectedHotel.jarak || "",
                bintang: selectedHotel.bintang || ""
              };
              setFormData(prev => ({
                ...prev,
                hotels: [...prev.hotels, newHotel]
              }));
            }
          }
        }}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-white"
      >
        <option value="">-- Pilih Hotel --</option>
        {Array.isArray(hotelsList.hotels) &&
          hotelsList.hotels
            .filter(h => h.cityname === 'Madinah')
            .map(h => (
              <option key={h.idhotel} value={h.hotelname}>
                {h.hotelname}
              </option>
            ))}
      </select>

      <input
        type="text"
        value={formData.hotels.find(h => h.kota === 'Madinah')?.kota || 'Madinah'}
        readOnly
        placeholder="Kota"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-600"
      />
      <input
        type="text"
        value={formData.hotels.find(h => h.kota === 'Madinah')?.alamat || ''}
        readOnly
        placeholder="Alamat"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-600"
      />
      <input
        type="text"
        value={formData.hotels.find(h => h.kota === 'Madinah')?.jarak || ''}
        readOnly
        placeholder="Jarak"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-600"
      />
      <input
        type="number"
        value={formData.hotels.find(h => h.kota === 'Madinah')?.bintang || ''}
        readOnly
        placeholder="Bintang"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-600"
      />
    </div>
  </div>

  {/* Jeddah (Optional) */}
  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-800">Jeddah <span className="text-sm font-normal text-gray-500">(Opsional)</span></h2>
    </div>

    <div className="space-y-3">
      <select
        value={formData.hotels.find(h => h.kota === 'Jeddah')?.nama_hotel || ''}
        onChange={(e) => {
          if (e.target.value === '') {
            // Hapus hotel Jeddah jika ada
            const existingIndex = formData.hotels.findIndex(h => h.kota === 'Jeddah');
            if (existingIndex >= 0) {
              setFormData(prev => ({
                ...prev,
                hotels: prev.hotels.filter((_, idx) => idx !== existingIndex)
              }));
            }
            return;
          }

          const selectedHotel = hotelsList.hotels.find(
            h => h.hotelname === e.target.value && h.cityname === 'Jeddah'
          );

          if (selectedHotel) {
            const existingIndex = formData.hotels.findIndex(h => h.kota === 'Jeddah');
            
            if (existingIndex >= 0) {
              handleHotelChange(existingIndex, "nama_hotel", selectedHotel.hotelname);
              handleHotelChange(existingIndex, "kota", "Jeddah");
              handleHotelChange(existingIndex, "alamat", selectedHotel.hoteladdress || "");
              handleHotelChange(existingIndex, "jarak", selectedHotel.jarak || "");
              handleHotelChange(existingIndex, "bintang", selectedHotel.bintang || "");
            } else {
              const newHotel = {
                idhotelmitra: formData.hotels.length + 1,
                nama_hotel: selectedHotel.hotelname,
                kota: "Jeddah",
                alamat: selectedHotel.hoteladdress || "",
                jarak: selectedHotel.jarak || "",
                bintang: selectedHotel.bintang || ""
              };
              setFormData(prev => ({
                ...prev,
                hotels: [...prev.hotels, newHotel]
              }));
            }
          }
        }}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-white"
      >
        <option value="">--</option>
        {Array.isArray(hotelsList.hotels) &&
          hotelsList.hotels
            .filter(h => h.cityname === 'Jeddah')
            .map(h => (
              <option key={h.idhotel} value={h.hotelname}>
                {h.hotelname}
              </option>
            ))}
      </select>

      <input
        type="text"
        value={formData.hotels.find(h => h.kota === 'Jeddah')?.kota || ''}
        readOnly
        placeholder="-"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-600"
      />
      <input
        type="text"
        value={formData.hotels.find(h => h.kota === 'Jeddah')?.alamat || ''}
        readOnly
        placeholder="-"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-600"
      />
      <input
        type="text"
        value={formData.hotels.find(h => h.kota === 'Jeddah')?.jarak || ''}
        readOnly
        placeholder="-"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-600"
      />
      <input
        type="number"
        value={formData.hotels.find(h => h.kota === 'Jeddah')?.bintang || ''}
        readOnly
        placeholder="-"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-600"
      />
    </div>
  </div>
</div>

          {/* Tombol Submit */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
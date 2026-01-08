import { useEffect, useState } from "react";

const BASE_URL = "https://be.hasanahtours.com/api/v1";

export default function CitiesPage() {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    countryCode: "",
    hotel_count: 0,
  });

  // Fetch cities
  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/master/cities`);
      const json = await res.json();
      setCities(json.data || []);
    } catch {
      alert("Gagal ambil data city");
    } finally {
      setLoading(false);
    }
  };

  // Fetch countries
  const fetchCountries = async () => {
    try {
      const res = await fetch(`${BASE_URL}/master/country`);
      const json = await res.json();
      setCountries(json.data || []);
    } catch {
      console.log("Gagal ambil list negara");
    }
  };

  useEffect(() => {
    fetchCities();
    fetchCountries();
  }, []);

  const openEdit = (city) => {
    setIsEdit(true);
    setFormData({
      id: city.id,
      name: city.name || "",
      countryCode: city.countrycode || "",
      hotel_count: city.hotel_count || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.countryCode) {
      alert("Nama city dan kode negara wajib diisi");
      return;
    }

    const endpoint = isEdit
      ? `${BASE_URL}/master/editCities`
      : `${BASE_URL}/master/buatCities`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(
          json.message || (isEdit ? "Gagal update city" : "Gagal tambah city")
        );
        return;
      }
      setShowModal(false);
      fetchCities();
    } catch {
      alert("Server error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus city ini?")) return;

    try {
      const res = await fetch(`${BASE_URL}/master/deleteCity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.message || "Gagal hapus city");
        return;
      }
      fetchCities();
    } catch {
      alert("Server error");
    }
  };

  // 🔍 SEARCH FILTER
  const filteredCities = cities.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.countryname?.toLowerCase().includes(search.toLowerCase()) ||
      c.countrycode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Master Cities</h1>
        <button
          onClick={() => {
            setIsEdit(false);
            setFormData({
              id: null,
              name: "",
              countryCode: "",
              hotel_count: 0,
            });
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Tambah City
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Cari city / negara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-72"
      />

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">No</th>
              <th className="border p-2">Nama City</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  Data tidak ditemukan
                </td>
              </tr>
            )}

            {filteredCities.map((city, index) => (
              <tr key={city.id}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{city.name}</td>
                <td className="border p-2">
                  {city.countryname || city.countrycode}
                </td>
                <td className="border p-2 text-center flex justify-center gap-2">
                  <button
                    onClick={() => openEdit(city)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] p-6 rounded max-h-[90vh] overflow-y-auto">
            <h2 className="font-semibold text-lg mb-4">
              {isEdit ? "Edit City" : "Tambah City"}
            </h2>

            <div className="mb-4">
              <label className="block font-medium mb-1">Nama City</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Country</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={formData.countryCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    countryCode: e.target.value,
                  })
                }
              >
                <option value="">-- Pilih Negara --</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

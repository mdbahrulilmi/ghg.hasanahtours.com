import { useEffect, useState } from "react";

const BASE_URL = "https://be.hasanahtours.com/api/v1";

export default function KotaTujuanPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    id: null,
    name: "",
  });

  // Fetch all destination cities
  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/master/kotaTujuan`);
      const json = await res.json();
      setCities(json.data || []);
    } catch {
      alert("Gagal ambil data kota tujuan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const openEdit = (city) => {
    setIsEdit(true);
    setFormData({ id: city.id, name: city.name });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      alert("Nama kota wajib diisi");
      return;
    }

    const endpoint = isEdit
      ? `${BASE_URL}/master/editKotaTujuan`
      : `${BASE_URL}/master/buatKotaTujuan`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Gagal submit");
        return;
      }

      setShowModal(false);
      fetchCities();
    } catch {
      alert("Server error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus kota ini?")) return;

    try {
      const res = await fetch(`${BASE_URL}/master/kotaTujuan/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.message || "Gagal hapus kota");
        return;
      }
      fetchCities();
    } catch {
      alert("Server error");
    }
  };

  // 🔍 FILTER DATA
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Master Kota Tujuan</h1>
        <button
          onClick={() => {
            setIsEdit(false);
            setFormData({ id: null, name: "" });
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Tambah Kota
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Cari kota tujuan..."
        className="mb-4 w-full md:w-1/3 border px-3 py-2 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">No</th>
              <th className="border p-2">Nama Kota</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              filteredCities.map((city, index) => (
                <tr key={city.id}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{city.name}</td>
                  <td className="border p-2 text-center flex justify-center gap-2">
                    <button
                      onClick={() => openEdit(city)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(city.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-6 rounded">
            <h2 className="font-semibold text-lg mb-4">
              {isEdit ? "Edit Kota" : "Tambah Kota"}
            </h2>

            <div className="mb-4">
              <label className="block font-medium mb-1">Nama Kota</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
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

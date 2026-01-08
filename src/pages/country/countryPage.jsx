import { useEffect, useState } from "react";

const BASE_URL = "https://be.hasanahtours.com/api/v1";

export default function CountryPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    new_code: "",
    name: "",
  });

  const token = localStorage.getItem("tokenAuth");

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/master/country`);
      const json = await res.json();
      setCountries(json.data || []);
    } catch {
      alert("Gagal ambil data negara");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleSubmit = async () => {
    if (!formData.code || !formData.name) {
      alert("Kode dan Nama negara wajib diisi");
      return;
    }

    const url = isEdit
      ? "/master/editCountry"
      : "/master/buatCountry";

    const payload = isEdit
      ? {
          code: formData.code,
          new_code: formData.new_code,
          name: formData.name,
        }
      : {
          code: formData.code,
          name: formData.name,
        };

    try {
      const res = await fetch(`${BASE_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Gagal simpan data");
        return;
      }

      setShowModal(false);
      setFormData({ code: "", new_code: "", name: "" });
      fetchCountries();
    } catch {
      alert("Server error");
    }
  };

  const openCreate = () => {
    setIsEdit(false);
    setFormData({ code: "", new_code: "", name: "" });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setIsEdit(true);
    setFormData({
      code: item.code,
      new_code: item.code,
      name: item.name,
    });
    setShowModal(true);
  };

  // 🔍 SEARCH FILTER
  const filteredCountries = countries.filter(
    (item) =>
      item.code?.toLowerCase().includes(search.toLowerCase()) ||
      item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Master Negara</h1>
        <button
          onClick={openCreate}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Tambah
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Cari kode / nama negara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-64"
      />

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">No</th>
              <th className="border p-2">Kode</th>
              <th className="border p-2">Nama Negara</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredCountries.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  Data tidak ditemukan
                </td>
              </tr>
            )}

            {filteredCountries.map((item, index) => (
              <tr key={item.code}>
                <td className="border p-2 text-center">
                  {index + 1}
                </td>
                <td className="border p-2">{item.code}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => openEdit(item)}
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
          <div className="bg-white w-[400px] p-6 rounded">
            <h2 className="font-semibold text-lg mb-4">
              {isEdit ? "Edit Negara" : "Tambah Negara"}
            </h2>

            <input
              type="text"
              placeholder="Kode Negara"
              maxLength={3}
              className="w-full border px-3 py-2 rounded mb-4"
              value={isEdit ? formData.new_code : formData.code}
              onChange={(e) =>
                isEdit
                  ? setFormData({ ...formData, new_code: e.target.value })
                  : setFormData({ ...formData, code: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Nama Negara"
              className="w-full border px-3 py-2 rounded mb-4"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

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

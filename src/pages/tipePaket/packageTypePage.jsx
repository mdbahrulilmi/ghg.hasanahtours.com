import { useEffect, useState } from "react";

const BASE_URL = "https://be.hasanahtours.com/api/v1";
const ITEMS_PER_PAGE = 10;

export default function PackageTypePage() {
  const [packageTypes, setPackageTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    id: null,
    kategori_paket: "",
    nama_tipe_paket: "",
  });

  const fetchPackageTypes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/master/tipePaket`);
      const json = await res.json();
      setPackageTypes(json.data || []);
    } catch {
      alert("Gagal ambil data tipe paket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackageTypes();
  }, []);

  const openEdit = (pkg) => {
    setIsEdit(true);
    setFormData({
      id: pkg.id,
      kategori_paket: pkg.category || "",
      nama_tipe_paket: pkg.name || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.kategori_paket || !formData.nama_tipe_paket) {
      alert("Kategori paket dan nama tipe paket wajib diisi");
      return;
    }

    const endpoint = isEdit
      ? `${BASE_URL}/master/editTipePaket`
      : `${BASE_URL}/master/buatTipePaket`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Gagal simpan");
        return;
      }

      setShowModal(false);
      fetchPackageTypes();
    } catch {
      alert("Server error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus tipe paket ini?")) return;

    try {
      const res = await fetch(`${BASE_URL}/master/package-type/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.message || "Gagal hapus");
        return;
      }
      fetchPackageTypes();
    } catch {
      alert("Server error");
    }
  };

  // 🔍 SEARCH + FILTER
  const filteredData = packageTypes.filter((pkg) => {
    const matchSearch = pkg.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory = filterCategory
      ? pkg.category === filterCategory
      : true;

    return matchSearch && matchCategory;
  });

  // 📄 PAGINATION LOGIC
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // reset page kalau filter/search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterCategory]);

  const categories = [...new Set(packageTypes.map((p) => p.category))];

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Master Package Types</h1>
        <button
          onClick={() => {
            setIsEdit(false);
            setFormData({ id: null, kategori_paket: "", nama_tipe_paket: "" });
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Tambah Tipe Paket
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Cari nama tipe paket..."
          className="border px-3 py-2 rounded w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2">Kategori Paket</th>
                <th className="border p-2">Nama Tipe Paket</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    Data tidak ditemukan
                  </td>
                </tr>
              ) : (
                paginatedData.map((pkg, index) => (
                  <tr key={pkg.id}>
                    <td className="border p-2 text-center">
                      {startIndex + index + 1}
                    </td>
                    <td className="border p-2">{pkg.category}</td>
                    <td className="border p-2">{pkg.name}</td>
                    <td className="border p-2 text-center flex justify-center gap-2">
                      <button
                        onClick={() => openEdit(pkg)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
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

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-green-600 text-white"
                      : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* MODAL (TIDAK DIUBAH) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] p-6 rounded">
            <h2 className="font-semibold text-lg mb-4">
              {isEdit ? "Edit Tipe Paket" : "Tambah Tipe Paket"}
            </h2>

            <div className="mb-4">
              <label className="block font-medium mb-1">
                Kategori Paket
              </label>
              <input
                className="w-full border px-3 py-2 rounded"
                value={formData.kategori_paket}
                onChange={(e) =>
                  setFormData({ ...formData, kategori_paket: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">
                Nama Tipe Paket
              </label>
              <input
                className="w-full border px-3 py-2 rounded"
                value={formData.nama_tipe_paket}
                onChange={(e) =>
                  setFormData({ ...formData, nama_tipe_paket: e.target.value })
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

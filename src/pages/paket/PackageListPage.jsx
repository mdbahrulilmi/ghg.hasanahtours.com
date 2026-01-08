import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://be.hasanahtours.com/api/v1";
const ITEMS_PER_PAGE = 10;

export default function PackageListPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  // FETCH PACKAGES
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/paket`);
      const json = await res.json();
      setPackages(json.data || json || []);
    } catch (err) {
      console.error(err);
      alert("Gagal ambil data paket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // SEARCH + FILTER
  const filteredPackages = packages.filter((pkg) => {
    const searchValue = search.toLowerCase();

    const matchSearch =
      pkg.kode_paket?.toLowerCase().includes(searchValue) ||
      pkg.tipe_paket?.name?.toLowerCase().includes(searchValue) ||
      pkg.airline?.name?.toLowerCase().includes(searchValue);

    const matchType = filterType
      ? pkg.tipe_paket?.name === filterType
      : true;

    return matchSearch && matchType;
  });

  // PAGINATION
  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredPackages.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // reset page saat search/filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType]);

  // UNIQUE TIPE PAKET
  const packageTypes = [
    ...new Set(packages.map((p) => p.tipe_paket?.name).filter(Boolean)),
  ];

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Master Packages</h1>
        <button
          onClick={() => navigate("/package/create")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Tambah Paket
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Cari kode / tipe paket / airline..."
          className="border px-3 py-2 rounded w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Semua Tipe Paket</option>
          {packageTypes.map((type) => (
            <option key={type} value={type}>
              {type}
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
                <th className="border p-2">Kode Paket</th>
                <th className="border p-2">Tipe Paket</th>
                <th className="border p-2">Total Kursi</th>
                <th className="border p-2">Airline</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-4 text-center text-gray-500"
                  >
                    Data tidak ditemukan
                  </td>
                </tr>
              ) : (
                paginatedData.map((pkg, index) => (
                  <tr key={pkg.kode_paket}>
                    <td className="border p-2 text-center">
                      {startIndex + index + 1}
                    </td>
                    <td className="border p-2">{pkg.kode_paket}</td>
                    <td className="border p-2">
                      {pkg.tipe_paket?.name || "-"}
                    </td>
                    <td className="border p-2 text-center">
                      {pkg.total_kursi}
                    </td>
                    <td className="border p-2">
                      {pkg.airline?.name || "-"}
                    </td>
                    <td className="border p-2 text-center flex justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/package/edit/${pkg.kode_paket}`)
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
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
    </div>
  );
}

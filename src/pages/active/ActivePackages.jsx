import { useEffect, useState } from "react";
import { Calendar, Package, Search } from "lucide-react";

export default function ActivePackages() {
  const [paket, setPaket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 8,
    total: 0,
  });

  const url = import.meta.env.VITE_DUFT_LANDING_URL;
  const apiUrl = "https://be.hasanahtours.com/api/v1/registered-ghg";

  useEffect(() => {
    const controller = new AbortController();

    const fetchPaket = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: String(currentPage),
          search: searchQuery.trim(),
        });

        const response = await fetch(
          `${apiUrl}?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data paket.");
        }

        const json = await response.json();

        if (json.status === false) {
          throw new Error(
            json.message || "Gagal mengambil data paket."
          );
        }

        setPaket(json.data || []);

        if (json.pagination) {
          setPagination(json.pagination);
        } else {
          setPagination({
            current_page: 1,
            last_page: 1,
            per_page: 8,
            total: (json.data || []).length,
          });
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Terjadi kesalahan.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPaket();

    return () => controller.abort();
  }, [currentPage, searchQuery]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(`${dateString.slice(0, 10)}T00:00:00`);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isDeparturePassed = (dateString) => {
    if (!dateString) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const departure = new Date(
      `${dateString.slice(0, 10)}T00:00:00`
    );

    if (Number.isNaN(departure.getTime())) return false;

    return departure < today;
  };

  const firstItem =
    pagination.total === 0
      ? 0
      : (pagination.current_page - 1) * pagination.per_page + 1;

  const lastItem = Math.min(
    pagination.current_page * pagination.per_page,
    pagination.total
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
            <Package className="w-7 h-7 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Paket Aktif
            </h1>
            <p className="text-gray-600 font-mono">
              Daftar paket umroh yang terdaftar
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Cari paket berdasarkan kode atau nama..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 font-mono text-sm"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-500 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              Memuat paket...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-2xl shadow-md p-8 border border-red-200 text-center">
            <p className="text-xl font-bold text-red-600 mb-2">
              Terjadi Kesalahan
            </p>
            <p className="text-red-500">{error}</p>

            <button
              onClick={() => setCurrentPage((page) => page)}
              className="mt-4 px-5 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Package Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">

              {paket.length === 0 && (
                <div className="col-span-full bg-white rounded-2xl border border-gray-200 text-center py-12 sm:py-16">
                  <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" />

                  <p className="text-gray-500 text-base sm:text-lg font-medium">
                    Belum ada paket
                  </p>

                  <p className="text-gray-400 text-xs sm:text-sm mt-2">
                    Coba ubah kata kunci pencarian
                  </p>
                </div>
              )}

              {paket.map((item) => {
                const sudahLewat = isDeparturePassed(
                  item.tanggal_berangkat
                );

                return (
                  <div
                    key={item.id ?? item.package_id}
                    className={`rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border ${
                      sudahLewat
                        ? "bg-red-50 border-red-300"
                        : "bg-white border-gray-100"
                    }`}
                  >
                    {/* Header Card */}
                    <div
                      className={`p-4 sm:p-6 text-white ${
                        sudahLewat
                          ? "bg-gradient-to-r from-red-600 to-rose-500"
                          : "bg-gradient-to-r from-emerald-500 to-teal-500"
                      }`}
                    >
                      <h3 className="text-base sm:text-xl font-bold mb-2 line-clamp-2">
                        {item.package_name || "Tanpa nama paket"}
                      </h3>

                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold">
                          {sudahLewat
                            ? "Keberangkatan Lewat"
                            : "Aktif"}
                        </span>

                        <span className="text-xs opacity-75">
                          ID: {item.package_id ?? item.id ?? "-"}
                        </span>
                      </div>
                    </div>

                    {/* Body Card */}
                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Package className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${
                          sudahLewat
                            ? "text-red-500"
                            : "text-emerald-500"
                        }`} />

                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">
                            Kode Paket
                          </p>

                          <p className="font-mono text-sm sm:text-base font-semibold text-gray-800 break-all">
                            {item.package_code || "-"}
                          </p>
                        </div>
                      </div>

                      {/* Departure Date */}
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Calendar className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${
                          sudahLewat
                            ? "text-red-500"
                            : "text-emerald-500"
                        }`} />

                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">
                            Tanggal Keberangkatan
                          </p>

                          <p className={`text-sm font-semibold ${
                            sudahLewat
                              ? "text-red-600"
                              : "text-gray-800"
                          }`}>
                            {formatDate(item.tanggal_berangkat)}
                          </p>
                        </div>
                      </div>

                      {/* Edit */}
                      <a
                        href={`/edit-paket/${item.package_code}`}
                        className={`block w-full text-center text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-colors duration-200 ${
                          sudahLewat
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-emerald-500 hover:bg-emerald-600"
                        }`}
                      >
                        Edit
                      </a>

                      {/* Created / Updated */}
                      <div className="pt-3 sm:pt-4 border-t border-gray-200 space-y-2 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />

                          <span className="truncate">
                            Dibuat: {formatDate(item.created_at)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />

                          <span className="truncate">
                            Diperbarui: {formatDate(item.updated_at)}
                          </span>
                        </div>
                      </div>

                      {/* Detail */}
                      <a
                        href={`${url || ""}${item.package_code || ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full text-center border-2 text-sm sm:text-base font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-colors duration-200 ${
                          sudahLewat
                            ? "border-red-500 text-red-600 hover:bg-red-100"
                            : "border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                        }`}
                      >
                        Lihat Detail
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Backend Pagination */}
            {pagination.last_page > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl p-4">
                <p className="text-sm text-gray-500">
                  Menampilkan {firstItem}–{lastItem} dari{" "}
                  {pagination.total} paket
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={
                      pagination.current_page <= 1 || loading
                    }
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Sebelumnya
                  </button>

                  {Array.from(
                    { length: pagination.last_page },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      disabled={loading}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold ${
                        pagination.current_page === page
                          ? "bg-emerald-500 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(pagination.last_page, page + 1)
                      )
                    }
                    disabled={
                      pagination.current_page >= pagination.last_page ||
                      loading
                    }
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Calendar, MapPin, Package, Search } from "lucide-react";

export default function ActivePackages() {
  const [paket, setPaket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const url = import.meta.env.VITE_DUFT_LANDING_URL;

  useEffect(() => {
    fetchPaket();
  }, []);

  const fetchPaket = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://be.hasanahtours.com/api/v1/registered-ghg");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const json = await res.json();
      setPaket(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const filteredPaket = paket.filter(
    (item) =>
      item.package_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.package_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-300 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Memuat paket...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full border border-red-200 text-center">
          <p className="text-xl font-bold text-red-600 mb-2">Terjadi Kesalahan</p>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
            <Package className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paket Aktif</h1>
            <p className="text-gray-600 font-mono">Daftar paket umroh yang sedang aktif</p>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 font-mono text-sm"
            />
          </div>
        </div>

        {/* Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
    {filteredPaket.length === 0 && (
      <div className="col-span-full text-center py-12 sm:py-16">
        <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-base sm:text-lg font-medium">Belum ada paket</p>
        <p className="text-gray-400 text-xs sm:text-sm mt-2">Coba ubah kata kunci pencarian</p>
      </div>
    )}

    {filteredPaket.map((item) => (
      <div
        key={item.package_id}
        className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      >
        {/* Header Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 sm:p-6 text-white">
          <h3 className="text-base sm:text-xl font-bold mb-2 line-clamp-2">{item.package_name}</h3>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold">
              Aktif
            </span>
            <span className="text-xs opacity-75">ID: {item.package_id}</span>
          </div>
        </div>

        {/* Body Card */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">Kode Paket</p>
              <p className="font-mono text-sm sm:text-base font-semibold text-gray-800 break-all">
                {item.package_code}
              </p>
            </div>
          </div>

          <a
            href={`/edit-paket/${item.package_code}`}
            className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-colors duration-200"
          >
            Edit
          </a>

          <div className="pt-3 sm:pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">Dibuat: {formatDate(item.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">Diperbarui: {formatDate(item.updated_at)}</span>
            </div>
          </div>

          <a
            href={`${url}${item.package_code}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 text-sm sm:text-base font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-colors duration-200"
          >
            Lihat Detail
          </a>
        </div>
      </div>
    ))}
  </div>

      </div>
    </div>
  );
}

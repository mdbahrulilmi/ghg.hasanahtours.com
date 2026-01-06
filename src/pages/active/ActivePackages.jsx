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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPaket.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200 col-span-full">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada paket</h3>
              <p className="text-gray-500">Coba ubah kata kunci pencarian</p>
            </div>
          )}

          {filteredPaket.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
            >
              {/* Header Card */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-md font-bold line-clamp-2 text-gray-900">{item.package_name}</h3>
                  <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-2xl">
                    Aktif
                  </span>
                </div>
                <p className="text-gray-500 text-sm">ID: {item.package_id}</p>
              </div>

              {/* Body Card */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-gray-100 p-2 rounded-2xl">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Kode Paket</p>
                      <p className="font-semibold text-lg text-gray-900">{item.package_code}</p>
                    </div>
                  </div>
                  <a
                    href={`/edit-paket/${item.package_code}`}
                    className="flex items-center bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-3 py-1 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Edit
                  </a>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">Dibuat:</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">Diperbarui:</span>
                    <span>{formatDate(item.updated_at)}</span>
                  </div>
                </div>

                <a
                  href={`${url}${item.package_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-4 bg-gray-100 text-gray-900 py-3 rounded-2xl font-semibold shadow hover:shadow-md text-center block transition-all duration-300"
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

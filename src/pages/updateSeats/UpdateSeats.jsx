import { useEffect, useState } from "react";
import { Search, Users, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import updateSeat from "@/api/updateSeat";

function PackageCard({ pkg, onUpdate, setNotification }) {
  const [seatData, setSeatData] = useState({
    total_kursi: 0,
    booked_ppiu: 0,
    booked_ghg: 0,
    sisa_seat: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSeatData();
  }, [pkg.package_id]);

  const fetchSeatData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://be.hasanahtours.com/api/v1/paket/${pkg.package_id}`
      );
      if (!res.ok) throw new Error("Gagal mengambil data seat");
      const json = await res.json();

      const total = json.data.seat_info?.total_kursi || 0;
      const bookedPpiu = json.data.seat_info?.booked_ppiu || 0;
      const bookedGhg = json.data.seat_info?.booked_ghg || 0;

      setSeatData({
        kode_paket: pkg.package_code,
        kode_paket_db: pkg.package_id,
        total_kursi: total,
        booked_ppiu: bookedPpiu,
        booked_ghg: bookedGhg,
        total_booked: bookedPpiu + bookedGhg,
        sisa_seat: Math.max(total - bookedPpiu - bookedGhg, 0),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseInt(value) || 0;

    setSeatData((prev) => {
      const updated = { ...prev, [name]: numericValue };
      
      // Calculate total booked
      const totalBooked = updated.booked_ppiu + updated.booked_ghg;
      
      // Ensure total booked doesn't exceed total seats
      if (totalBooked > updated.total_kursi) {
        if (name === 'booked_ppiu') {
          updated.booked_ppiu = Math.max(0, updated.total_kursi - updated.booked_ghg);
        } else if (name === 'booked_ghg') {
          updated.booked_ghg = Math.max(0, updated.total_kursi - updated.booked_ppiu);
        }
      }
      
      // Recalculate remaining seats
      updated.sisa_seat = Math.max(updated.total_kursi - updated.booked_ppiu - updated.booked_ghg, 0);
      
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const max_slot = seatData.total_kursi;
      const filled_slot = seatData.booked_ppiu + seatData.booked_ghg;
      const available_slot = seatData.sisa_seat;

      await updateSeat({ 
        kode_paket: pkg.package_code,
        kode_paket_db: pkg.package_id,
        booked_ppiu: seatData.booked_ppiu,
        booked_ghg: seatData.booked_ghg,
        max_slot,
        filled_slot,
        available_slot
      });

      setNotification({
        type: "success",
        message: `Seat paket ${pkg.package_code} berhasil diperbarui`,
      });

      onUpdate();
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Gagal update seat",
      });
    } finally {
      setSaving(false);
    }
  };

  const calculatePercentage = () => {
    const totalBooked = seatData.booked_ppiu + seatData.booked_ghg;
    return !seatData.total_kursi ? 0 : Math.round((totalBooked / seatData.total_kursi) * 100);
  };

  const percentage = calculatePercentage();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 p-4">
        <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-1 rounded-2xl">
          {pkg.package_code}
        </span>
        <h3 className="text-sm font-bold mt-2 text-gray-900 line-clamp-2">{pkg.package_name}</h3>
      </div>

      {/* Body */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-6">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-gray-500 mt-2">Loading...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Progress */}
            <div className="bg-gray-100 p-2.5 rounded-lg border border-gray-200">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-700 font-medium">Terisi</span>
                <span className="font-bold text-gray-900">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-4 gap-1">
              {[
                { field: "total_kursi", label: "Total", readOnly: false },
                { field: "booked_ppiu", label: "PPIU", readOnly: false },
                { field: "booked_ghg", label: "GHG", readOnly: true },
                { field: "sisa_seat", label: "Sisa", readOnly: true }
              ].map(({ field, label, readOnly }, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-mono text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type="number"
                    name={field}
                    value={seatData[field]}
                    onChange={!readOnly ? handleChange : undefined}
                    readOnly={readOnly}
                    className={`w-full px-2 py-2 text-sm font-mono border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 ${
                      readOnly ? "bg-gray-100 cursor-not-allowed" : "border-gray-200"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-2 text-sm bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs">Menyimpan...</span>
                </>
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UpdateSeatsPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://be.hasanahtours.com/api/v1/registered-ghg");
      if (!res.ok) throw new Error("Gagal mengambil daftar paket");
      const json = await res.json();
      setPackages(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.package_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.package_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Memuat paket...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full border border-red-200 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchPackages}
            className="w-full mt-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 font-semibold transition-all duration-200"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Seats</h1>
            <p className="text-gray-600 font-mono">Kelola kapasitas seat untuk setiap paket umroh</p>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`p-4 rounded-2xl border-2 flex items-center gap-3 font-mono ${
              notification.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {notification.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-auto text-gray-500 hover:text-gray-700 text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {filteredPackages.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200 col-span-full">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Paket tidak ditemukan</h3>
              <p className="text-gray-500">Coba ubah kata kunci pencarian Anda</p>
            </div>
          )}

          {filteredPackages.map((pkg) => (
            <PackageCard
              key={pkg.package_id}
              pkg={pkg}
              onUpdate={fetchPackages}
              setNotification={setNotification}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
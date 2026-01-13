import { useEffect, useState } from "react";
import {
  Search,
  FileUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";
import uploadItinerary from "@/api/uploadItinerary";
import Swal from "sweetalert2";

function PackageCard({ pkg }) {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUploadItinerary = async (file) => {
    try {
      setUploading(true);
      setSuccess(false);

      Swal.fire({
        title: "Uploading...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await uploadItinerary({
        kode_paket: pkg.package_code,
        file,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Itinerary paket ${pkg.package_code} berhasil diupload`,
        timer: 2000,
        showConfirmButton: false,
      });

      setSuccess(true);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: err.message || "Upload itinerary gagal",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      {/* header */}
      <div className="bg-gray-50 p-4">
        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-2xl font-mono">
          {pkg.package_code}
        </span>
        <h3 className="text-sm font-bold mt-2 text-gray-900">
          {pkg.package_name}
        </h3>
      </div>

      {/* body */}
      <div className="p-4 space-y-3">
        {success && (
          <div className="flex items-center gap-2 text-green-700 text-sm font-mono">
            <CheckCircle className="w-4 h-4" />
            Itinerary berhasil diupload
          </div>
        )}

        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          id={`upload-${pkg.package_id}`}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleUploadItinerary(e.target.files[0]);
            }
          }}
        />

        <label
          htmlFor={`upload-${pkg.package_id}`}
          className={`w-full flex items-center justify-center gap-2
            py-2 text-sm font-mono rounded-2xl border-2 border-dashed
            ${
              uploading
                ? "border-gray-300 text-gray-400"
                : "border-emerald-400 text-emerald-700 hover:bg-emerald-50"
            }`}
        >
          {uploading ? "Uploading..." : "Upload Itinerary"}
          <FileUp className="w-4 h-4" />
        </label>
      </div>
    </div>
  );
}

export default function UpdateItineraryPerPackage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://be.hasanahtours.com/api/v1/registered-ghg"
      );

      if (!res.ok) {
        throw new Error("Gagal mengambil daftar paket");
      }

      const json = await res.json();
      setPackages(json.data || []);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
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
        <XCircle className="w-10 h-10 text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-gray-200">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Upload Itinerary
            </h1>
            <p className="text-gray-600 font-mono">
              Upload itinerary untuk setiap paket umroh
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari paket berdasarkan kode atau nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono text-sm"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPackages.length === 0 && (
            <div className="col-span-full bg-white p-8 rounded-2xl shadow-md text-center border border-gray-200">
              <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Paket tidak ditemukan
              </h3>
              <p className="text-gray-500">
                Coba ubah kata kunci pencarian
              </p>
            </div>
          )}

          {filteredPackages.map((pkg) => (
            <PackageCard key={pkg.package_id} pkg={pkg} />
          ))}
        </div>
      </div>
    </div>
  );
}

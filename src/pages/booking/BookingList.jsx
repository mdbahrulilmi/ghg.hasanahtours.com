import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BASE_URL = "https://be.hasanahtours.com/api/v1";

export default function BookingList() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [selectedJamaah, setSelectedJamaah] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        per_page: 10,
      });

      if (status) params.append("status", status);
      if (search) params.append("kode_paket", search);

      const res = await fetch(`${BASE_URL}/booking?${params.toString()}`);
      const json = await res.json();

      setData(json.data || []);
      setMeta(json.meta || null);
    } catch {
      Swal.fire({
            title: "Error!",
            text: `Gagal ambil data booking`,
            icon: "error",
            showConfirmButton: false,
          });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, status]);

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Booking</h1>

        <button
          onClick={() => navigate("/booking/create")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Tambah Booking
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Cari kode paket..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          onClick={() => {
            setPage(1);
            fetchData();
          }}
          className="bg-gray-800 text-white px-4 rounded"
        >
          Cari
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2">Kode Booking</th>
                <th className="border p-2">Kode Paket</th>
                <th className="border p-2">Total Jamaah</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    Data kosong
                  </td>
                </tr>
              )}

              {data.map((b, i) => (
                <tr key={b.kode_booking}>
                  <td className="border p-2 text-center">
                    {(meta?.from || 1) + i}
                  </td>
                  <td className="border p-2">{b.kode_booking}</td>
                  <td className="border p-2">{b.kode_paket}</td>
                  <td className="border p-2 text-center">
                    {b.total_jamaah}
                  </td>
                  <td className="border p-2">{b.status}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => setSelectedJamaah(b.jamaah_list || [])}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
                    >
                      Lihat Jamaah
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          {meta && (
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-600">
                Halaman {meta.current_page} dari {meta.last_page} • Total{" "}
                {meta.total}
              </span>

              <div className="flex gap-2">
                <button
                  disabled={meta.current_page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  disabled={meta.current_page === meta.last_page}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL JAMAAH */}
      {selectedJamaah !== null && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedJamaah(null)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Data Jamaah</h2>

            {selectedJamaah.length === 0 ? (
              <p className="text-gray-500">Data jamaah tidak tersedia</p>
            ) : (
              <div className="space-y-2 text-sm max-h-96 overflow-y-auto">
                {selectedJamaah.map((j, idx) => (
                  <div key={idx} className="border-b pb-2">
                    <p><strong>Nama:</strong> {j.nama}</p>
                    {j.no_ktp && <p><strong>No KTP:</strong> {j.no_ktp}</p>}
                    {j.no_telepon && <p><strong>No Telepon:</strong> {j.no_telepon}</p>}
                    {j.email && <p><strong>Email:</strong> {j.email}</p>}
                    {j.kamar && <p><strong>Kamar:</strong> {j.kamar}</p>}
                    {j.hubungan_dengan_main && <p><strong>Hubungan:</strong> {j.hubungan_dengan_main}</p>}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedJamaah(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

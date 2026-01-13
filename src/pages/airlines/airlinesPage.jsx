import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const BASE_URL = "https://be.hasanahtours.com/api/v1";

export default function AirlinesPage() {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    idairlines: null,
    airlinesname: "",
  });

  const token = localStorage.getItem("token");

  const fetchAirlines = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/master/airlines`);
      const json = await res.json();
      const sorted = (json.data || []).sort((a, b) =>
      a.airlinesname.localeCompare(b.airlinesname)
      );
      setAirlines(sorted);
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Gagal ambil data airlines",
        icon: "error",
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirlines();
  }, []);

  const handleSubmit = async () => {
    if (!formData.airlinesname) {
      Swal.fire({
            title: "Error!",
            text: "Nama airlines wajib diisi",
            icon: "error",
            showConfirmButton: false,
          });
      return;
    }

    const url = isEdit
      ? "/master/editAirlines"
      : "/master/buatAirlines";

    try {
      const res = await fetch(`${BASE_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        Swal.fire({
              title: "Error!",
              text: "Gagal simpan data",
              icon: "error",
              showConfirmButton: false,
            });
        return;
      }

      setShowModal(false);
      setFormData({ idairlines: null, airlinesname: "" });
      fetchAirlines();
    } catch (err) {
      Swal.fire({
            title: "Error!",
            text: "Server Error",
            icon: "error",
            showConfirmButton: false,
          });
    }
  };

  const openCreate = () => {
    setIsEdit(false);
    setFormData({ idairlines: null, airlinesname: "" });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setIsEdit(true);
    setFormData({
      idairlines: item.idairlines,
      airlinesname: item.airlinesname,
    });
    setShowModal(true);
  };

  // 🔍 FILTER SEARCH
  const filteredAirlines = airlines.filter((item) =>
    item.airlinesname?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Master Airlines</h1>
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
        placeholder="Cari nama airlines..."
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
              <th className="border p-2">Nama Airlines</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredAirlines.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4">
                  Data tidak ditemukan
                </td>
              </tr>
            )}

            {filteredAirlines.map((item, index) => (
              <tr key={item.idairlines}>
                <td className="border p-2 text-center">
                  {index + 1}
                </td>
                <td className="border p-2">
                  {item.airlinesname}
                </td>
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
              {isEdit ? "Edit Airlines" : "Tambah Airlines"}
            </h2>

            <input
              type="text"
              placeholder="Nama Airlines"
              className="w-full border px-3 py-2 rounded mb-4"
              value={formData.airlinesname}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  airlinesname: e.target.value,
                })
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

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const BASE_URL = "https://be.hasanahtours.com/api/v1";

export default function HotelPage() {
  const [hotels, setHotels] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    idhotel: null,
    hotelname: "",
    idhotelcity: "",
    hoteladdress: "",
    notes: "",
    bintang: 1,
    jarak: "",
    hotellat: "",
    hotellong: "",
  });

  // Fetch hotels
  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/master/hotels`);
      const json = await res.json();
      const sorted = (json.data.hotels || []).sort((a, b) =>
      a.hotelname.localeCompare(b.hotelname));
      setHotels(sorted);
    } catch {
      Swal.fire({
          title: "Error!",
          text: "Gagal ambil data hotel",
          icon: "error",
          showConfirmButton: false,
              });
    } finally {
      setLoading(false);
    }
  };

  // Fetch cities
  const fetchCities = async () => {
    try {
      const res = await fetch(`${BASE_URL}/master/cities`);
      const json = await res.json();
      setCities(json.data || []);
    } catch {
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchCities();
  }, []);

  const openEdit = (hotel) => {
    setIsEdit(true);
    setFormData({
      idhotel: hotel.idhotel,
      hotelname: hotel.hotelname || "",
      idhotelcity: hotel.idhotelcity || "",
      hoteladdress: hotel.hoteladdress || "",
      notes: hotel.notes || "",
      bintang: hotel.bintang || 1,
      jarak: hotel.jarak || "",
      hotellat: hotel.hotellat || "",
      hotellong: hotel.hotellong || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.hotelname || !formData.idhotelcity) {
      Swal.fire({
                title: "Error!",
                text: "Nama hotel dan kota wajib diisi",
                icon: "error",
                showConfirmButton: false,
              });
      return;
    }
    if (formData.bintang < 1 || formData.bintang > 5) {
      Swal.fire({
                title: "Error!",
                text: "Bintang harus 1-5",
                icon: "error",
                showConfirmButton: false,
              });
      return;
    }

    try {
      const endpoint = isEdit
        ? `${BASE_URL}/master/editHotel`
        : `${BASE_URL}/master/buatHotel`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        Swal.fire({
                title: "Error!",
                text: json.message ||
            (isEdit ? "Gagal update hotel" : "Gagal tambah hotel"),
                icon: "error",
                showConfirmButton: false,
              });
        return;
      }

      setShowModal(false);
      fetchHotels();
    } catch (err) {
      Swal.fire({
                title: "Error!",
                text: "Server error",
                icon: "error",
                showConfirmButton: false,
              });
    }
  };

  // 🔍 SEARCH FILTER
  const filteredHotels = hotels.filter(
    (h) =>
      h.hotelname?.toLowerCase().includes(search.toLowerCase()) ||
      h.cityname?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Master Hotel</h1>
        <button
          onClick={() => {
            setIsEdit(false);
            setFormData({
              idhotel: null,
              hotelname: "",
              idhotelcity: "",
              hoteladdress: "",
              notes: "",
              bintang: 1,
              jarak: "",
              hotellat: "",
              hotellong: "",
            });
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Tambah Hotel
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Cari nama hotel / kota..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-72"
      />

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">No</th>
              <th className="border p-2">Nama Hotel</th>
              <th className="border p-2">Kota</th>
              <th className="border p-2">Bintang</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredHotels.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  Data tidak ditemukan
                </td>
              </tr>
            )}

            {filteredHotels.map((hotel, index) => (
              <tr key={hotel.idhotel}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{hotel.hotelname}</td>
                <td className="border p-2">{hotel.cityname}</td>
                <td className="border p-2 text-center">{hotel.bintang}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => openEdit(hotel)}
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
          <div className="bg-white w-[600px] p-6 rounded max-h-[90vh] overflow-y-auto">
            <h2 className="font-semibold text-lg mb-4">
              {isEdit ? "Edit Hotel" : "Tambah Hotel"}
            </h2>

            <div className="mb-4">
              <label className="block font-medium mb-1">Nama Hotel</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={formData.hotelname}
                onChange={(e) =>
                  setFormData({ ...formData, hotelname: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Kota</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={formData.idhotelcity}
                onChange={(e) =>
                  setFormData({ ...formData, idhotelcity: e.target.value })
                }
              >
                <option value="">-- Pilih Kota --</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.countrycode})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Alamat</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={formData.hoteladdress}
                onChange={(e) =>
                  setFormData({ ...formData, hoteladdress: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Catatan</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-medium mb-1">Bintang (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  className="w-full border px-3 py-2 rounded"
                  value={formData.bintang}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bintang: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Jarak (meter)</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.jarak}
                  onChange={(e) =>
                    setFormData({ ...formData, jarak: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.hotellat}
                  onChange={(e) =>
                    setFormData({ ...formData, hotellat: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.hotellong}
                  onChange={(e) =>
                    setFormData({ ...formData, hotellong: e.target.value })
                  }
                />
              </div>
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

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, DollarSign, ArrowRight, Send } from "lucide-react"
import createPackage from "@/api/createPackage"
import mapHotelsToGHG from "@/helpers/mapHotelsToGHG"
import Swal from "sweetalert2"

export default function PaketTersedia() {
  const [paket, setPaket] = useState([])
  const [selectedPaket, setSelectedPaket] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [seatMap, setSeatMap] = useState({})
  const [loadingPaket, setLoadingPaket] = useState(false)
  const [loadingSeat, setLoadingSeat] = useState(null)

  useEffect(() => {
    fetchPaket()
  }, [])

  const fetchPaket = async () => {
    try {
      setLoadingPaket(true);

      const resPaket = await fetch("https://be.hasanahtours.com/api/v1/paket");
      if (!resPaket.ok) throw new Error("Gagal mengambil paket");
      const paketData = await resPaket.json();

      const resRegistered = await fetch("https://be.hasanahtours.com/api/v1/registered-ghg");
      if (!resRegistered.ok) throw new Error("Gagal mengambil registered paket");
      const registeredData = await resRegistered.json();

      const registeredCodes = new Set(registeredData.data.map(item => item.package_id));

      const filteredPaket = paketData.data.filter(p => !registeredCodes.has(p.kode_paket));

      setPaket(filteredPaket);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPaket(false);
    }
  };


  const fetchSeat = async (id) => {
  if (seatMap[id]) return

  try {
    setLoadingSeat(id)
    const res = await fetch(`https://be.hasanahtours.com/api/v1/paket/${id}`)
    if (!res.ok) throw new Error("Gagal mengambil seat")
      const json = await res.json()
    
    setSeatMap(prev => ({
      ...prev,
      [id]: json.data
    }))
  } catch (err) {
    setError(err.message)
  } finally {
    setLoadingSeat(null)
  }
}

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const toggleSelectPaket = (item) => {
    setSelectedPaket(prev => {
      const exists = prev.find(p => p.kode_paket === item.kode_paket)
      if (exists) {
        return prev.filter(p => p.kode_paket !== item.kode_paket)
      } else {
        return [...prev, item]
      }
    })
  }

  const kirimKeGHG = async () => {
    if (selectedPaket.length === 0) return

    try {
      setLoading(true)

      for (const item of selectedPaket) {
      const seat = seatMap[item.kode_paket]

      if (!seat) {
        return
      }

      const d = new Date(item.tanggal_berangkat)
      const tgl_berangkat = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
      const hotels = mapHotelsToGHG(seat.hotels)

      await createPackage({
          tipe: item.tipe_paket.category,
          nama_paket: item.nama_paket,
          tgl_berangkat: tgl_berangkat,
          jumlah_hari: item.jumlah_hari,
          maskapai: item.airline.name,
          keberangkatan: item.kota_keberangkatan.name,
          landing: item.kota_tujuan.name,
          kodeflight: item.no_penerbangan,
          hrginfant: Math.trunc(item.harga.bayi),
          hrgquad: Math.trunc(item.harga.ber4),
          hrgtriple: Math.trunc(item.harga.ber3),
          hrgdouble: Math.trunc(item.harga.ber2),
          hrgperlengkapan: 0,
          imgpaketumroh: item.imgpaketumroh ?? 'https://admin.dreamtour.co/assets/images/gbrpaket/paketumrohdf.jpeg',
          available_slot: seat.seat_info.sisa_seat,
          filled_slot: seat.seat_info.booked_ghg + seat.seat_info.booked_ppiu,
          max_slot: seat.seat_info.total_kursi,
          itinerary: "https://pdfobject.com/pdf/sample.pdf",
          hotels: hotels,
          package_id: item.kode_paket
        })
      }

      Swal.fire({
        title: "Success!",
        text: "Semua Paket Telah Terkirim ke GHG!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      window.location.reload();
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Paket Gagal Dikirim",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Paket Tersedia */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-gray-300 shadow-xl h-full">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <CardTitle className="text-2xl flex items-center justify-between">
                  <span>PAKET TERSEDIA</span>
                  <span className="bg-white text-indigo-600 px-4 py-1 rounded-full text-sm font-bold">
                    {paket.length} Paket
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 max-h-[500px] overflow-y-auto">
  {paket.length === 0 ? (
    <div className="text-center py-12 text-gray-400">
      <Users className="w-16 h-16 mx-auto mb-3 opacity-30" />
      <p className="text-sm font-semibold">Tidak ada paket tersedia</p>
      <p className="text-xs mt-1">Semua paket sudah aktif atau terdaftar di GHG</p>
    </div>
  ) : (
    <div className="space-y-4">
      {paket.map((item) => {
        const isSelected = selectedPaket.find(p => p.kode_paket === item.kode_paket)
        return (
          <div
            key={item.kode_paket}
            onClick={() => {
              toggleSelectPaket(item)
              fetchSeat(item.kode_paket)
            }}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                    {item.kode_paket}
                  </span>
                  {isSelected && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ✓ Dipilih
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg text-gray-900">{item.nama_paket}</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">{item.total_kursi} kursi</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">{formatDate(item.tanggal_berangkat)}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-3 gap-2 text-xs">
              <div className="bg-purple-50 p-2 rounded">
                <p className="text-gray-600 mb-1">1 Orang</p>
                <p className="font-bold text-purple-700">{formatCurrency(item.harga.ber1)}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-gray-600 mb-1">2 Orang</p>
                <p className="font-bold text-blue-700">{formatCurrency(item.harga.ber2)}</p>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <p className="text-gray-600 mb-1">3+ Orang</p>
                <p className="font-bold text-green-700">{formatCurrency(item.harga.ber3)}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )}
</CardContent>

            </Card>
          </div>

          {/* Right Section - List yang mau dikirim */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="border-2 border-gray-300 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  <CardTitle className="text-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowRight className="w-6 h-6" />
                      <span>LIST YANG MAU DIKIRIM KE GHG</span>
                    </div>
                    <div className="text-sm font-normal bg-white bg-opacity-20 px-3 py-1 rounded-full inline-block">
                      {selectedPaket.length} paket dipilih
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="max-h-[400px] overflow-y-auto mb-4">
                    {selectedPaket.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Users className="w-16 h-16 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Belum ada paket dipilih</p>
                        <p className="text-xs mt-1">Klik paket di sebelah kiri untuk memilih</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedPaket.map((item) => (
                          <div
                            key={item.kode_paket}
                            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                                  {item.kode_paket}
                                </span>
                                <h4 className="font-bold text-sm text-gray-900 mt-2">{item.nama_paket}</h4>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleSelectPaket(item)
                                }}
                                className="text-red-500 hover:text-red-700 font-bold text-lg"
                              >
                                ×
                              </button>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <p>📅 {formatDate(item.tanggal_berangkat)}</p>
                              <p>👥 {item.total_kursi} kursi</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={kirimKeGHG}
                    disabled={selectedPaket.length === 0}
                    className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 ${
                      selectedPaket.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-xl hover:scale-105'
                    }`}
                  >
                    <Send className="w-6 h-6" />
                    KIRIM
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
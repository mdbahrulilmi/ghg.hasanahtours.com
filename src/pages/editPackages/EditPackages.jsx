import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditPackagesForm from './EditPackagesForm';
import updatePackage from '@/api/updatePackage';

export default function EditPackages() {
  const [formData, setFormData] = useState({
    tipe: '',
    nama_paket: '',
    tgl_berangkat: '',
    jumlah_hari: 0,
    maskapai: '',
    keberangkatan: '',
    landing: '',
    kodeflight: '',
    hrginfant: 0,
    hrgquad: 0,
    hrgtriple: 0,
    hrgdouble: 0,
    hrgperlengkapan: 0,
    imgpaketumroh: '',
    available_slot: 0,
    filled_slot: 0,
    max_slot: 0,
    itinerary: null,
    hotels: []
  });

  const [paket, setPaket] = useState(null);
  const [error, setError] = useState(null);
  const [itineraryFile, setItineraryFile] = useState(null);
  const [airlines, setAirlines] = useState([]);
  const [hotelsList, setHotelsList] = useState([]);
  const [packageTypes, setPackageTypes] = useState([]);
  const [kotaKeberangkatan, setKotaKeberangkatan] = useState([]);
  const [kotaTujuan, setKotaTujuan] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [airlinesRes, hotelsRes, tipePaketRes, kotaBerRes, kotaTujuanRes] = await Promise.all([
          fetch('https://be.hasanahtours.com/api/v1/master/airlines'),
          fetch('https://be.hasanahtours.com/api/v1/master/hotels'),
          fetch('https://be.hasanahtours.com/api/v1/master/tipePaket'),
          fetch('https://be.hasanahtours.com/api/v1/master/kotaKeberangkatan'),
          fetch('https://be.hasanahtours.com/api/v1/master/kotaTujuan')
        ]);

        if (!airlinesRes.ok || !hotelsRes.ok || !tipePaketRes.ok || !kotaBerRes.ok || !kotaTujuanRes.ok) {
          throw new Error('Gagal mengambil data master');
        }

        const airlinesData = await airlinesRes.json();
        const hotelsData = await hotelsRes.json();
        const tipePaketData = await tipePaketRes.json();
        const kotaBerData = await kotaBerRes.json();
        const kotaTujuanData = await kotaTujuanRes.json();

        setAirlines(airlinesData.data || []);
        setHotelsList(hotelsData.data || []);
        setPackageTypes(tipePaketData.data || []);
        setKotaKeberangkatan(kotaBerData.data || []);
        setKotaTujuan(kotaTujuanData.data || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMasterData();
  }, []);

  // Fetch paket terdaftar
  useEffect(() => {
    const fetchPaket = async () => {
      try {
        const res = await fetch(`https://be.hasanahtours.com/api/v1/registered-ghg/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data");
        const json = await res.json();
        setPaket(json.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPaket();
  }, [id]);

  useEffect(() => {
    if (!paket || !paket.package_id) return;

    const fetchPaketLengkap = async () => {
      try {
        const res = await fetch(`https://be.hasanahtours.com/api/v1/paket/${paket.package_id}`);
        if (!res.ok) throw new Error("Gagal mengambil data paket lengkap");
        const json = await res.json();
        const data = json.data;

        console.log(data);

        const hotelsArray = data.hotels ? Object.values(data.hotels).filter(Boolean).map((h, idx) => ({
          idhotelmitra: idx + 1,
          kota: h.city || '',
          nama_hotel: h.name || '',
          alamat: h.address || '',
          jarak: h.jarak || '',
          bintang: h.bintang || ''
        })) : [];

        const formatDate = (isoString) => {
          if (!isoString) return '';
          const date = new Date(isoString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        setFormData({
          kode_paket_db: data.kode_paket || "",
          tipe_id: data.tipe_paket.id || '',
          tipe: data.tipe_paket.category || '',
          nama_paket: paket.package_name || data.tipe_paket.name || '',
          tgl_berangkat: formatDate(data.penerbangan.tanggal_berangkat) || '',
          jumlah_hari: data.jumlah_hari || 0,
          maskapai_id: data.airline?.id || '',
          maskapai: data.airline?.name || '',
          kodeflight: data.penerbangan?.no_penerbangan || '',
          keberangkatan: data.lokasi?.keberangkatan?.name || '',
          keberangkatan_id: data.lokasi?.keberangkatan?.id || 0,
          kota_tujuan_id: data.lokasi?.tujuan?.id || 0,
          landing: data.lokasi?.tujuan?.name || '',
          hrginfant: parseFloat(data.harga?.bayi || 0),
          hargaber1: parseFloat(data.harga?.ber1 || 0),
          hrgquad: parseFloat(data.harga?.ber4 || 0),
          hrgtriple: parseFloat(data.harga?.ber3 || 0),
          hrgdouble: parseFloat(data.harga?.ber2 || 0),
          hrgperlengkapan: data.harga?.perlengkapan || 0,
          kurs_tetap: data.harga?.kurs_tetap || 0,
          available_slot: data.seat_info?.sisa_seat || 0,
          filled_slot: data.seat_info?.total_booked || 0,
          max_slot: data.seat_info?.total_kursi || 0,
          imgpaketumroh: data.gambar || '',
          itinerary: data.itinerary || null,
          hotel_jedda_id: data.hotels?.jedda?.id || null,
          hotel_medina_id: data.hotels?.medina?.id || null,
          hotel_mekka_id: data.hotels?.mekka?.id || null,
          hotels: hotelsArray
        });

      } catch (err) {
        setError(err.message);
      }
    };

    fetchPaketLengkap();
  }, [paket]);

  // Handlers sama seperti sebelumnya
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItineraryFile(file);
      setFormData(prev => ({ ...prev, itinerary: file }));
    }
  };

  const handleAddHotel = () => {
    setFormData(prev => ({
      ...prev,
      hotels: [...prev.hotels, { idhotelmitra: prev.hotels.length + 1, kota: '', nama_hotel: '', alamat: '', jarak: '', bintang: '' }]
    }));
  };

  const handleRemoveHotel = (index) => {
    setFormData(prev => ({
      ...prev,
      hotels: prev.hotels.filter((_, i) => i !== index)
    }));
  };

  const handleHotelChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      hotels: prev.hotels.map((hotel, i) => i === index ? { ...hotel, [field]: value } : hotel)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      update_id: paket.id,
      package_id: paket.package_code,
      kode_paket_db: formData.kode_paket_db,

      // ===== BASIC =====
      tipe_id: formData.tipe_id,
      tipe: formData.tipe,
      nama_paket: formData.nama_paket,
      tgl_berangkat: formData.tgl_berangkat,
      jumlah_hari: formData.jumlah_hari,

      // ===== AIRLINES =====
      maskapai_id: formData.maskapai_id,
      maskapai: formData.maskapai,
      kodeflight: formData.kodeflight,

      // ===== ROUTE =====
      keberangkatan: formData.keberangkatan,
      keberangkatan_id: formData.keberangkatan_id,
      kota_tujuan_id: formData.kota_tujuan_id,
      landing: formData.landing,

      // ===== HARGA =====
      hrginfant: Number(formData.hrginfant),
      hargaber1: Number(formData.hargaber1),
      hrgquad: Number(formData.hrgquad),
      hrgtriple: Number(formData.hrgtriple),
      hrgdouble: Number(formData.hrgdouble),
      hrgperlengkapan: Number(formData.hrgperlengkapan),

      // ===== SLOT =====
      available_slot: formData.available_slot,
      filled_slot: formData.filled_slot,
      max_slot: formData.max_slot,

      // ===== HOTEL =====
      hotel_mekka_id: formData.hotel_mekka_id,
      hotel_medina_id: formData.hotel_medina_id,
      hotel_jedda_id: formData.hotel_jedda_id,
      hotels: formData.hotels,

      // ===== LAINNYA =====
      kurs_tetap: formData.kurs_tetap,
      imgpaketumroh: formData.imgpaketumroh,

      itinerary: itineraryFile || null,
    };

    try {
      await updatePackage(payload);
      alert("Update berhasil");
      // navigate(-1);
    } catch (err) {
      console.error(err);
      alert(err.message || "Gagal update paket");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">{error}</div>;
  if (!paket) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading paket, tunggu sebentar...</div>;
  return (
    <EditPackagesForm
      paket={paket}
      formData={formData}
      handleChange={handleChange}
      handleFileChange={handleFileChange}
      itineraryFile={itineraryFile}
      handleAddHotel={handleAddHotel}
      handleRemoveHotel={handleRemoveHotel}
      handleHotelChange={handleHotelChange}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      setFormData={setFormData}
      setItineraryFile={setItineraryFile}
      airlines={airlines}
      hotelsList={hotelsList}
      packageTypes={packageTypes}
      kotaKeberangkatan={kotaKeberangkatan}
      kotaTujuan={kotaTujuan}
    />
  );
}

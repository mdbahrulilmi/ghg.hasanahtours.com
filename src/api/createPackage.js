import getToken from "@/api/getToken";

async function createPackage(payload) {
  const token = await getToken();

  const {
    tipe,
    nama_paket,
    tgl_berangkat,
    jumlah_hari,
    maskapai,
    keberangkatan,
    landing,
    kodeflight,
    hrginfant,
    hrgquad,
    hrgtriple,
    hrgdouble,
    hrgperlengkapan,
    imgpaketumroh,
    available_slot,
    filled_slot,
    max_slot,
    itinerary,
    hotels,
    package_id
  } = payload;

  const body = {
    tipe,
    nama_paket,
    tgl_berangkat,
    jumlah_hari,
    maskapai,
    keberangkatan,
    landing,
    kodeflight,
    hrginfant,
    hrgquad,
    hrgtriple,
    hrgdouble,
    hrgperlengkapan,
    imgpaketumroh,
    available_slot,
    filled_slot,
    max_slot,
    itinerary,
    hotels,
    token,
    package_id
  };

  const res = await fetch(
    "https://be.hasanahtours.com/api/duft/create-package",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );

  const data = await res.json();

  if (!res.ok || data.status !== true) {
    throw new Error(data.message || "Gagal create package");
  }

  return {
    kode_paket: data.kode_paket,
    message: data.message
  };
}

export default createPackage;

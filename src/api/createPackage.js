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
    hotels
  };

  const res = await fetch(
    `/duft/api/mitra/v2/create-package`,
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

  if (!res.ok) {
    throw new Error(data.message || "Gagal create package");
  }

  const bodyDB = {
    package_id,
    package_code: data.data.kode_paket,
    package_name: nama_paket

  }

  const toDB = await fetch(
    `https://be.hasanahtours.com/api/v1/registered-ghg`,
    {
      method: "POST",
       headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyDB)
    }
  );
  console.log("BODY DARI FRONTEND:", bodyDB);
  const data_db = await toDB.json();

  if (!toDB.ok) {
    throw new Error(data_db.message || "Gagal create package");
  }

  return data_db;
}

export default createPackage;

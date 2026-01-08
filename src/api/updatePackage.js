import getToken from "@/api/getToken";

async function updatePackage(payload) {
  const token = await getToken();

  const {
    tipe_id,
    tipe,
    nama_paket,
    tgl_berangkat,
    jumlah_hari,
    maskapai_id,
    maskapai,
    keberangkatan_id,
    keberangkatan,
    kota_tujuan_id,
    landing,
    kodeflight,
    hrginfant,
    hargaber1,
    hrgquad,
    hrgtriple,
    hrgdouble,
    hrgperlengkapan,
    imgpaketumroh,
    available_slot,
    filled_slot,
    max_slot,
    hotel_mekka_id,
    hotel_jedda_id,
    hotel_medina_id,
    hotels,
    kurs_tetap,
    package_id,
    kode_paket_db,
    update_id,
  } = payload;

  const body = {
    tipe_id,
    tipe,
    nama_paket,
    tgl_berangkat,
    jumlah_hari,
    maskapai_id,
    maskapai,
    keberangkatan_id,
    keberangkatan,
    kota_tujuan_id,
    landing,
    kodeflight,
    hrginfant,
    hargaber1,
    hrgdouble,
    hrgtriple,
    hrgquad,
    hrgperlengkapan,
    imgpaketumroh,
    available_slot,
    filled_slot,
    max_slot,
    hotel_mekka_id,
    hotel_jedda_id,
    hotel_medina_id,
    hotels,
    kurs_tetap,
    package_id,
    kode_paket_db,
    update_id,
    token
  };

  console.log("PAYLOAD UPDATE PACKAGE FRONTEND:", body);

  const res = await fetch("https://be.hasanahtours.com/api/duft/update-package", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  console.log("RESPONSE UPDATE PACKAGE BACKEND:", data);

  if (!res.ok) {
    throw new Error(data.message || "Gagal update package");
  }

  return data;
}

export default updatePackage;

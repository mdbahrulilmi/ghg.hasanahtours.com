import getToken from "@/api/getToken";
import { data } from "react-router-dom";

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
    kode_paket: package_id,
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
    max_slot,
    available_slot,
    filled_slot,
    hotels
  };

  let dataMitra;
  try {
    const res = await fetch(`/duft/api/mitra/v2/update-package`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    dataMitra = await res.json();
    console.log("STEP 1 RESPONSE (MITRA):", dataMitra);

    if (!res.ok) {
      throw new Error(dataMitra.message || "Gagal update mitra");
    }
  } catch (error) {
    console.error("❌ STEP 1 ERROR (MITRA):", error);
    throw error;
  }

  try {
    const toDB = await fetch(
      `https://be.hasanahtours.com/api/v1/registered-ghg/${update_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          package_name : nama_paket
        })
      }
    );

    const dataDB = await toDB.json();
    console.log("STEP 2 RESPONSE (REGISTER GHG):", dataDB);

    if (!toDB.ok) {
      throw new Error(dataDB.message || "Gagal update timestamp GHG");
    }
  } catch (error) {
    console.error("❌ STEP 2 ERROR (REGISTER GHG):", error);
    throw error;
  }


  const updateBodyDB = {
    kode_paket : kode_paket_db,
    nama_paket : nama_paket,
    tipe_paket_id : tipe_id,
    total_kursi : max_slot,
    // total_booked : filled_slot,
    // booked_ppiu : filled_slot,
    // booked_ghg : 0,
    // sisa_seat : (max_slot-filled_slot),
    airlines_id : maskapai_id,
    jumlah_hari : jumlah_hari,
    hotel_mekka : hotel_mekka_id,
    hotel_medina : hotel_medina_id,
    hotel_jedda : hotel_jedda_id,
    keberangkatan_id : keberangkatan_id,
    kota_tujuan_id : kota_tujuan_id,
    no_penerbangan : kodeflight,
    tanggal_berangkat : tgl_berangkat,
    kurs_tetap : kurs_tetap,
    hargaber1 : hargaber1,
    hargaber2 : hrgdouble,
    hargaber3 : hrgtriple,
    hargaber4 : hrgquad,
    hargabayi : hrginfant,
    harga_perlengkapan : hrgperlengkapan,
    gambar : imgpaketumroh,
  };

  try {
    const toPackageDB = await fetch(
      `https://be.hasanahtours.com/api/v1/ghg-paket/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateBodyDB)
      }
    );

    console.log("BODY DARI FRONTEND (UPDATE PACKAGE DB):", updateBodyDB);

    const data_package_db = await toPackageDB.json();
    console.log("STEP 3 RESPONSE (UPDATE PACKAGE DB):", data_package_db);

    if (!toPackageDB.ok) {
      console.error("VALIDATION ERROR FROM BACKEND:", data_package_db);
      throw new Error(data_package_db.message || "Gagal update package");
    }

    return data_package_db;

  } catch (error) {
    console.error("❌ STEP 3 ERROR (UPDATE PACKAGE DB):", error);
    throw error;
  }
}

export default updatePackage;

// updateSeat.js
import getToken from "./getToken";

async function updateSeat({ kode_paket, kode_paket_db, filled_slot, max_slot, available_slot, booked_ppiu, booked_ghg }) {
  try {
    const token = await getToken();

    const updateSeat = {
      kode_paket,
      kode_paket_db,
      filled_slot,
      max_slot,
      available_slot,
      token,
      booked_ppiu, 
      booked_ghg
    }
    console.log(updateSeat);

    const res = await fetch("https://be.hasanahtours.com/api/duft/update-seat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateSeat),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Gagal update seat");

    return data; // backend handle Duft + DB lokal
  } catch (err) {
    console.error("UPDATE SEAT ERROR:", err);
    throw err;
  }
}

export default updateSeat;

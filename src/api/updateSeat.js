import getToken from "./getToken";

async function updateSeat({
  kode_paket,
  kode_paket_db,
  booked_ppiu,
  booked_ghg,
  filled_slot,
  max_slot,
  available_slot,
}) {
  const token = await getToken();



  const res = await fetch("/duft/api/mitra/v2/update-seat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kode_paket,
      available_slot,
      filled_slot,
      max_slot,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal update seat (DUFT)");
  }

  const dataPackageDB = {
        total_booked: filled_slot,
        booked_ppiu: booked_ppiu,
        total_kursi: max_slot,
  }

  const toPackageDB = await fetch(
    `https://be.hasanahtours.com/api/v1/registered-ghg/seat/${kode_paket_db}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(dataPackageDB),
    }
  );

  const text = await toPackageDB.text();
  console.log("PACKAGE DB STATUS:", dataPackageDB);
  console.log("PACKAGE DB RESPONSE:", text);

  if (!toPackageDB.ok) {
    throw new Error(
      `Gagal sync Package DB (${toPackageDB.status})`
    );
  }

  return data;
}

export default updateSeat;

import getToken from "./getToken";

async function uploadItinerary({ kode_paket, file }) {
  const token = await getToken();

  const formData = new FormData();
  formData.append("kode_paket", kode_paket);
  formData.append("file", file);

  const res = await fetch(`/duft/api/mitra/v2/upload-itenary`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const contentType = res.headers.get("content-type");

  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();
    console.error("NON JSON RESPONSE:", text);
    throw new Error("Response bukan JSON (kemungkinan unauthorized / redirect)");
  }

  if (!res.ok) {
    throw new Error(data.message || "Gagal upload itinerary");
  }

  return data;
}

export default uploadItinerary;

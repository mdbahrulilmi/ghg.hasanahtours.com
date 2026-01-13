import getToken from "./getToken";

async function uploadItinerary({ kode_paket, file }) {
  try {
    const token = await getToken();

    if (!file) throw new Error("File itinerary tidak ditemukan");

    const formData = new FormData();
    formData.append("kode_paket", kode_paket);
    formData.append("file", file);
    formData.append("token", token);

    for (let [key, value] of formData.entries()) {
    }

    const res = await fetch(`https://be.hasanahtours.com/api/duft/upload-itinerary`, {
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
      throw new Error("Response bukan JSON (kemungkinan unauthorized / redirect)");
    }

    if (!res.ok) {
      throw new Error(data.message || "Gagal upload itinerary");
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export default uploadItinerary;

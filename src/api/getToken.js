async function getToken(){
    try {
    const res = await fetch(
      "/duft/api/mitra/v2/get-token",
      {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id: import.meta.env.VITE_DUFT_CLIENT_ID,
            client_key: import.meta.env.VITE_DUFT_CLIENT_KEY,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Gagal create package");
    }

    return data.data.token;
  } catch (err) {
    console.error("Error:", err.message);
    throw err;
  }
}

export default getToken;
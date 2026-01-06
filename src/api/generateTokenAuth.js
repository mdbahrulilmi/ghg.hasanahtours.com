const generateTokenAuth = async (clientId, clientKey) => {
  try {
    const res = await fetch("https://be.hasanahtours.com/api/v1/Auth", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ client_id: clientId, client_key: clientKey }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { status: res.status, message: data.message || "Error" };
    }

    return data.data.token;
  } catch (err) {
    return { status: 500, message: "Server error" };
  }
};

export default generateTokenAuth;
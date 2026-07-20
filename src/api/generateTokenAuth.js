const generateTokenAuth = async (clientId, clientKey) => {
  const res = await fetch("https://be.hasanahtours.com/api/v1/Auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_key: clientKey,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login gagal");
  }

  return data.data.token;
};

export default generateTokenAuth;
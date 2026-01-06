const mapHotelsToGHG = (hotels) => {
  if (!hotels) return []

  const result = []

  if (hotels.mekka) {
    result.push({
      idhotelmitra: hotels.mekka.id,
      kota: hotels.mekka.city,
      nama_hotel: hotels.mekka.name,
      alamat: "",
      jarak: "100 Meter",
      bintang: "3"
    })
  }

  if (hotels.medina) {
    result.push({
      idhotelmitra: hotels.medina.id,
      kota: hotels.medina.city,
      nama_hotel: hotels.medina.name,
      alamat: "",
      jarak: "100 Meter",
      bintang: "3"
    })
  }

  return result
}

export default mapHotelsToGHG;
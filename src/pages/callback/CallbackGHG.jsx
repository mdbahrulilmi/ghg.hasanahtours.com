import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CallbackGHGDocs() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            GHG Callback Documentation
          </h1>
          <p className="text-gray-600">
            API Documentation for GoHalalGo (GHG) Integration
          </p>
        </div>

        {/* Overview */}
        <Card className="rounded-2xl">
          <CardHeader className="border-b bg-white rounded-t-2xl">
            <CardTitle className="text-xl">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-gray-700 space-y-3">
            <p>
              Endpoint ini digunakan oleh <span className="font-semibold">GoHalalGo (GHG)</span> 
              untuk mengirim data booking ke sistem internal Hasanah Tour.
            </p>

            <p className="font-semibold">Callback ini tidak membuat booking internal, melainkan:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Update seat paket internal</li>
              <li>Sync seat ke sistem GHG</li>
              <li>Menyimpan data callback & jamaah untuk audit</li>
            </ul>
          </CardContent>
        </Card>

        {/* Endpoint */}
        <Card className="rounded-2xl">
          <CardHeader className="border-b bg-white rounded-t-2xl">
            <CardTitle className="text-xl">Endpoint</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-sm">
              POST /callback/ghg
            </div>

            <p className="text-sm text-gray-600">
              <span className="font-semibold">Content-Type:</span>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded-2xl">application/json</code>
            </p>

            <div className="bg-gray-100 p-3 rounded-lg text-sm font-mono">
              <pre>{`Token: <TOKEN_GHG>`}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Request Payload */}
        <Card className="rounded-2xl">
          <CardHeader className="border-b bg-white rounded-t-2xl">
            <CardTitle className="text-xl">Request Payload</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">

            <div className="bg-slate-900 text-gray-100 p-4 rounded-2xl font-mono text-sm overflow-auto">
<pre>{`{
  "kode_paket": "QR2ZTLC3P8",
  "kode_booking": "TGHG5KDUBSD",
  "jumlah_pax": 2,
  "status": "BOOKED",
  "tanggal": "2026-01-06 09:36:33",
  "jamaah": [
    {
      "nama_jamaah": "test januari",
      "kamar": "4"
    },
    {
      "nama_jamaah": "test januari",
      "kamar": "5"
    }
  ]
}`}</pre>
            </div>

            {/* Payload Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Field</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">

                  <tr>
                    <td className="p-3"><code>kode_paket</code></td>
                    <td className="p-3">string</td>
                    <td className="p-3">Kode paket GHG</td>
                  </tr>

                  <tr>
                    <td className="p-3"><code>kode_booking</code></td>
                    <td className="p-3">string</td>
                    <td className="p-3">Kode booking unik dari GHG</td>
                  </tr>

                  <tr>
                    <td className="p-3"><code>jumlah_pax</code></td>
                    <td className="p-3">integer</td>
                    <td className="p-3">Jumlah jamaah / seat</td>
                  </tr>

                  <tr>
                    <td className="p-3"><code>status</code></td>
                    <td className="p-3">string</td>
                    <td className="p-3">
                      Status booking (<code>BOOKED</code>, <code>CANCELLED</code>, dll)
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3"><code>tanggal</code></td>
                    <td className="p-3">datetime</td>
                    <td className="p-3">Tanggal booking GHG (YYYY-MM-DD HH:mm:ss)</td>
                  </tr>

                  <tr>
                    <td className="p-3"><code>jamaah</code></td>
                    <td className="p-3">array</td>
                    <td className="p-3">Detail jamaah yang dibooking</td>
                  </tr>

                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Jamaah Object */}
        <Card className="rounded-2xl">
          <CardHeader className="border-b bg-white rounded-t-2xl">
            <CardTitle className="text-xl">Jamaah Object</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Field</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3"><code>nama_jamaah</code></td>
                  <td className="p-3">string</td>
                  <td className="p-3">Nama jamaah</td>
                </tr>
                <tr>
                  <td className="p-3"><code>kamar</code></td>
                  <td className="p-3">string</td>
                  <td className="p-3">Nomor / tipe kamar jamaah</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="rounded-2xl">
          <CardHeader className="border-b bg-white rounded-t-2xl">
            <CardTitle className="text-xl">Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-2">
            <ul className="list-disc ml-6">
              <li>Callback bersifat <b>idempotent</b> berdasarkan <code>kode_booking</code></li>
              <li>Seat dihitung dari <code>jumlah_pax</code></li>
              <li>Data jamaah hanya untuk referensi & audit</li>
              <li>Booking GHG tidak membuat booking internal Hasanah Tour</li>
              <li>Semua payload disimpan sebagai <code>raw_payload</code></li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

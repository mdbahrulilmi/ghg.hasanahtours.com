import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ActivePackages from "./pages/active/ActivePackages";
import EditPackages from "./pages/editPackages/EditPackages";
import UpdateSeatsPage from "./pages/updateSeats/UpdateSeats";
import UploadItinerary from "./pages/updateItinerary/UploadItinerary";
import CallbackGHGDocs from "./pages/callback/CallbackGHG";
import LoginPage from "./pages/login/login";
import PaketTersedia from "./pages/paketTersedia/PaketTersedia";
import AirlinesPage from "./pages/airlines/airlinesPage";
import CountryPage from "./pages/country/countryPage";
import HotelPage from "./pages/hotel/HotelPage";
import CitiesPage from "./pages/cities/citiesPage";
import PackageTypePage from "./pages/tipePaket/packageTypePage";
import KotaKeberangkatanPage from "./pages/kotaKeberangkatan/KotaKeberangkatanPage";
import KotaTujuanPage from "./pages/kotaTujuan/KotaTujuanPage";
import PackagePage from "./pages/paket/PackageListPage";
import PackageFormPage from "./pages/paket/PackageFormPage";
import BookingList from "./pages/booking/BookingList";
import BookingForm from "./pages/booking/BookingForm";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('tokenAuth');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Semua route ini protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Master GHG */}
          <Route index element={<Navigate to="paket-tersedia" />} />
          <Route path="paket-tersedia" element={<PaketTersedia />} />
          <Route path="paket-aktif" element={<ActivePackages />} />
          <Route path="edit-paket/:id" element={<EditPackages />} />
          <Route path="seats" element={<UpdateSeatsPage />} />
          <Route path="upload-itinerary" element={<UploadItinerary />} />
          <Route path="callback-ghg" element={<CallbackGHGDocs />} />

          {/* Master Hasanahtours */}
          <Route path="airlines" element={<AirlinesPage />} />
          <Route path="country" element={<CountryPage />} />
          <Route path="hotel" element={<HotelPage />} />
          <Route path="city" element={<CitiesPage />} />
          <Route path="package-type" element={<PackageTypePage />} />
          <Route path="departure" element={<KotaKeberangkatanPage />} />
          <Route path="landing" element={<KotaTujuanPage />} />
          <Route path="package" element={<PackagePage />} />
          <Route path="/package/create" element={<PackageFormPage />} />
          <Route path="/package/edit/:kodePaket" element={<PackageFormPage />} />

          {/* Transaksi */}
          <Route path="/booking" element={<BookingList />} />
          <Route path="/booking/create" element={<BookingForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ActivePackages from "./pages/active/ActivePackages";
import EditPackages from "./pages/editPackages/EditPackages";
import UpdateSeatsPage from "./pages/updateSeats/UpdateSeats";
import UploadItinerary from "./pages/updateItinerary/UploadItinerary";
import CallbackGHGDocs from "./pages/callback/CallbackGHG";
import LoginPage from "./pages/login/login";
import PaketTersedia from "./pages/paketTersedia/PaketTersedia";

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
          <Route index element={<Navigate to="paket-tersedia" />} />
          <Route path="paket-tersedia" element={<PaketTersedia />} />
          <Route path="paket-aktif" element={<ActivePackages />} />
          <Route path="edit-paket/:id" element={<EditPackages />} />
          <Route path="seats" element={<UpdateSeatsPage />} />
          <Route path="upload-itinerary" element={<UploadItinerary />} />
          <Route path="callback-ghg" element={<CallbackGHGDocs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

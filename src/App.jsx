import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/public/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DonorDashboard from "./pages/donor/Dashboard";
import DonorAlerts from "./pages/donor/Alerts";
import HospitalDashboard from "./pages/hospital/Dashboard";
import HospitalAlerts from "./pages/hospital/Alerts";
import Profil from "./pages/Profil";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donor/dashboard" element={<DonorDashboard />} />
        <Route path="/donor/alerts" element={<DonorAlerts />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/alerts" element={<HospitalAlerts />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

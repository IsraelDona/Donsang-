import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, LayoutDashboard, Bell, User, LogOut } from "lucide-react";

export default function DashboardLayout({ profile, onLogout, children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const basePath = profile?.role === "hospital" ? "/hospital" : "/donor";
  const roleLabel = profile?.role === "hospital" ? "Hôpital" : "Donneur";

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      {/* --- SIDEBAR DESKTOP (Ton design conservé) --- */}
      <aside className="hidden w-64 flex-col bg-red-700 p-6 text-white md:flex">
        <Link to="/" className="mb-8 block font-bold text-xl tracking-tight">
          DonSang+
        </Link>

        <div className="mb-8 rounded-xl bg-red-800/70 p-4 shadow-inner">
          <p className="text-[10px] uppercase tracking-[0.2em] text-red-200 font-bold">Profil</p>
          <p className="mt-2 font-semibold truncate">{profile?.fullName || "Chargement..."}</p>
          <p className="text-sm text-red-100 opacity-80">{profile?.city || "Ville..."}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-md bg-white px-2 py-1 text-[10px] font-black text-red-700 uppercase">
              {profile?.bloodGroup || "N/A"}
            </span>
            <span className="rounded-md bg-red-200 px-2 py-1 text-[10px] font-bold text-red-900 uppercase">
              {roleLabel}
            </span>
          </div>
        </div>

        <ul className="space-y-3 text-sm flex-1">
          <li>
            <NavLink
              to={`${basePath}/dashboard`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition ${isActive ? "bg-red-900 shadow-md font-bold" : "hover:bg-red-800 text-red-100"}`
              }
            >
              <LayoutDashboard size={18} /> Tableau de bord
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`${basePath}/alerts`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition ${isActive ? "bg-red-900 shadow-md font-bold" : "hover:bg-red-800 text-red-100"}`
              }
            >
              <Bell size={18} /> Alertes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profil"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition ${isActive ? "bg-red-900 shadow-md font-bold" : "hover:bg-red-800 text-red-100"}`
              }
            >
              <User size={18} /> Profil
            </NavLink>
          </li>
        </ul>

        <button
          onClick={onLogout}
          className="mt-auto flex items-center gap-3 rounded-lg bg-white/10 px-3 py-2 text-left text-sm font-semibold hover:bg-white/20 transition border border-white/5"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </aside>

      {/* --- HEADER MOBILE (Avec Hamburger) --- */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4 md:hidden sticky top-0 z-50">
          <span className="font-bold text-red-600 text-lg italic">DonSang+</span>
          <button 
            onClick={toggleMenu}
            className="p-2 text-red-700 bg-red-50 rounded-lg"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* --- MENU MOBILE OVERLAY --- */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-red-700 text-white md:hidden flex flex-col p-6 animate-in slide-in-from-top">
            <div className="flex justify-between items-center mb-10">
              <span className="font-bold text-xl italic">Menu</span>
              <button onClick={toggleMenu}><X size={30} /></button>
            </div>
            <nav className="space-y-4">
              <NavLink 
                to={`${basePath}/dashboard`} 
                onClick={toggleMenu}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/10 font-bold"
              >
                <LayoutDashboard size={24}/> Tableau de bord
              </NavLink>
              <NavLink 
                to={`${basePath}/alerts`} 
                onClick={toggleMenu}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/10 font-bold"
              >
                <Bell size={24}/> Alertes
              </NavLink>
              <NavLink 
                to="/profil" 
                onClick={toggleMenu}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/10 font-bold"
              >
                <User size={24}/> Profil
              </NavLink>
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-red-900 font-bold mt-10"
              >
                <LogOut size={24}/> Déconnexion
              </button>
            </nav>
          </div>
        )}

        <main className="p-4 md:p-8 max-w-5xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
import { Link, NavLink } from "react-router-dom";

export default function DashboardLayout({ profile, onLogout, children }) {
  const roleLabel = profile?.role === "hospital" ? "Hôpital" : "Donneur";

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      <aside className="hidden w-64 flex-col bg-red-700 p-6 text-white md:flex">
        <Link to="/" className="mb-8 block font-bold">
          DonSang+
        </Link>

        <div className="mb-8 rounded-xl bg-red-800/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-red-200">Profil</p>
          <p className="mt-2 font-semibold">{profile?.fullName || "Nom non renseigné"}</p>
          <p className="text-sm text-red-100">{profile?.city || "Ville non renseignée"}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-red-700">
              {profile?.bloodGroup || "N/A"}
            </span>
            <span className="rounded-md bg-red-200 px-2 py-1 text-xs font-bold text-red-900">
              {roleLabel}
            </span>
          </div>
        </div>

        <ul className="space-y-3 text-sm">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 ${isActive ? "bg-red-900" : "hover:bg-red-800"}`
              }
            >
              Tableau de bord
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/alerts"
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 ${isActive ? "bg-red-900" : "hover:bg-red-800"}`
              }
            >
              Alertes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profil"
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 ${isActive ? "bg-red-900" : "hover:bg-red-800"}`
              }
            >
              Profil
            </NavLink>
          </li>
        </ul>

        <button
          onClick={onLogout}
          className="mt-auto w-full rounded-lg bg-white/15 px-3 py-2 text-left text-sm font-semibold hover:bg-white/25"
        >
          Déconnexion
        </button>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4 md:hidden">
          <span className="font-bold text-red-600">DonSang+</span>
          <div className="flex items-center gap-2 text-sm">
            <NavLink to="/dashboard" className="rounded-full bg-red-50 px-3 py-1 text-red-700">
              Dashboard
            </NavLink>
            <NavLink to="/alerts" className="rounded-full bg-red-50 px-3 py-1 text-red-700">
              Alertes
            </NavLink>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

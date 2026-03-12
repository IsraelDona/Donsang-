import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-10 py-5">
        <Link to="/" className="flex items-center gap-2 font-bold text-red-600">
          <span className="text-2xl">DonSang+</span>
        </Link>

        <div className="hidden items-center gap-8 text-base text-gray-700 md:flex">
          <a href="#decouverte" className="font-medium hover:text-red-600">
            Découverte
          </a>
          <a href="#fonctionnalites" className="font-medium hover:text-red-600">
            Fonctionnalités
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="animate-cta rounded-xl border border-gray-300 px-5 py-2.5 text-base font-semibold text-gray-700 hover:border-red-600 hover:text-red-600"
          >
            Connexion
          </Link>
        </div>
      </div>
    </nav>
  );
}

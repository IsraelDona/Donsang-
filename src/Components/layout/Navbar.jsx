import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // On garde juste les icônes pour le mobile

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-10 py-5">
        
        {/* LOGO - À GAUCHE */}
        <Link to="/" className="flex items-center gap-2 font-bold text-red-600">
          <span className="text-2xl">DonSang+</span>
        </Link>

        {/* MENUS - CENTRÉS (Desktop uniquement) */}
        <div className="hidden items-center gap-8 text-base text-gray-700 md:flex">
          <a href="#decouverte" className="font-medium hover:text-red-600 transition-colors">
            Découverte
          </a>
          <a href="#fonctionnalites" className="font-medium hover:text-red-600 transition-colors">
            Fonctionnalités
          </a>
        </div>

        {/* CONNEXION - À DROITE + HAMBURGER MOBILE */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Ton bouton Connexion original (Caché sur très petit mobile si tu veux, ou maintenu) */}
          <Link
            to="/login"
            className="animate-cta hidden sm:block rounded-xl border border-gray-300 px-5 py-2.5 text-base font-semibold text-gray-700 hover:border-red-600 hover:text-red-600"
          >
            Connexion
          </Link>

          {/* BOUTON HAMBURGER (Uniquement mobile) */}
          <button 
            className="md:hidden p-2 text-gray-700 hover:text-red-600 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE DÉROULANT (S'affiche sous la barre) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300 shadow-xl">
          <a 
            href="#decouverte" 
            onClick={() => setIsOpen(false)}
            className="text-lg font-medium text-gray-700 hover:text-red-600"
          >
            Découverte
          </a>
          <a 
            href="#fonctionnalites" 
            onClick={() => setIsOpen(false)}
            className="text-lg font-medium text-gray-700 hover:text-red-600"
          >
            Fonctionnalités
          </a>
          <hr className="border-gray-100" />
          <Link 
            to="/login" 
            onClick={() => setIsOpen(false)}
            className="w-full text-center rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 hover:border-red-600"
          >
            Connexion
          </Link>
          <Link 
            to="/register" 
            onClick={() => setIsOpen(false)}
            className="w-full text-center rounded-xl bg-red-600 py-3 font-bold text-white shadow-lg"
          >
            S'inscrire
          </Link>
        </div>
      )}
    </nav>
  );
}
import Navbar from "../../Components/layout/Navbar";
import Button from "../../Components/ui/Button";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO */}
      <section className="mx-auto flex max-w-5xl  items-center gap-10 px-10 py-20 text-center">
        <div className="animate-fade-up">
          <p className="mb-4 text-sm text-gray-500">Plateforme nationale de coordination sanguine</p>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
            Quand chaque minute compte,
            <br />
            la disponibilité du sang doit être{" "}
            <span className="text-red-600">visible</span>.
          </h1>
          <p className="mb-8 text-gray-600">
            DonSang+ connecte les hôpitaux et les donneurs compatibles en temps réel pour accélérer
            la réponse aux urgences vitales.
          </p>
          <div className="flex flex-wrap justify-center gap-4" />
        </div>

        <div className="animate-float">
          <img src="/assets/hero-donor.png" alt="Donneur de sang" className="w-full max-w-2xl" />
        </div>
      </section>

      {/* DECOUVERTE : PROBLEMES + SOLUTIONS */}
      <section id="decouverte" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-10 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Découverte : le problème et la solution</h2>
            <p className="text-gray-600">
              Dans les urgences, la disponibilité du sang n’est pas visible en temps réel. Les
              équipes perdent du temps à trouver des donneurs compatibles, surtout quand un groupe
              sanguin est rare.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
                <img src="/assets/problem-visibility.svg" alt="" className="h-12 w-12" />
                <div>
                  <h3 className="font-semibold">Manque de visibilité</h3>
                  <p className="text-sm text-gray-600">
                    Les hôpitaux ne voient pas immédiatement les donneurs disponibles.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
                <img src="/assets/problem-compatibility.svg" alt="" className="h-12 w-12" />
                <div>
                  <h3 className="font-semibold">Compatibilité lente</h3>
                  <p className="text-sm text-gray-600">
                    La recherche de compatibilité prend trop de temps en urgence.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
                <img src="/assets/problem-stocks.svg" alt="" className="h-12 w-12" />
                <div>
                  <h3 className="font-semibold">Stocks instables</h3>
                  <p className="text-sm text-gray-600">
                    Les stocks varient selon les groupes sanguins et les besoins.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-red-600">La solution DonSang+</h3>
            <p className="text-gray-600">
              DonSang+ centralise les besoins des hôpitaux et notifie instantanément les donneurs
              compatibles. Chaque réponse est tracée et confirmée pour gagner un temps vital.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="rounded-xl bg-red-50 p-4">
                Publication instantanée des urgences par groupe sanguin.
              </li>
              <li className="rounded-xl bg-red-50 p-4">
                Notifications ciblées vers les donneurs compatibles.
              </li>
              <li className="rounded-xl bg-red-50 p-4">
                Suivi complet des réponses et de la disponibilité.
              </li>
            </ul>
            <div>
              <Button>Créer une alerte</Button>
            </div>
          </div>
        </div>
      </section>

      {/* FONCTIONNALITES */}
      <section id="fonctionnalites" className="mx-auto grid max-w-7xl items-center gap-10 px-10 py-20 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Fonctionnalités clés</h2>
          <p className="text-gray-600">
            Une interface claire pour publier, répondre et suivre chaque urgence en temps réel.
          </p>
          <div className="space-y-3">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="font-semibold">Publication d’alerte simplifiée</h3>
              <p className="text-sm text-gray-600">
                Groupe sanguin, lieu, niveau d’urgence et notes en un seul formulaire.
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="font-semibold">Notifications intelligentes</h3>
              <p className="text-sm text-gray-600">
                Les donneurs compatibles sont alertés immédiatement.
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="font-semibold">Suivi des réponses</h3>
              <p className="text-sm text-gray-600">
                Historique clair des donneurs en route et des confirmations.
              </p>
            </div>
          </div>
        </div>

        <div className="animate-pulse-soft">
          <img src="/assets/phones-solution.svg" alt="Solutions sur mobile" className="w-full" />
        </div>
      </section>

      
      {/* CTA */}
      <section className="bg-white py-24 border-t border-gray-100">
  <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-10 text-center">
    <div className="space-y-4">
      <h2 className="text-3xl font-extrabold text-gray-900 md:text-5xl tracking-tight">
        Agissons maintenant pour sauver des vies
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Rejoignez DonSang+ et participez activement à la coordination des urgences sanguines. 
        Votre inscription peut faire la différence aujourd'hui.
      </p>
    </div>
    
    <div className="animate-fade-up">
      <Link to="/register">
        <Button className="px-12 py-7 text-xl font-semibold bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-200 hover:shadow-red-300 transform hover:-translate-y-1 transition-all duration-300 rounded-full">
          S'inscrire maintenant
        </Button>
      </Link>
    </div>
  </div>
      </section>
      {/* FOOTER */}
      <footer className="border-t bg-white py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-10">
          <h2 className="text-xl font-bold text-red-600">DonSang+</h2>
          <p className="text-sm text-gray-500">
            Plateforme nationale de coordination du don de sang
          </p>
        </div>
      </footer>
    </div>
  );
}

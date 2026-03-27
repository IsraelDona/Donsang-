import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth"; // IMPORTATION MANQUANTE
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../Services/firebase";

export default function Login() {
  const navigate = useNavigate();

  // ÉTATS INDISPENSABLES (Évite la page blanche)
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // FONCTION UTILITAIRE MANQUANTE
  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      // 1. Connexion via Auth
      const credentials = await signInWithEmailAndPassword(auth, form.email.trim(), form.password);
      
      // 2. Récupération du rôle dans Firestore
      const userDoc = await getDoc(doc(db, "users", credentials.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // 3. Redirection selon le rôle
        if (userData.role === "hospital") {
          navigate("/hospital/dashboard");
        } else {
          navigate("/donor/dashboard");
        }
      } else {
        setError("Profil utilisateur introuvable.");
      }
    } catch (e) {
      console.error(e);
      setError("Connexion échouée. Vérifiez votre email et mot de passe.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <form onSubmit={submitLogin} className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">Connexion</h1>
        <p className="mt-1 text-sm text-zinc-600">Accédez à votre espace DonSang+.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
            <input
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              placeholder="votre@email.com"
              type="email"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-red-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Mot de passe</label>
            <input
              value={form.password}
              onChange={(event) => setField("password", event.target.value)}
              placeholder="••••••••"
              type="password"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-red-500 transition-all"
              required
            />
          </div>

          <button
            disabled={submitting}
            className="w-full rounded-lg bg-red-600 py-2.5 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400 transition-colors shadow-md shadow-red-100"
          >
            {submitting ? "Connexion en cours..." : "Se connecter"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded bg-red-50 border border-red-100 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-zinc-600">
          Pas encore inscrit ?{" "}
          <Link to="/register" className="font-bold text-red-600 hover:underline">
            Créer un compte
          </Link>
        </p>
      </form>
    </main>
  );
}
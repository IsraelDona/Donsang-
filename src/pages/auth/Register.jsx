import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../Services/firebase";

// Constante pour les groupes sanguins
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Register() {
  const navigate = useNavigate();

  // État du formulaire
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    city: "",
    bloodGroup: "O+",
    role: "donor",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Vérifie si l'utilisateur est un donneur pour afficher le groupe sanguin
  const isDonor = useMemo(() => form.role === "donor", [form.role]);

  // Met à jour un champ spécifique du formulaire
  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitRegister = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // 1. Création de l'utilisateur dans Firebase Auth
      const credentials = await createUserWithEmailAndPassword(
        auth, 
        form.email.trim(), 
        form.password
      );

      // 2. Enregistrement des données profil dans Firestore
      await setDoc(doc(db, "users", credentials.user.uid), {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        city: form.city.trim(),
        role: form.role,
        bloodGroup: form.role === "donor" ? form.bloodGroup : "N/A",
        isAvailable: true,
        createdAt: serverTimestamp(),
      });

      // 3. IMPORTANT : Firebase connecte l'user automatiquement à la création.
      // On le déconnecte pour qu'il doive passer par la page de Login comme tu l'as demandé.
      await signOut(auth);

      // 4. Redirection vers la page de Login
      navigate("/login");

    } catch (e) {
      console.error("Erreur Inscription:", e);
      if (e.code === 'auth/email-already-in-use') {
        setError("Cet email est déjà utilisé par un autre compte.");
      } else {
        setError("L'inscription a échoué. Vérifiez vos informations.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <form 
        onSubmit={submitRegister} 
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">DonSang+</h1>
          <p className="mt-2 text-zinc-600">Créez votre compte pour commencer</p>
        </div>

        <div className="space-y-4">
          {/* Nom / Entité */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Nom complet ou Hôpital</label>
            <input
              value={form.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              placeholder="Ex: AKA Jospin ou CHU de Cotonou"
              required
            />
          </div>

          {/* Ville */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Ville</label>
            <input
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              placeholder="Votre ville"
              required
            />
          </div>

          {/* Rôle */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Type de compte</label>
              <select
                value={form.role}
                onChange={(e) => setField("role", e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 bg-white outline-none focus:border-red-600"
              >
                <option value="donor">Donneur</option>
                <option value="hospital">Hôpital</option>
              </select>
            </div>

            {/* Groupe Sanguin (Affiché seulement si Donneur) */}
            {isDonor && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Groupe Sanguin</label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) => setField("bloodGroup", e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 bg-white outline-none focus:border-red-600"
                >
                  {BLOOD_GROUPS.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Adresse Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              placeholder="nom@exemple.com"
              required
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              placeholder="6 caractères minimum"
              minLength={6}
              required
            />
          </div>

          {/* Erreur */}
          {error && (
            <div className="p-3 rounded bg-red-50 text-red-700 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          {/* Bouton Submit */}
          <button
            disabled={submitting}
            type="submit"
            className="w-full rounded-lg bg-red-600 py-3 font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-700 active:scale-95 disabled:bg-zinc-400 disabled:shadow-none"
          >
            {submitting ? "Création en cours..." : "S'inscrire"}
          </button>
        </div>

        {/* Lien vers Login pour ceux qui ont déjà un compte */}
        <div className="mt-8 text-center border-t border-zinc-100 pt-6">
          <p className="text-sm text-zinc-600">
            Déjà inscrit sur DonSang+ ?{" "}
            <Link to="/login" className="font-bold text-red-600 hover:underline">
              Se connecter ici
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
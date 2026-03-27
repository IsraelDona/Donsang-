import { useState, useEffect } from "react";
import { auth, db } from "../Services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import DashboardLayout from "../Components/layout/DashboardLayout";

export default function Profil() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setProfile({ id: user.uid, ...snap.data() });
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", profile.id);
      await updateDoc(userRef, profile);
      setMessage("✅ Profil mis à jour avec succès !");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Erreur lors de la mise à jour.");
    }
  };

  if (loading) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <DashboardLayout profile={profile} onLogout={() => auth.signOut()}>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Modifier mon profil</h2>
        
        {message && <p className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">{message}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom complet / Établissement</label>
            <input 
              type="text" 
              className="w-full mt-1 border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-red-500"
              value={profile.fullName || ""}
              onChange={(e) => setProfile({...profile, fullName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ville</label>
            <input 
              type="text" 
              className="w-full mt-1 border p-3 rounded-xl bg-gray-50"
              value={profile.city || ""}
              onChange={(e) => setProfile({...profile, city: e.target.value})}
            />
          </div>

          {/* Champs spécifiques au DONNEUR */}
          {profile.role === "donor" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Groupe Sanguin</label>
                <select 
                  className="w-full mt-1 border p-3 rounded-xl bg-gray-50"
                  value={profile.bloodGroup}
                  onChange={(e) => setProfile({...profile, bloodGroup: e.target.value})}
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Disponibilité</label>
                <select 
                  className="w-full mt-1 border p-3 rounded-xl bg-gray-50"
                  value={profile.isAvailable ? "true" : "false"}
                  onChange={(e) => setProfile({...profile, isAvailable: e.target.value === "true"})}
                >
                  <option value="true">Disponible</option>
                  <option value="false">Indisponible</option>
                </select>
              </div>
            </div>
          )}

          <button className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-100">
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
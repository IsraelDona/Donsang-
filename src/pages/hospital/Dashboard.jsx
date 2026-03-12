import { useState, useEffect } from "react";
import { auth, db } from "../../Services/firebase";
import { collection, query, where, onSnapshot, doc, getDoc, serverTimestamp,addDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../../Components/layout/DashboardLayout";

export default function HospitalDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [myAlertsCount, setMyAlertsCount] = useState(0);
  // --- LOGIQUE POUR LE FORMULAIRE ---
  const [showForm, setShowForm] = useState(false); // Pour afficher ou cacher
  const [form, setForm] = useState({ bloodGroup: "O+", location: "", notes: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Récupérer le profil
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setProfile({ id: user.uid, ...snap.data() });
        // Compter mes alertes à moi
        const q = query(collection(db, "alerts"), where("hospitalId", "==", user.uid));
        const stopSnapshot = onSnapshot(q, (snapshot) => {
          setMyAlertsCount(snapshot.docs.length);
        });
        return () => stopSnapshot();

      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      // Utilisation de addDoc (notion simple pour ajouter)
      await addDoc(collection(db, "alerts"), {
        hospitalId: profile.id,
        hospitalName: profile.fullName,
        bloodGroup: form.bloodGroup,
        location: form.location,
        notes: form.notes,
        volunteers: [],
        createdAt: serverTimestamp()
      });
      alert("Alerte publiée avec succès !");
      setShowForm(false); // On ferme le formulaire après
      setForm({ bloodGroup: "O+", location: "", notes: "" });
    } catch (err) {
      console.error(err); 
      alert("Erreur lors de la publication de l'alerte."); }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <DashboardLayout profile={profile} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* DESIGN ENTETE */}
        <div className="bg-red-700 text-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold">Tableau de bord Hôpital</h1>
          <p className="opacity-80">Gérez vos besoins en sang efficacement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl border text-center">
            <p className="text-gray-500">Mes alertes actives</p>
            <p className="text-4xl font-black text-red-600">{myAlertsCount}</p>
            <Link to="/alerts" className="text-sm text-blue-600 underline mt-2 block">
              Voir mes alertes
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl border flex flex-col justify-center">
            <p className="font-bold text-gray-800">Action rapide</p>
            {/* ICI : Si showForm est faux, on montre le bouton. Sinon on montre le formulaire */}
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="bg-red-600 text-white text-center py-2 rounded-lg font-bold hover:bg-red-700"
              >
                Publier un besoin
              </button>
            ) : (
              <form onSubmit={handlePublish} className="space-y-2 animate-in fade-in duration-300">
                <select
                  className="w-full border p-2 rounded-lg text-sm outline-none"
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="Lieu précis"
                  className="w-full border p-2 rounded-lg text-sm outline-none"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold">Valider</button>
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm">Annuler</button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* INFOS HÔPITAL */}
        <div className="bg-gray-50 p-4 rounded-xl border border-dashed">
          <p className="text-sm font-bold text-gray-600 uppercase">Informations établissement</p>
          <p className="mt-1 text-gray-800 font-medium">{profile?.fullName}</p>
          <p className="text-sm text-gray-500">{profile?.city}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
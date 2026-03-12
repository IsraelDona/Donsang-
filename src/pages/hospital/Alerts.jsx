import { useState, useEffect } from "react";
import { auth, db } from "../../Services/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  doc,
  getDoc 
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../Components/layout/DashboardLayout";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function HospitalAlerts() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [myAlerts, setMyAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  // État du formulaire
  const [form, setForm] = useState({
    hospitalName: "",
    bloodGroup: "O+",
    location: "",
    notes: "",
  });

  // 1. Vérifier la connexion et charger le profil
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile({ id: user.uid, ...docSnap.data() });
          // Pré-remplir le nom de l'hôpital dans le formulaire
          setForm(prev => ({ ...prev, hospitalName: docSnap.data().fullName }));
        }

        // 2. Écouter uniquement les alertes de cet hôpital
        const q = query(collection(db, "alerts"), where("hospitalId", "==", user.uid));
        const stopListening = onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setMyAlerts(docs);
        });

        return () => stopListening();
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Gestion de la déconnexion
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Envoi de l'alerte
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "alerts"), {
        hospitalId: profile.id,
        hospitalName: form.hospitalName,
        bloodGroup: form.bloodGroup,
        location: form.location,
        notes: form.notes,
        volunteers: [], // Liste vide au départ
        createdAt: serverTimestamp()
      });

      // Réinitialiser le formulaire (sauf le nom)
      setForm({ ...form, notes: "", location: "" });
      alert("Alerte publiée avec succès !");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de publier l'alerte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout profile={profile} onLogout={handleLogout}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* FORMULAIRE DE PUBLICATION */}
        <section className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Publier une nouvelle urgence</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Lieu (ex: Service Urgence, Bloc B)"
              className="p-2 border rounded-lg outline-none focus:border-red-500"
              value={form.location}
              onChange={(e) => setForm({...form, location: e.target.value})}
              required
            />
            <select 
              className="p-2 border rounded-lg outline-none focus:border-red-500"
              value={form.bloodGroup}
              onChange={(e) => setForm({...form, bloodGroup: e.target.value})}
            >
              {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <textarea
              placeholder="Notes additionnelles..."
              className="p-2 border rounded-lg outline-none focus:border-red-500 md:col-span-2"
              value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})}
            />
            <button 
              disabled={loading}
              className="md:col-span-2 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400"
            >
              {loading ? "Publication..." : "Lancer l'alerte"}
            </button>
          </form>
        </section>

        {/* LISTE DES ALERTES PUBLIÉES */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Vos alertes en cours</h2>
          {myAlerts.length === 0 ? (
            <p className="text-gray-500 italic">Aucune alerte publiée pour le moment.</p>
          ) : (
            myAlerts.map(alert => (
              <div key={alert.id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
                <div>
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-bold mr-2">
                    {alert.bloodGroup}
                  </span>
                  <span className="font-medium text-gray-700">{alert.location}</span>
                  <p className="text-xs text-gray-400 mt-1">{alert.notes}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-600 font-bold text-lg">
                    {alert.volunteers?.length || 0}
                  </p>
                  <p className="text-[10px] uppercase text-gray-400">Volontaires</p>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
import { useState, useEffect } from "react";
import { auth, db } from "../../Services/firebase";
import { doc, getDoc, updateDoc, collection, onSnapshot, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../Components/layout/DashboardLayout";

export default function DonorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true); // Empêche le saut vers la page d'accueil

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setProfile({ id: user.uid, ...snap.data() });
        }

        const stopSnapshot = onSnapshot(collection(db, "alerts"), (snapshot) => {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setAlerts(list);
          setLoading(false); // On affiche seulement quand les données sont là
        });
        return () => stopSnapshot();
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleHelp = async (alertId) => {
    if (!profile) return;
    try {
      const alertRef = doc(db, "alerts", alertId);
      await updateDoc(alertRef, { volunteers: arrayUnion(profile.id) });
      alert("Merci ! L'hôpital a été prévenu de votre aide.");
    } catch (err) {
      alert("Erreur lors de la confirmation.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-red-600">Chargement...</div>;

  return (
    <DashboardLayout profile={profile} onLogout={() => signOut(auth).then(() => navigate("/"))}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Espace Donneur</h1>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-red-600">Alertes urgentes ({alerts.length})</h2>
            {/* --- POINT ROUGE CLIGNOTANT --- */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
          </div>

          {alerts.length > 0 ? (
            alerts.map(alert => (
              <div key={alert.id} className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center hover:shadow-md transition">
                <div>
                  <p className="font-bold text-lg text-gray-900">{alert.bloodGroup} requis</p>
                  <p className="text-sm text-gray-500">{alert.hospitalName} - {alert.location}</p>
                </div>
                <button 
                  onClick={() => handleHelp(alert.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition"
                >
                  Je veux aider
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic text-sm">Aucune alerte pour le moment.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-200">
            <h2 className="font-bold mb-3 text-gray-700">Mes réglages</h2>
            <button 
              onClick={() => updateDoc(doc(db, "users", profile.id), {isAvailable: !profile.isAvailable})}
              className={`w-full py-2 rounded-lg font-bold transition ${profile?.isAvailable ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-600 border border-gray-200"}`}
            >
              Statut : {profile?.isAvailable ? "Disponible" : "Indisponible"}
            </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setProfile({ id: user.uid, ...snap.data() });

        // Charger les alertes en temps réel
        onSnapshot(collection(db, "alerts"), (snapshot) => {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setAlerts(list);
        });
      } else { navigate("/login"); }
    });
    return () => unsubscribe();
  }, [navigate]);

  // RÉPONDRE À UNE ALERTE
  const handleHelp = async (alertId) => {
    const alertRef = doc(db, "alerts", alertId);
    await updateDoc(alertRef, {
      volunteers: arrayUnion(profile.id) // Ajoute l'ID du donneur dans la liste
    });
    alert("Merci ! L'hôpital a été prévenu de votre aide.");
  };

  return (
    <DashboardLayout profile={profile} onLogout={() => signOut(auth).then(() => navigate("/"))}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Espace Donneur</h1>

        {/* LISTE DES ALERTES RÉELLES */}
        <div className="space-y-4">
          <h2 className="font-bold text-red-600">Alertes urgentes ({alerts.length})</h2>
          {alerts.map(alert => (
            <div key={alert.id} className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{alert.bloodGroup} requis</p>
                <p className="text-sm text-gray-600">{alert.hospitalName} - {alert.location}</p>
              </div>
              <button 
                onClick={() => handleHelp(alert.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
              >
                Je veux aider
              </button>
            </div>
          ))}
        </div>

        {/* PARAMÈTRES DÉPLACÉS ICI POUR PLUS DE LOGIQUE */}
        <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
            <h2 className="font-bold mb-2 text-gray-700">Mes réglages</h2>
            <button 
              onClick={() => updateDoc(doc(db, "users", profile.id), {isAvailable: !profile.isAvailable})}
              className={`w-full py-2 rounded-lg font-bold ${profile?.isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
            >
              Statut : {profile?.isAvailable ? "Disponible" : "Indisponible"}
            </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
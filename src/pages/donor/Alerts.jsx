import { useState, useEffect } from "react";
import { auth, db } from "../../Services/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion 
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../Components/layout/DashboardLayout";

export default function DonorAlerts() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // 1. Verifier si l'utilisateur est connecté
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Recupérer le profil pour connaitre le groupe sanguin
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile({ id: user.uid, ...docSnap.data() });
        }

        // 2. Ecouter TOUTES les alertes en temps réel
        const stopListening = onSnapshot(collection(db, "alerts"), (snapshot) => {
          const allAlerts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setAlerts(allAlerts);
        });

        return () => stopListening();
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fonction pour confirmer le déplacement
  const handleImComing = async (alertId) => {
    try {
      const alertRef = doc(db, "alerts", alertId);
      // On ajoute l'ID du donneur dans le tableau "volunteers" de l'alerte
      await updateDoc(alertRef, {
        volunteers: arrayUnion(profile.id)
      });
      alert("Merci ! Votre aide est enregistrée.");
    } catch (error) {
      alert("Erreur lors de la confirmation.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Filtrer les alertes pour ne montrer que celles compatibles
  const matchedAlerts = alerts.filter(a => a.bloodGroup === profile?.bloodGroup);

  return (
    <DashboardLayout profile={profile} onLogout={handleLogout}>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Urgences compatibles ({profile?.bloodGroup})</h1>
        
        {matchedAlerts.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-gray-300">
            <p className="text-gray-500">Aucune urgence pour votre groupe pour le moment. Merci de votre veille !</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {matchedAlerts.map(alert => {
              // Verifier si le donneur a deja cliqué
              const isAlreadyVolunteered = alert.volunteers?.includes(profile.id);

              return (
                <div key={alert.id} className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{alert.hospitalName}</h3>
                    <p className="text-red-600 font-semibold">{alert.location}</p>
                    <p className="text-sm text-gray-600 mt-2">{alert.notes}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center px-4">
                      <p className="text-xl font-bold text-gray-800">{alert.volunteers?.length || 0}</p>
                      <p className="text-[10px] uppercase text-gray-400">En route</p>
                    </div>
                    <button 
                      disabled={isAlreadyVolunteered || !profile?.isAvailable}
                      onClick={() => handleImComing(alert.id)}
                      className={`px-6 py-2 rounded-xl font-bold transition ${
                        isAlreadyVolunteered 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-red-600 text-white hover:bg-red-700"
                      } disabled:opacity-50`}
                    >
                      {isAlreadyVolunteered ? "Vous y allez" : "Je me déplace"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
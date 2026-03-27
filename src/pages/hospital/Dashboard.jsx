import { useState, useEffect } from "react";
import { auth, db } from "../../Services/firebase";
import { collection, query, where, onSnapshot, doc, getDoc, serverTimestamp, addDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../../Components/layout/DashboardLayout";

export default function HospitalDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [myAlertsCount, setMyAlertsCount] = useState(0);
  const [myAlerts, setMyAlerts] = useState([]); // Pour stocker la liste des alertes
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ bloodGroup: "O+", location: "", notes: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 1. Charger le profil
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setProfile({ id: user.uid, ...snap.data() });

        // 2. Écouter les alertes de cet hôpital en temps réel
        const q = query(collection(db, "alerts"), where("hospitalId", "==", user.uid));
        const stopSnapshot = onSnapshot(q, (snapshot) => {
          setMyAlertsCount(snapshot.docs.length);
          const alertsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMyAlerts(alertsData);
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
      setShowForm(false);
      setForm({ bloodGroup: "O+", location: "", notes: "" });
    } catch (err) {
      alert("Erreur lors de la publication.");
    }
  };

  return (
    <DashboardLayout profile={profile} onLogout={() => signOut(auth).then(() => navigate("/"))}>
      <div className="space-y-6">
        {/* ENTETE ROUGE */}
        <div className="bg-red-700 text-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold">Tableau de bord Hôpital</h1>
          <p className="opacity-80 font-light">Gérez vos besoins en sang efficacement.</p>
        </div>

        {/* STATS ET BOUTON PUBLIER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl border text-center shadow-sm">
            <p className="text-gray-500 text-sm">Mes alertes actives</p>
            <p className="text-4xl font-black text-red-600">{myAlertsCount}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border flex flex-col justify-center shadow-sm">
            <p className="font-bold text-gray-800 mb-2 text-center">Action rapide</p>
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Publier un besoin
              </button>
            ) : (
              <form onSubmit={handlePublish} className="space-y-2">
                <select
                  className="w-full border p-2 rounded-lg text-sm outline-none bg-gray-50"
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="Lieu précis"
                  className="w-full border p-2 rounded-lg text-sm"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold">Valider</button>
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold">Annuler</button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* --- SECTION CHIC : SUIVI DES ALERTES --- */}
        <div className="mt-8">
          <h3 className="font-bold text-gray-700 mb-4 px-1">Suivi des alertes</h3>
          
          <div className="space-y-4">
            {myAlerts.length > 0 ? (
              myAlerts.map((alert) => (
                <div key={alert.id} className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-black">
                      {alert.bloodGroup}
                    </span>
                    <p className="text-gray-400 text-xs font-medium">{alert.location}</p>
                  </div>

                  {/* La logique chic que tu voulais */}
                  {alert.volunteers && alert.volunteers.length > 1 ? (
                    <p className="text-sm text-emerald-600 font-bold flex items-center gap-2">
                      ✅ {alert.volunteers.length} personnes arrivent pour donner !
                    </p>
                  ) : alert.volunteers && alert.volunteers.length === 1 ? (
                    <p className="text-sm text-emerald-600 font-bold flex items-center gap-2">
                      ✅ 1 personne arrive pour donner !
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      ⌛ Personne n'a encore répondu...
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-sm italic">Aucune alerte publiée pour le moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* INFOS ÉTABLISSEMENT */}
        <div className="bg-gray-100/50 p-4 rounded-xl border border-dashed border-gray-300">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Établissement</p>
          <p className="text-gray-700 font-bold">{profile?.fullName}</p>
          <p className="text-xs text-gray-500">{profile?.city}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
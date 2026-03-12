import { useEffect, useState } from "react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DEFAULT_PROFILE = {
  fullName: "",
  city: "",
  bloodGroup: "O+",
  isAvailable: true,
  role: "donor",
};

export default function Profil({ donorProfile = DEFAULT_PROFILE, onSaveProfile = () => {} }) {
  const [form, setForm] = useState(donorProfile);
  const isHospital = form.role === "hospital";

  useEffect(() => {
    setForm(donorProfile);
  }, [donorProfile]);

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitProfile = (event) => {
    event.preventDefault();
    onSaveProfile(form);
  };

  return (
    <section className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Profil {isHospital ? "Hopital" : "Donneur"}</h1>
        <p className="text-zinc-600">
          Configurez votre profil pour recevoir uniquement les alertes pertinentes.
        </p>
      </div>

      <form onSubmit={submitProfile} className="space-y-5 rounded-xl border border-zinc-200 bg-white p-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700">Nom complet</label>
          <input
            value={form.fullName}
            onChange={(event) => setField("fullName", event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-red-500"
            placeholder="Ex: Lea Cohen"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700">Ville</label>
          <input
            value={form.city}
            onChange={(event) => setField("city", event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-red-500"
            placeholder="Ex: Tel Aviv"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700">Groupe sanguin</label>
          <select
            value={form.bloodGroup}
            onChange={(event) => setField("bloodGroup", event.target.value)}
            disabled={isHospital}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-red-500"
          >
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg bg-zinc-100 p-4">
          <p className="mb-3 text-sm font-semibold text-zinc-700">Disponibilite instantanee</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setField("isAvailable", true)}
              className={`rounded-lg px-4 py-2 font-semibold ${
                form.isAvailable ? "bg-emerald-600 text-white" : "bg-zinc-300 text-zinc-700"
              }`}
            >
              Disponible
            </button>
            <button
              type="button"
              onClick={() => setField("isAvailable", false)}
              className={`rounded-lg px-4 py-2 font-semibold ${
                !form.isAvailable ? "bg-zinc-700 text-white" : "bg-zinc-300 text-zinc-700"
              }`}
            >
              Indisponible
            </button>
          </div>
        </div>

        <button className="rounded-lg bg-red-700 px-5 py-2 font-semibold text-white hover:bg-red-800">
          Enregistrer le profil
        </button>
      </form>
    </section>
  );
}

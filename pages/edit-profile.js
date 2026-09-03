import { useState } from "react";
import Link from "next/link";

export default function EditProfilePage() {
  const [form, setForm] = useState({
    hming: "Lalnunmawia Ralte",
    vengthar: "Aizawl, Zarkawt",
    khua: "Aizawl",
    kum: "24",
    nihna: "Mizo ka ni, Aizawl a cheng, MZP member ka ni bawk. Football ka ngaina hle.",
    hna: "Student - Govt Zirtiri College",
    status: "Single"
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ background: "#e9eaed", minHeight: "100vh", padding: "0" }}>
      <header className="fb-header">
        <Link href="/profile">‹ Cancel</Link>
        <b>Edit Profile</b>
        <button onClick={handleSave} style={{ background: "none", border: "none", color: "white", fontWeight: "bold" }}>Save</button>
      </header>

      <form onSubmit={handleSave} style={{ background: "white", maxWidth: "600px", margin: "10px auto", padding: "20px", border: "1px solid #d0d1d5" }}>
        {saved && <div style={{ background: "#dff0d8", border: "1px solid #a3d3a1", padding: "10px", marginBottom: "15px", fontSize: "13px" }}>✅ Profile hlawhtling taka save a ni!</div>}

        <h3 style={{ color: "#3b5998", marginBottom: "15px" }}>✏️ Profile Edit</h3>

        <label style={{ fontWeight: "bold", fontSize: "13px" }}>Hming Pum / Full Name</label>
        <input value={form.hming} onChange={(e) => setForm({...form, hming: e.target.value})} className="fb-input" style={{ margin: "5px 0 15px 0" }} />

        <label style={{ fontWeight: "bold", fontSize: "13px" }}>Vengthar / Address</label>
        <input value={form.vengthar} onChange={(e) => setForm({...form, vengthar: e.target.value})} className="fb-input" style={{ margin: "5px 0 15px 0" }} />

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: "bold", fontSize: "13px" }}>Khua</label>
            <input value={form.khua} onChange={(e) => setForm({...form, khua: e.target.value})} className="fb-input" style={{ margin: "5px 0 15px 0" }} />
          </div>
          <div style={{ width: "80px" }}>
            <label style={{ fontWeight: "bold", fontSize: "13px" }}>Kum</label>
            <input value={form.kum} onChange={(e) => setForm({...form, kum: e.target.value})} className="fb-input" style={{ margin: "5px 0 15px 0" }} />
          </div>
        </div>

        <label style={{ fontWeight: "bold", fontSize: "13px" }}>Hna / Work</label>
        <input value={form.hna} onChange={(e) => setForm({...form, hna: e.target.value})} className="fb-input" style={{ margin: "5px 0 15px 0" }} />

        <label style={{ fontWeight: "bold", fontSize: "13px" }}>Ka Nihna / About Me</label>
        <textarea value={form.nihna} onChange={(e) => setForm({...form, nihna: e.target.value})} style={{ width: "100%", minHeight: "80px", padding: "10px", border: "1px solid #bdc7d8", margin: "5px 0 15px 0", fontFamily: "inherit" }} />

        <button type="submit" className="fb-button" style={{ width: "100%", padding: "12px", fontSize: "14px" }}>💾 Save Changes</button>
        <Link href="/profile"><button type="button" style={{ width: "100%", padding: "12px", marginTop: "10px", background: "#f6f7f8", border: "1px solid #ccc" }}>Cancel</button></Link>
      </form>
    </div>
  );
}

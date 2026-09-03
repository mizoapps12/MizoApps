import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call - Facebook 2012 style
    setTimeout(() => {
      setLoading(false);
      router.push("/newsfeed");
    }, 800);
  };

  return (
    <div style={{ background: "#3b5998", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "white", fontSize: "42px", fontWeight: "bold", letterSpacing: "-1px" }}>MizoApps</h1>
        <p style={{ color: "#d8dfea", fontSize: "14px", marginTop: "5px" }}>Mizo te insuihkhawmna - 2012</p>
      </div>

      <form onSubmit={handleLogin} style={{ background: "white", maxWidth: "400px", width: "100%", margin: "0 auto", padding: "20px", borderRadius: "3px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
        <div style={{ background: "#fffbe2", border: "1px solid #e2c822", padding: "10px", fontSize: "12px", marginBottom: "15px" }}>
          MizoApps App thar iPhone leh Android ah hmang thei tawh. A rang zawk.
        </div>

        <label style={{ fontSize: "13px", fontWeight: "bold" }}>Email emaw Phone</label>
        <input
          className="fb-input"
          type="text"
          placeholder="Email emaw Phone"
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
          style={{ margin: "5px 0 15px 0" }}
          required
        />

        <label style={{ fontSize: "13px", fontWeight: "bold" }}>Kawlhrah / Password</label>
        <input
          className="fb-input"
          type="password"
          placeholder="Kawlhrah"
          value={form.password}
          onChange={(e) => setForm({...form, password: e.target.value})}
          style={{ margin: "5px 0 15px 0" }}
          required
        />

        <button type="submit" disabled={loading} className="fb-button" style={{ width: "100%", padding: "12px", fontSize: "14px" }}>
          {loading? "Luh mek..." : "Luh / Log In"}
        </button>

        <div style={{ textAlign: "center", margin: "15px 0", borderTop: "1px solid #ddd", paddingTop: "15px" }}>
          <button type="button" className="fb-button" style={{ background: "#5cb85c", width: "100%", padding: "12px" }}>
            Account Thar Siam / Create New Account
          </button>
        </div>
      </form>

      <p style={{ textAlign: "center", color: "#d8dfea", fontSize: "11px", marginTop: "20px" }}>
        MizoApps © 2012 • Mizo Tawng • Privacy • Terms • Help
      </p>
    </div>
  );
}

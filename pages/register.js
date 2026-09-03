import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleRegister = (e) => {
    e.preventDefault();
    router.push("/newsfeed");
  };

  return (
    <>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; overflow: hidden; }
      `}</style>
      <div style={{
        background: "#e9eaed",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "15px",
        fontFamily: "lucida grande, tahoma, verdana, arial, sans-serif"
      }}>
        <div style={{
          background: "white",
          maxWidth: "400px",
          width: "100%",
          padding: "22px",
          border: "1px solid #bdc7d8",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ fontSize: "22px", marginBottom: "6px" }}>Sign Up</h2>
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "18px" }}>It's free and always will be.</p>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #bdc7d8" }}
            />
            <input
              type="text"
              placeholder="Email or Phone"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #bdc7d8" }}
            />
            <input
              type="password"
              placeholder="New Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              style={{ width: "100%", padding: "10px", marginBottom: "14px", border: "1px solid #bdc7d8" }}
            />

            <p style={{ fontSize: "11px", color: "#777", marginBottom: "14px" }}>
              By clicking Sign Up, you agree to our <a href="/terms" style={{ color: "#3b5998", textDecoration: "none" }}>Terms</a> and <a href="/privacy" style={{ color: "#3b5998", textDecoration: "none" }}>Privacy Policy</a>.
            </p>

            <button type="submit" style={{
              background: "#69a74e",
              border: "1px solid #3b6e22",
              color: "white",
              fontWeight: "bold",
              padding: "9px 16px",
              cursor: "pointer",
              width: "100%"
            }}>
              Sign Up
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "15px", borderTop: "1px solid #ddd", paddingTop: "12px" }}>
            <a onClick={() => router.push("/")} style={{ color: "#3b5998", fontSize: "13px", cursor: "pointer", textDecoration: "none" }}>
              Already have an account? Log In
            </a>
          </div>
        </div>
      </div>
    </>
  );
                }

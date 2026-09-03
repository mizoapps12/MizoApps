import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/newsfeed");
    }, 800);
  };

  return (
    <>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; overflow: hidden; }
        .fb-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #bdc7d8;
          font-size: 14px;
          outline: none;
        }
        .fb-input:focus { border-color: #4e69a2; }
        .fb-button {
          border: none;
          color: white;
          font-weight: bold;
          cursor: pointer;
          border-radius: 2px;
        }
        .fb-button:active { transform: scale(0.98); }
      `}</style>

      <div style={{ 
        background: "#3b5998", 
        height: "100vh", 
        width: "100vw",
        overflow: "hidden",
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center",
        padding: "15px",
        fontFamily: "lucida grande, tahoma, verdana, arial, sans-serif"
      }}>
        
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 style={{ color: "white", fontSize: "48px", fontWeight: "900", letterSpacing: "-1.5px", textShadow: "0 1px 1px rgba(0,0,0,0.2)" }}>
            mizoapps
          </h1>
          <p style={{ color: "#d8dfea", fontSize: "13px", marginTop: "2px", letterSpacing: "0.3px" }}>
            Connect with Mizo friends - Since 2012
          </p>
        </div>

        <div style={{ 
          background: "white", 
          width: "100%",
          maxWidth: "380px", 
          padding: "22px", 
          borderRadius: "0px", 
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          border: "1px solid #133783"
        }}>
          <div style={{ 
            background: "#fffbe2", 
            border: "1px solid #e2c822", 
            padding: "8px 10px", 
            fontSize: "12px", 
            marginBottom: "14px",
            color: "#333"
          }}>
            New MizoApps for iPhone and Android - Faster than ever.
          </div>

          <form onSubmit={handleLogin}>
            <input
              className="fb-input"
              type="text"
              placeholder="Email or Phone"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              style={{ marginBottom: "10px" }}
              required
            />

            <input
              className="fb-input"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              style={{ marginBottom: "12px" }}
              required
            />

            <button 
              type="submit" 
              disabled={loading} 
              className="fb-button" 
              style={{ 
                width: "100%", 
                padding: "9px", 
                fontSize: "13px",
                background: "#5b74a8",
                border: "1px solid #2f477a",
                borderBottomColor: "#1a356e",
                boxShadow: "0 1px 0 rgba(0,0,0,0.1)"
              }}
            >
              {loading ? "Loading..." : "Log In"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "18px", borderTop: "1px solid #ddd", paddingTop: "16px" }}>
            <button 
              type="button" 
              onClick={() => router.push("/register")}
              className="fb-button" 
              style={{ 
                background: "#69a74e", 
                border: "1px solid #3b6e22",
                padding: "9px 16px",
                fontSize: "13px",
                boxShadow: "0 1px 0 rgba(0,0,0,0.1)"
              }}
            >
              Create New Account
            </button>
          </div>
        </div>

        <div style={{ 
          textAlign: "center", 
          color: "#9ab2d1", 
          fontSize: "11px", 
          marginTop: "18px",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          <span>MizoApps © 2012</span>
          <span>·</span>
          <a href="#" onClick={(e)=>{e.preventDefault(); router.push("/language")}} style={{color: "#d8dfea", textDecoration: "none", cursor: "pointer"}}>English</a>
          <span>·</span>
          <a href="#" onClick={(e)=>{e.preventDefault(); router.push("/privacy")}} style={{color: "#d8dfea", textDecoration: "none", cursor: "pointer"}}>Privacy</a>
          <span>·</span>
          <a href="#" onClick={(e)=>{e.preventDefault(); router.push("/terms")}} style={{color: "#d8dfea", textDecoration: "none", cursor: "pointer"}}>Terms</a>
          <span>·</span>
          <a href="#" onClick={(e)=>{e.preventDefault(); router.push("/help")}} style={{color: "#d8dfea", textDecoration: "none", cursor: "pointer"}}>Help</a>
        </div>
      </div>
    </>
  );
}

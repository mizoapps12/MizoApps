import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if(!name || !email || !phone || !password) return alert("Fill all!");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if(error) return alert(error.message);
    await supabase.from("profiles").insert([{ id: data.user.id, full_name: name, email, phone }]);
    alert("Account siam a ni! Login rawh");
    setIsSignup(false);
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if(error) return alert(error.message);
    router.push("/newsfeed");
  };

  return (
    <div style={{ background: "#e9eaed", minHeight: "100vh", fontFamily: "lucida grande" }}>
      <div style={{ background: "#3b5998", height: "40px", display: "flex", alignItems: "center", padding: "0 15px" }}>
        <h2 style={{ color: "white", fontSize: "28px", fontWeight: "bold" }}>mizoapps</h2>
      </div>
      <div style={{ maxWidth: "400px", margin: "40px auto", background: "white", border: "1px solid #bdc7d8", padding: "20px" }}>
        <h3 style={{ marginBottom: "15px", color: "#333" }}>{isSignup ? "Sign Up" : "Log In"}</h3>
        {isSignup && <input placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} style={inputStyle} />}
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle} />
        {isSignup && <input placeholder="Phone Number (e.g. 9862...)" value={phone} onChange={e=>setPhone(e.target.value)} style={inputStyle} />}
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={inputStyle} />
        
        <button onClick={isSignup ? handleSignup : handleLogin} style={{ width: "100%", background: "#5b74a8", color: "white", fontWeight: "bold", border: "1px solid #2f477a", padding: "8px", marginTop: "10px", cursor: "pointer" }}>
          {isSignup ? "Sign Up" : "Log In"}
        </button>
        <p onClick={()=>setIsSignup(!isSignup)} style={{ textAlign: "center", marginTop: "12px", fontSize: "13px", color: "#3b5998", cursor: "pointer" }}>
          {isSignup ? "Already have account? Log In" : "Create New Account - Email + Phone"}
        </p>
      </div>
    </div>
  );
}
const inputStyle = { width: "100%", padding: "8px", border: "1px solid #bdc7d8", marginBottom: "8px", fontSize: "13px" };

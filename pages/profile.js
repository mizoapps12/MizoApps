import { useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("timeline");

  return (
    <div style={{ background: "#e9eaed", minHeight: "100vh" }}>
      <header className="fb-header">
        <Link href="/newsfeed">‹ Hmunpui</Link>
        <b>Profile</b>
        <Link href="/edit-profile">✏️ Edit</Link>
      </header>

      {/* Cover + Profile Photo */}
      <div style={{ background: "white", borderBottom: "1px solid #ddd" }}>
        <div style={{ height: "120px", background: "#3b5998" }}></div>
        <div style={{ padding: "0 15px 15px 15px", display: "flex", alignItems: "flex-end", marginTop: "-30px" }}>
          <div style={{ width: "80px", height: "80px", background: "white", border: "3px solid white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", fontWeight: "bold", color: "#3b5998" }}>Z</div>
          <div style={{ marginLeft: "12px", paddingBottom: "10px" }}>
            <h2 style={{ fontSize: "20px" }}>Zonunmawia</h2>
            <small style={{ color: "gray" }}>Aizawl, Mizoram • Friends 342</small>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderTop: "1px solid #e9eaed" }}>
          <button onClick={() => setActiveTab("timeline")} style={{ flex: 1, padding: "12px", background: activeTab === "timeline" ? "#f6f7f8" : "white", border: "none", fontWeight: activeTab === "timeline" ? "bold" : "normal", color: activeTab === "timeline" ? "#3b5998" : "#333" }}>Timeline</button>
          <button onClick={() => setActiveTab("about")} style={{ flex: 1, padding: "12px", background: activeTab === "about" ? "#f6f7f8" : "white", border: "none", fontWeight: activeTab === "about" ? "bold" : "normal" }}>About</button>
          <button onClick={() => setActiveTab("friends")} style={{ flex: 1, padding: "12px", background: activeTab === "friends" ? "#f6f7f8" : "white", border: "none" }}>Friends</button>
          <button onClick={() => setActiveTab("photos")} style={{ flex: 1, padding: "12px", background: activeTab === "photos" ? "#f6f7f8" : "white", border: "none" }}>Photos</button>
        </div>
      </div>

      {/* About Card */}
      <div className="fb-card">
        <h4 style={{ marginBottom: "8px" }}>Ka Chanchin</h4>
        <p style={{ fontSize: "13px", lineHeight: "1.5" }}>📍 Aizawl, Zarkawt ah ka cheng<br/>💼 MZP Member<br/>🎓 Govt. Zirtiri College<br/>❤️ Single<br/>📅 Joined December 2011</p>
        <Link href="/edit-profile"><button className="fb-button" style={{ width: "100%", marginTop: "10px", background: "#f6f7f8", color: "#333", border: "1px solid #ccc" }}>Edit Profile</button></Link>
      </div>

      {/* Posts */}
      <div className="fb-card">
        <b style={{ color: "#3b5998" }}>Zonunmawia</b><br/>
        <small style={{ color: "gray" }}>2 hours ago • 🌍</small>
        <p style={{ marginTop: "8px" }}>Vawiin chu Chapchar Kut kan hmang a, kan hlim hle mai! 🎉</p>
        <div style={{ marginTop: "10px", fontSize: "13px", color: "#3b5998" }}>👍 45 Like • 💬 12 Comment</div>
      </div>
    </div>
  );
        }

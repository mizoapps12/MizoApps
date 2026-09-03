import { useState } from "react";
import Link from "next/link";

export default function FriendsPage() {
  const [friends, setFriends] = useState([
    { id: 1, hming: "Liankima Sailo", khua: "Lunglei", mutual: 5, online: true },
    { id: 2, hming: "Lalhmingsangi Pachuau", khua: "Champhai", mutual: 3, online: false },
    { id: 3, hming: "Rodingliana Khiangte", khua: "Kolasib", mutual: 2, online: true },
    { id: 4, hming: "Lalrinawmi", khua: "Aizawl", mutual: 8, online: true },
    { id: 5, hming: "Zonunmawia", khua: "Siahatla", mutual: 12, online: false },
  ]);

  return (
    <div style={{ background: "#e9eaed", minHeight: "100vh" }}>
      <header className="fb-header">
        <Link href="/newsfeed">‹ Hmunpui</Link>
        <b>Thian / Friends ({friends.length})</b>
        <Link href="/search">🔍</Link>
      </header>

      <div style={{ padding: "10px" }}>
        <input placeholder="Thian zawng..." style={{ width: "100%", padding: "10px", border: "1px solid #ddd" }} />
      </div>

      {friends.map((f) => (
        <div key={f.id} style={{ background: "white", padding: "12px", margin: "0 8px 8px 8px", display: "flex", alignItems: "center", border: "1px solid #d0d1d5" }}>
          <div style={{ width: "50px", height: "50px", background: "#3b5998", borderRadius: "50%", marginRight: "12px", position: "relative" }}>
            {f.online && <div style={{ width: "12px", height: "12px", background: "#4CAF50", borderRadius: "50%", position: "absolute", bottom: "0", right: "0", border: "2px solid white" }}></div>}
          </div>
          <div style={{ flex: 1 }}>
            <b style={{ color: "#3b5998", fontSize: "15px" }}>{f.hming}</b><br/>
            <small style={{ color: "gray" }}>{f.khua} • {f.mutual} mutual friends {f.online? "• Online now" : ""}</small>
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            <button style={{ background: "#3b5998", color: "white", border: "none", padding: "6px 12px" }}>Message</button>
            <button style={{ background: "#f6f7f8", border: "1px solid #ccc", padding: "6px 10px" }}>⋯</button>
          </div>
        </div>
      ))}
    </div>
  );
}

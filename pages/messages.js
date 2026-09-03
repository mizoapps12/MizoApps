import { useState } from "react";
import Link from "next/link";

export default function MessagesPage() {
  const [chats, setChats] = useState([
    { id: 1, hming: "Lalrinawmi", thu: "Chibai! Eng nge i tih?", hun: "2m ago", unread: 2, online: true },
    { id: 2, hming: "Zonunmawia", thu: "Ka lo kal dawn, lo nghak rawh", hun: "10m ago", unread: 0, online: true },
    { id: 3, hming: "Mizo Zirlai Pawl", thu: "Lalhlupuia: Meeting kan nei dawn...", hun: "1h ago", unread: 5, online: false, group: true },
    { id: 4, hming: "Liankima Sailo", thu: "Photo ka rawn thawn che", hun: "Yesterday", unread: 0, online: false },
  ]);
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ background: "white", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="fb-header">
        <Link href="/newsfeed">‹ Back</Link>
        <b>Messages / Thuchah 💬</b>
        <span>✏️ New</span>
      </header>

      <div style={{ flex: 1, display: "flex" }}>
        {/* Chat List */}
        <div style={{ width: selected? "35%" : "100%", borderRight: "1px solid #ddd" }}>
          <div style={{ padding: "8px" }}><input placeholder="Search messages..." style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "20px" }} /></div>
          {chats.map((c) => (
            <div key={c.id} onClick={() => setSelected(c)} style={{ padding: "10px 12px", borderBottom: "1px solid #f0f0f0", background: selected?.id === c.id? "#e9f0ff" : "white", cursor: "pointer", display: "flex", gap: "10px" }}>
              <div style={{ width: "45px", height: "45px", background: c.group? "#5cb85c" : "#3b5998", borderRadius: "50%", position: "relative", flexShrink: 0 }}>
                {c.online && <div style={{ width: "10px", height: "10px", background: "#4CAF50", borderRadius: "50%", position: "absolute", bottom: "0", right: "0", border: "2px solid white" }}></div>}
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: "14px" }}>{c.hming}</b><small style={{ color: "gray", fontSize: "11px" }}>{c.hun}</small></div>
                <div style={{ fontSize: "13px", color: "gray", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.thu}</div>
              </div>
              {c.unread > 0 && <div style={{ background: "#3b5998", color: "white", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold" }}>{c.unread}</div>}
            </div>
          ))}
        </div>

        {/* Chat Window */}
        {selected && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "12px", borderBottom: "1px solid #ddd", background: "#f6f7f8", display: "flex", justifyContent: "space-between" }}>
              <b>{selected.hming}</b><span onClick={() => setSelected(null)} style={{ cursor: "pointer" }}>✕</span>
            </div>
            <div style={{ flex: 1, padding: "15px", background: "#e9eaed" }}>
              <div style={{ background: "white", padding: "10px", borderRadius: "15px", maxWidth: "70%", marginBottom: "10px" }}>{selected.thu}</div>
              <div style={{ background: "#3b5998", color: "white", padding: "10px", borderRadius: "15px", maxWidth: "70%", marginLeft: "auto" }}>Awle, ka lo nghak ang che!</div>
            </div>
            <div style={{ padding: "10px", borderTop: "1px solid #ddd", display: "flex", gap: "8px" }}>
              <input placeholder="Type a message..." style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "20px" }} />
              <button style={{ background: "#3b5998", color: "white", border: "none", padding: "10px 15px", borderRadius: "20px" }}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

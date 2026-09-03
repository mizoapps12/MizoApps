import Link from "next/link";

export default function NotificationsPage() {
  const notifs = [
    { id: 1, type: "like", hming: "Liankima Sailo", thu: "i thlalak a like", hun: "2m ago", unread: true },
    { id: 2, type: "comment", hming: "Lalrinawmi", thu: "i post ah comment: 'A mawi hle mai!'", hun: "15m ago", unread: true },
    { id: 3, type: "group", hming: "Mizo Zirlai Pawl", thu: "group ah thil thar a awm", hun: "1h ago", unread: false },
    { id: 4, type: "friend", hming: "Zonunmawia", thu: "thian dilna a thawn che", hun: "3h ago", unread: true },
  ];

  return (
    <div style={{ background: "#e9eaed", minHeight: "100vh" }}>
      <header className="fb-header">
        <Link href="/newsfeed">‹ Back</Link>
        <b>Hrilhna / Notifications</b>
        <span>Mark all as read</span>
      </header>

      {notifs.map((n) => (
        <div key={n.id} style={{ background: n.unread? "#e9f0ff" : "white", padding: "12px 15px", borderBottom: "1px solid #e9eaed", display: "flex", gap: "10px" }}>
          <div style={{ width: "40px", height: "40px", background: "#3b5998", borderRadius: "50%" }}></div>
          <div style={{ flex: 1 }}>
            <b>{n.hming}</b> {n.thu}<br/>
            <small style={{ color: "#3b5998" }}>{n.hun}</small>
          </div>
          {n.unread && <div style={{ width: "8px", height: "8px", background: "#3b5998", borderRadius: "50%", marginTop: "10px" }}></div>}
        </div>
      ))}
    </div>
  );
}

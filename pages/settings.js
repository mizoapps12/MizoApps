import Link from "next/link";

export default function SettingsPage() {
  const settingsGroups = [
    {
      title: "DUHSAKNA / PREFERENCES",
      items: [
        { icon: "👤", title: "Account", desc: "Account thlak danglam, password, email thlak", link: "/edit-profile" },
        { icon: "🔒", title: "Thuruk / Privacy", desc: "Mahni thil hriatlohna & privacy tihfelna", link: "#" },
        { icon: "🔔", title: "Hriattirna / Notifications", desc: "Push, email, leh in-app hriattirna", link: "/notifications" },
        { icon: "👥", title: "Thian / Friends", desc: "Thian list, thian dilna en", link: "/friends" },
      ]
    },
    {
      title: "SAWIHO LEH HELPU",
      items: [
        { icon: "⚙️", title: "General", desc: "Zawhna, hman dan, leh app chungchang", link: "#" },
        { icon: "❓", title: "Puihna & Feedback", desc: "Harsatna report leh thurawn pekna", link: "#" },
        { icon: "📄", title: "Terms & Policy", desc: "MizoApps hman dan leh dante", link: "#" },
        { icon: "🚪", title: "Chhuak / Log Out", desc: "Account atangin chhuah", link: "/" },
      ]
    }
  ];

  return (
    <div style={{ background: "#e9eaed", minHeight: "100vh" }}>
      <header className="fb-header">
        <Link href="/newsfeed">‹ Back</Link>
        <b>MizoApps - Duhsakna / Settings</b>
        <span></span>
      </header>

      {settingsGroups.map((group, idx) => (
        <div key={idx} style={{ marginTop: "15px" }}>
          <div style={{ padding: "5px 15px", fontSize: "12px", fontWeight: "bold", color: "gray" }}>{group.title}</div>
          {group.items.map((item, i) => (
            <Link key={i} href={item.link} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ background: "white", padding: "14px 15px", display: "flex", alignItems: "center", borderBottom: "1px solid #e9eaed", cursor: "pointer" }}>
                <div style={{ fontSize: "28px", marginRight: "15px" }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "gray", marginTop: "2px" }}>{item.desc}</div>
                </div>
                <div style={{ color: "#ccc", fontSize: "18px" }}>›</div>
              </div>
            </Link>
          ))}
        </div>
      ))}

      <div style={{ textAlign: "center", padding: "20px", color: "gray", fontSize: "12px" }}>
        MizoApps v1.2.3 • 2012<br/>
        Facebook hlui anga siam • Mizo tawng support<br/>
        Made with ❤️ for Mizoram
      </div>
    </div>
  );
}

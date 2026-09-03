import Link from "next/link";

export default function PhotosPage() {
  const albums = [
    { id: 1, hming: "Chapchar Kut 2012", zat: 24, cover: "🌸", year: "2012", privacy: "Public" },
    { id: 2, hming: "Lushai Traditional Dance", zat: 18, cover: "💃", year: "2011", privacy: "Friends" },
    { id: 3, hming: "Thalfavang Kut", zat: 32, cover: "🍂", year: "2012", privacy: "Public" },
    { id: 4, hming: "Mizo Youth Festival 2012", zat: 12, cover: "🎉", year: "2012", privacy: "Public" },
    { id: 5, hming: "My Village - Siahatla", zat: 45, cover: "🏔️", year: "2010", privacy: "Only Me" },
  ];

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <header className="fb-header">
        <Link href="/profile">‹ Profile</Link>
        <b>Photos / Thlalak</b>
        <span>+ Upload</span>
      </header>

      <div style={{ background: "#f6f7f8", padding: "10px", display: "flex", gap: "10px", borderBottom: "1px solid #ddd" }}>
        <button style={{ background: "#3b5998", color: "white", border: "none", padding: "8px 15px" }}>Albums</button>
        <button style={{ background: "white", border: "1px solid #ccc", padding: "8px 15px" }}>Photos of You</button>
        <button style={{ background: "white", border: "1px solid #ccc", padding: "8px 15px" }}>Videos</button>
      </div>

      <div style={{ padding: "10px" }}>
        {albums.map((a) => (
          <div key={a.id} style={{ display: "flex", padding: "12px 0", borderBottom: "1px solid #eee", cursor: "pointer" }}>
            <div style={{ width: "80px", height: "80px", background: "#e9eaed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "35px", marginRight: "12px" }}>{a.cover}</div>
            <div style={{ flex: 1 }}>
              <b style={{ color: "#3b5998", fontSize: "15px" }}>{a.hming}</b><br/>
              <small style={{ color: "gray" }}>{a.zat} photos • {a.year} • {a.privacy}</small><br/>
              <small style={{ color: "#3b5998", marginTop: "5px", display: "block" }}>View Album ›</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

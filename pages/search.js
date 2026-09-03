import { useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const users = [
    { id: 1, hming: "Liankima Sailo", khua: "Lunglei", mutual: 5, img: "L" },
    { id: 2, hming: "Lalhmingsangi Pachuau", khua: "Champhai", mutual: 3, img: "L" },
    { id: 3, hming: "Lalrinawmi Hnamte", khua: "Aizawl", mutual: 8, img: "L" },
    { id: 4, hming: "Vanlalhriata", khua: "Serchhip", mutual: 1, img: "V" },
  ];

  const filtered = users.filter(u => u.hming.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ background: "#e9eaed", minHeight: "100vh" }}>
      <header className="fb-header">
        <Link href="/newsfeed">‹ Back</Link>
        <b>Zawng / Search</b>
        <span>⚙️</span>
      </header>

      <div style={{ background: "white", padding: "10px", borderBottom: "1px solid #ddd" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for Mizo users, groups, pages..."
          autoFocus
          style={{ width: "100%", padding: "12px", border: "1px solid #3b5998", borderRadius: "20px", background: "#f6f7f8" }}
        />
      </div>

      <div style={{ padding: "10px", fontSize: "12px", fontWeight: "bold", color: "gray" }}>RESULTS ({filtered.length}) - MIZO USERS</div>

      {filtered.map((u) => (
        <div key={u.id} style={{ background: "white", padding: "12px", margin: "0 8px 8px 8px", display: "flex", alignItems: "center", border: "1px solid #d0d1d5" }}>
          <div style={{ width: "50px", height: "50px", background: "#3b5998", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", marginRight: "12px" }}>{u.img}</div>
          <div style={{ flex: 1 }}>
            <b style={{ color: "#3b5998" }}>{u.hming}</b><br/>
            <small style={{ color: "gray" }}>{u.khua} • {u.mutual} mutual friends</small>
          </div>
          <button style={{ background: "#3b5998", color: "white", border: "none", padding: "6px 14px", borderRadius: "3px", fontWeight: "bold" }}>+ Add as Friend</button>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "gray" }}>
          <div style={{ fontSize: "40px" }}>🔍</div>
          <p>No results for "{query}"</p>
          <small>Try searching with different keywords</small>
        </div>
      )}
    </div>
  );
}

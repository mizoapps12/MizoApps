import { useState } from "react";
import { useRouter } from "next/router";

export default function GroupMembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState([
    { id: 1, hming: "Lalhlupuia", admin: true, join: "Dec 2011", online: true, img: "L" },
    { id: 2, hming: "Lalrinawmi", admin: true, join: "Jan 2012", online: false, img: "L" },
    { id: 3, hming: "Lalhmangaiha", admin: false, join: "Mar 2012", online: true, img: "L" },
    { id: 4, hming: "Lalawmpuii", admin: false, join: "Apr 2012", online: false, img: "L" },
    { id: 5, hming: "Zohmingthanga", admin: false, join: "Apr 2012", online: true, img: "Z" },
    { id: 6, hming: "Lalremruati", admin: false, join: "May 2012", online: false, img: "L" },
    { id: 7, hming: "Lalramdina", admin: false, join: "Jun 2012", online: true, img: "L" },
    { id: 8, hming: "Lalthakimi", admin: false, join: "Jun 2012", online: false, img: "L" },
  ]);
  
  const [newMemberName, setNewMemberName] = useState("");
  const [search, setSearch] = useState("");

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      alert("Thian hming ziak rawh!");
      return;
    }
    const newMember = {
      id: Date.now(),
      hming: newMemberName,
      admin: false,
      join: "Tunah (Just now)",
      online: true,
      img: newMemberName.charAt(0)
    };
    setMembers([...members, newMember]);
    setNewMemberName("");
  };

  const filtered = members.filter(m => m.hming.toLowerCase().includes(search.toLowerCase()));
  const admins = filtered.filter(m => m.admin);
  const regularMembers = filtered.filter(m => !m.admin);

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ background: "#3b5998", color: "white", padding: "12px 15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span onClick={() => router.back()} style={{ cursor: "pointer" }}>‹ Groups</span>
        <b style={{ fontSize: "18px" }}>Mizo Zirlai Pawl</b>
        <span>⚙️</span>
      </header>

      {/* Group Info */}
      <div style={{ background: "#e9eaed", padding: "15px", textAlign: "center", borderBottom: "1px solid #ddd" }}>
        <div style={{ fontWeight: "bold", fontSize: "14px" }}>MizoApps • Mizo Zirlai Pawl</div>
        <div style={{ fontSize: "13px", color: "gray", marginTop: "3px" }}>Group • {members.length} members • Created 2011</div>
        
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <input
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            placeholder="Thian hming ziahluh..."
            style={{ flex: 1, padding: "10px", border: "1px solid #bdc7d8", borderRadius: "3px" }}
          />
          <button onClick={handleAddMember} style={{ background: "#3b5998", color: "white", border: "none", padding: "10px 15px", fontWeight: "bold", borderRadius: "3px" }}>
            + Add Member
          </button>
        </div>

        <div style={{ marginTop: "10px" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Member zawng..." style={{ width: "100%", padding: "8px", border: "1px solid #ddd", fontSize: "13px" }} />
        </div>
      </div>

      {/* Admins */}
      <div style={{ background: "#f6f7f8", padding: "8px 15px", borderBottom: "1px solid #e9eaed", fontSize: "12px", fontWeight: "bold", color: "gray" }}>
        ADMINS ({admins.length})
      </div>
      {admins.map((m) => (
        <div key={m.id} style={{ display: "flex", alignItems: "center", padding: "12px 15px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ width: "45px", height: "45px", background: "#3b5998", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", marginRight: "12px" }}>{m.img}</div>
          <div style={{ flex: 1 }}>
            <b style={{ color: "#0d2a6f" }}>{m.hming} ⭐</b><br/>
            <small style={{ color: "gray" }}>Admin • Joined {m.join}</small>
          </div>
          <span style={{ color: "#4CAF50", fontSize: "12px" }}>{m.online? "● Online" : ""}</span>
        </div>
      ))}

      {/* Members */}
      <div style={{ background: "#f6f7f8", padding: "8px 15px", borderBottom: "1px solid #e9eaed", fontSize: "12px", fontWeight: "bold", color: "gray" }}>
        MEMBERS ({regularMembers.length})
      </div>
      {regularMembers.map((m) => (
        <div key={m.id} style={{ display: "flex", alignItems: "center", padding: "12px 15px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ width: "45px", height: "45px", background: "#e9eaed", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", marginRight: "12px" }}>{m.img}</div>
          <div style={{ flex: 1 }}>
            <b style={{ color: "#0d2a6f" }}>{m.hming}</b><br/>
            <small style={{ color: "gray" }}>Joined {m.join}</small>
          </div>
          <span style={{ color: "#4CAF50", fontSize: "12px" }}>{m.online? "● Online" : ""}</span>
        </div>
      ))}
    </div>
  );
                   }

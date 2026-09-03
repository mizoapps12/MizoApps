import Link from "next/link";

export default function GroupsPage() {
  const groups = [
    { id: "1", hming: "Mizo Zirlai Pawl", members: 12, type: "Closed Group", created: "2011", desc: "Mizo zirlai te insuihkhawmna" },
    { id: "2", hming: "Mizo Kristian Thalai Pawl", members: 340, type: "Public Group", created: "2010", desc: "KTP member te group" },
    { id: "3", hming: "Chapchar Kut Celebration", members: 89, type: "Event Group", created: "2012", desc: "Chapchar Kut 2012 buatsaihna" },
  ];

  return (
    <div style={{ background: "#e9eaed", minHeight: "100vh" }}>
      <header className="fb-header">
        <Link href="/newsfeed">‹ Back</Link>
        <b>Groups / Pawl</b>
        <span>+ Create</span>
      </header>

      {groups.map((g) => (
        <div key={g.id} style={{ background: "white", padding: "15px", margin: "8px", border: "1px solid #d0d1d5", cursor: "pointer" }} onClick={() => location.href = `/groups/${g.id}/members`}>
          <b style={{ color: "#3b5998", fontSize: "16px" }}>{g.hming}</b><br/>
          <small style={{ color: "gray" }}>{g.type} • {g.members} members • Created {g.created}</small><br/>
          <small style={{ marginTop: "5px", display: "block" }}>{g.desc}</small>
          <div style={{ marginTop: "8px" }}>
            <span style={{ fontSize: "12px", color: "#3b5998" }}>View Members ›</span>
          </div>
        </div>
      ))}
    </div>
  );
}

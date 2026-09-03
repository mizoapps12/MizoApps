import Link from "next/link";
export default function EventsPage(){
  const events=[
    {hming:"Chapchar Kut 2012", date:"Mar 2, 2012", hmun:"Lammual, Aizawl", mi:234},
    {hming:"Thalfavang Kut", date:"Nov 5, 2012", hmun:"Champhai", mi:89},
    {hming:"MZP Conference", date:"Dec 15, 2012", hmun:"Aizawl", mi:450},
  ];
  return(
    <div style={{background:"#e9eaed", minHeight:"100vh"}}>
      <header className="fb-header"><Link href="/newsfeed">‹ Back</Link><b>Events / Kut</b><span>+ Create</span></header>
      {events.map((e,i)=><div key={i} style={{background:"white", padding:"15px", margin:"8px", border:"1px solid #ddd"}}><b style={{color:"#3b5998"}}>{e.hming}</b><br/><small>{e.date} • {e.hmun}<br/>{e.mi} people going</small><br/><button style={{marginTop:"8px", background:"#3b5998", color:"white", border:"none", padding:"6px 12px"}}>Join</button></div>)}
    </div>
  )
}

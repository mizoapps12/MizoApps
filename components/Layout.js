import Link from "next/link";
export default function Layout({children}){
  return(
    <div>
      <header style={{background:"#3b5998", color:"white", padding:"10px", display:"flex", justifyContent:"space-between", position:"sticky", top:0, zIndex:100}}>
        <Link href="/newsfeed"><b style={{color:"white", cursor:"pointer"}}>MizoApps</b></Link>
        <div style={{display:"flex", gap:"15px"}}>
          <Link href="/friends" style={{color:"white"}}>👥</Link>
          <Link href="/messages" style={{color:"white"}}>💬</Link>
          <Link href="/notifications" style={{color:"white"}}>🌍</Link>
          <Link href="/settings" style={{color:"white"}}>☰</Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useRouter } from 'next/router';

export default function Header(){
  const [msg,setMsg]=useState(0);
  const [noti,setNoti]=useState(0);
  const [q,setQ]=useState('');
  const router = useRouter();

  useEffect(()=>{
    const u = auth.currentUser;
    if(!u) return;
    const q1 = query(collection(db,"messages"), where("to","==",u.uid), where("read","==",false));
    const un1 = onSnapshot(q1,s=> setMsg(s.size));
    const q2 = query(collection(db,"notifications"), where("to","==",u.uid), where("read","==",false));
    const un2 = onSnapshot(q2,s=> setNoti(s.size));
    return ()=>{un1(); un2();};
  },[]);

  const goSearch = ()=>{ if(q.trim()) router.push(`/search?k=${encodeURIComponent(q.trim())}`); };
  const onKey = (e)=>{ if(e.key==='Enter') goSearch(); };

  const m = {color:'white',textDecoration:'none',fontWeight:'bold',fontSize:16};

  return(
    <div style={{position:'fixed',top:0,left:0,right:0,zIndex:999,background:'#3b5998'}}>
      <div style={{display:'flex',alignItems:'center',padding:'6px 8px',gap:8,background:'#3b5998'}}>
        <Link href="/home" style={{textDecoration:'none'}}><div style={{background:'white',color:'#3b5998',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:20,borderRadius:2}}>M</div></Link>
        <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={onKey} placeholder="Zawng rawh..." style={{flex:1,padding:'0 10px',height:30,fontSize:14,border:'none',borderRadius:2,outline:'none'}}/>
        <button onClick={goSearch} style={{background:'#f0f0f0',border:'1px solid #999',padding:'0 14px',height:30,fontWeight:'bold',fontSize:14,borderRadius:2,color:'#333'}}>Search</button>
      </div>

      <div style={{background:'#3b5998',padding:'0'}}>
        {/* LINE 1 - LEFT leh RIGHT in ang - space-between */}
        <div style={{display:'flex',justifyContent:'space-between',padding:'4px 10px'}}>
          <Link href="/home" style={m}>Home</Link>
          <Link href="/profile" style={m}>Profile</Link>
          <Link href="/notifications" style={m}>Notification{noti>0 && <span style={{background:'red',color:'white',padding:'1px 4px',borderRadius:3,marginLeft:3,fontSize:11}}>{noti}</span>}</Link>
          <Link href="/message" style={m}>Message{msg>0 && <span style={{background:'red',color:'white',padding:'1px 4px',borderRadius:3,marginLeft:3,fontSize:11}}>{msg}</span>}</Link>
        </div>
        {/* LINE 2 - a inkar Line 1 nen a in ang chiah - 3 chiah a awm vangin a tawp a awl */}
        <div style={{display:'flex',gap:32,padding:'3px 10px 6px 10px'}}>
          <Link href="/friends" style={m}>Friends</Link>
          <Link href="/groups" style={m}>Groups</Link>
          <Link href="/find-friends" style={m}>Find Friends</Link>
        </div>
      </div>
    </div>
  )
  }

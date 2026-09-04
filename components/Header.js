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

  const goSearch = ()=>{
    if(q.trim()){
      router.push(`/search?k=${encodeURIComponent(q.trim())}`);
    }
  };
  const onKey = (e)=>{ if(e.key==='Enter') goSearch(); };

  return(
    <div style={{position:'fixed',top:0,left:0,right:0,zIndex:999,background:'#3b5998'}}>
      {/* ROW 1: M ZIM + SEARCH TAWI + SEARCH BUTTON */}
      <div style={{display:'flex',alignItems:'center',padding:'5px 8px',gap:6,background:'#3b5998'}}>
        <Link href="/home" style={{textDecoration:'none'}}>
          <div style={{background:'white',color:'#3b5998',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:20,borderRadius:2,lineHeight:1}}>M</div>
        </Link>
        <input 
          value={q}
          onChange={e=>setQ(e.target.value)}
          onKeyDown={onKey}
          placeholder="Zawng rawh..."
          style={{flex:1,maxWidth:'55%',padding:'5px 8px',border:'none',borderRadius:2,fontSize:14,outline:'none'}}
        />
        <button onClick={goSearch} style={{background:'#f0f0f0',border:'1px solid #999',padding:'5px 12px',fontWeight:'bold',fontSize:13,borderRadius:2,cursor:'pointer',color:'#333'}}>Search</button>
      </div>

      {/* ROW 2: MENU - 2 LINE - BOLD LIAN - SEARCH TEL LO */}
      <div style={{display:'flex',flexWrap:'wrap',gap:'0px',background:'#4a67a1',borderTop:'1px solid #355089',padding:'2px 0'}}>
        <Link href="/home" style={{color:'white',textDecoration:'none',fontWeight:'bold',fontSize:15,padding:'7px 14px'}}>Home</Link>
        <Link href="/profile" style={{color:'white',textDecoration:'none',fontWeight:'bold',fontSize:15,padding:'7px 14px'}}>Profile</Link>
        <Link href="/friends" style={{color:'white',textDecoration:'none',fontWeight:'bold',fontSize:15,padding:'7px 14px'}}>Friends</Link>
        <Link href="/message" style={{color:'white',textDecoration:'none',fontWeight:'bold',fontSize:15,padding:'7px 14px'}}>Message{msg>0 && <span style={{background:'red',color:'white',padding:'1px 5px',borderRadius:3,marginLeft:5,fontSize:12}}>{msg}</span>}</Link>
        <Link href="/notifications" style={{color:'white',textDecoration:'none',fontWeight:'bold',fontSize:15,padding:'7px 14px'}}>Notification{noti>0 && <span style={{background:'red',color:'white',padding:'1px 5px',borderRadius:3,marginLeft:5,fontSize:12}}>{noti}</span>}</Link>
        <Link href="/groups" style={{color:'white',textDecoration:'none',fontWeight:'bold',fontSize:15,padding:'7px 14px'}}>Groups</Link>
        <Link href="/market" style={{color:'white',textDecoration:'none',fontWeight:'bold',fontSize:15,padding:'7px 14px'}}>Market</Link>
        <Link href="/videos" style={{color:'white',textDecoration:'none',fontWeight:'bold',fontSize:15,padding:'7px 14px'}}>Videos</Link>
      </div>
    </div>
  )
      }

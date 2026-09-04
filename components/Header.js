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

  const search = (e)=>{
    if(e.key==='Enter' && q.trim()){
      router.push(`/search?k=${encodeURIComponent(q.trim())}`);
    }
  };

  return(
    <div style={{position:'fixed',top:0,left:0,right:0,zIndex:999,background:'#3b5998',color:'white'}}>
      {/* ROW 1: M + SEARCH - OLD FB */}
      <div style={{display:'flex',alignItems:'center',padding:'6px 10px',gap:10,background:'#3b5998'}}>
        <Link href="/home" style={{textDecoration:'none',color:'white'}}>
          <div style={{background:'white',color:'#3b5998',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'900',fontSize:22,borderRadius:2}}>M</div>
        </Link>
        <input 
          value={q}
          onChange={e=>setQ(e.target.value)}
          onKeyDown={search}
          placeholder="Zawng rawh... user, post, group"
          style={{flex:1,padding:'5px 8px',border:'none',borderRadius:2,fontSize:14,outline:'none'}}
        />
      </div>

      {/* ROW 2: MENU BOLD - OLD FB */}
      <div style={{display:'flex',gap:15,padding:'6px 10px',background:'#4a67a1',overflowX:'auto',whiteSpace:'nowrap',fontWeight:'bold',fontSize:13,borderTop:'1px solid #355089'}}>
        <Link href="/home" style={{color:'white',textDecoration:'none'}}>Home</Link>
        <Link href="/profile" style={{color:'white',textDecoration:'none'}}>Profile</Link>
        <Link href="/friends" style={{color:'white',textDecoration:'none'}}>Friends</Link>
        <Link href="/message" style={{color:'white',textDecoration:'none',position:'relative'}}>
          Message {msg>0 && <span style={{background:'#f9ff00',color:'black',padding:'0 5px',borderRadius:2,marginLeft:4,fontSize:11}}>{msg}</span>}
        </Link>
        <Link href="/notifications" style={{color:'white',textDecoration:'none',position:'relative'}}>
          Notification {noti>0 && <span style={{background:'#f9ff00',color:'black',padding:'0 5px',borderRadius:2,marginLeft:4,fontSize:11}}>{noti}</span>}
        </Link>
        <Link href="/groups" style={{color:'white',textDecoration:'none'}}>Groups</Link>
        <Link href="/search" style={{color:'white',textDecoration:'none'}}>Search</Link>
      </div>
    </div>
  )
  }

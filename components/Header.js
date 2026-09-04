import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Link from 'next/link';
export default function Header(){
  const [msgCount,setMsgCount]=useState(0);
  const [notiCount,setNotiCount]=useState(0);
  useEffect(()=>{
    const unsub = auth.onAuthStateChanged(user=>{
      if(!user) return;
      onSnapshot(query(collection(db,"messages"), where("to","==",user.uid), where("read","==",false)), s=> setMsgCount(s.size));
      onSnapshot(query(collection(db,"notifications"), where("to","==",user.uid), where("read","==",false)), s=> setNotiCount(s.size));
    });
    return ()=> unsub();
  },[]);
  return(
    <div style={{position:'fixed',top:0,left:0,right:0,background:'#3b5998',height:42,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 15px',zIndex:1000}}>
      <Link href="/home" style={{color:'white',fontWeight:'bold',fontSize:22,textDecoration:'none'}}>MizoApps</Link>
      <div style={{display:'flex',gap:12,fontSize:13}}>
        <Link href="/home" style={{color:'white',textDecoration:'none'}}>Home</Link>
        <Link href="/profile" style={{color:'white',textDecoration:'none'}}>Profile</Link>
        <Link href="/friends" style={{color:'white',textDecoration:'none'}}>Friends</Link>
        <Link href="/messages" style={{color:msgCount>0?'#000':'white',background:msgCount>0?'#f8e71c':'transparent',padding:'2px 6px',textDecoration:'none',fontWeight:msgCount>0?'bold':'normal'}}>Message {msgCount>0?`(${msgCount})`:''}</Link>
        <Link href="/notifications" style={{color:notiCount>0?'#000':'white',background:notiCount>0?'#f8e71c':'transparent',padding:'2px 6px',textDecoration:'none',fontWeight:notiCount>0?'bold':'normal'}}>Notification {notiCount>0?`(${notiCount})`:''}</Link>
        <Link href="/groups" style={{color:'white',textDecoration:'none'}}>Groups</Link>
      </div>
    </div>
  )
}

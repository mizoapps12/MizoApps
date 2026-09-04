import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
export default function Profile(){
  const [user,setUser]=useState(null); const [data,setData]=useState(null);
  useEffect(()=>{ auth.onAuthStateChanged(async u=>{ setUser(u); if(u){ const snap=await getDoc(doc(db,"users",u.uid)); if(snap.exists()) setData(snap.data()); } }); },[]);
  if(!user) return <div>Loading...</div>;
  return(
    <div style={{background:'#e9eaed',minHeight:'100vh',paddingTop:50}}><Header/>
      <div style={{maxWidth:600,margin:'auto',padding:10}}>
        <div className="old-box" style={{height:150,background:'#3b5998',position:'relative'}}></div>
        <div className="old-box" style={{padding:15,marginTop:-30,position:'relative',display:'flex',gap:15}}>
          <div style={{width:100,height:100,background:'#ddd',border:'3px solid white'}}></div>
          <div><h2 style={{margin:0}}>{data?.name||user.displayName}</h2><div style={{fontSize:13,color:'#666'}}>{data?.village} · {data?.email}</div><div style={{fontSize:12,color:'#666'}}>DoB: {data?.dob}</div></div>
        </div>
        <div className="old-box" style={{padding:10,marginTop:10}}><b>Friends: {data?.friends?.length||0}</b></div>
      </div>
    </div>
  )
}

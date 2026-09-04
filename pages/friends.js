import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
export default function Friends(){
  const [users,setUsers]=useState([]); const [me,setMe]=useState(null); const [myData,setMyData]=useState(null); const [tab,setTab]=useState('all');
  useEffect(()=>{ auth.onAuthStateChanged(async u=>{ setMe(u); if(u){ onSnapshot(collection(db,"users"), s=> setUsers(s.docs.map(d=>d.data()).filter(x=>x.uid!==u.uid))); onSnapshot(doc(db,"users",u.uid), s=>{ if(s.exists()) setMyData(s.data()); }); } }); },[]);
  const addReq = async (targetUid)=>{ await updateDoc(doc(db,"users",targetUid),{friendRequests:arrayUnion(me.uid)}); }
  const accept = async (fromUid)=>{ await updateDoc(doc(db,"users",me.uid),{friends:arrayUnion(fromUid), friendRequests:arrayRemove(fromUid)}); await updateDoc(doc(db,"users",fromUid),{friends:arrayUnion(me.uid)}); }
  const all = users; const online = users.filter(u=>u.online); const requests = users.filter(u=> myData?.friendRequests?.includes(u.uid));
  const list = tab==='all'?all:tab==='online'?online:requests;
  return(
    <div style={{background:'#e9eaed',minHeight:'100vh',paddingTop:50}}><Header/>
      <div style={{maxWidth:600,margin:'auto',padding:10}}>
        <div style={{display:'flex',gap:5,marginBottom:10}}><button onClick={()=>setTab('all')} className="blue-btn" style={{background:tab==='all'?'#3b5998':'#ddd',color:tab==='all'?'white':'black'}}>Friends List ({all.length})</button><button onClick={()=>setTab('online')} className="blue-btn" style={{background:tab==='online'?'#3b5998':'#ddd',color:tab==='online'?'white':'black'}}>Online</button><button onClick={()=>setTab('request')} className="blue-btn" style={{background:tab==='request'?'#3b5998':'#ddd',color:tab==='request'?'white':'black'}}>Request ({requests.length})</button></div>
        {list.map(u=><div key={u.uid} className="old-box" style={{padding:10,marginBottom:8,display:'flex',justifyContent:'space-between'}}><div><b>{u.name}</b> - {u.village} {u.online && <span style={{color:'green',fontSize:11}}>● Online</span>}</div><div>{tab==='request'?<button onClick={()=>accept(u.uid)} className="blue-btn">Accept</button>:myData?.friends?.includes(u.uid)?<span style={{fontSize:12,color:'green'}}>Friend tawh</span>:<button onClick={()=>addReq(u.uid)} className="blue-btn">Add Friend</button>}</div></div>)}
      </div>
    </div>
  )
                                                                                                                            }

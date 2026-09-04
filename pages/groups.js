import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../firebase';
export default function Groups(){
  const [groups,setGroups]=useState([]); const [name,setName]=useState(''); const [me,setMe]=useState(null); const [tab,setTab]=useState('my');
  useEffect(()=>{ auth.onAuthStateChanged(u=> setMe(u)); onSnapshot(query(collection(db,"groups"), orderBy("time","desc")), s=> setGroups(s.docs.map(d=>({id:d.id,...d.data()})))); },[]);
  const create = async ()=>{ if(!name.trim()||!me) return; await addDoc(collection(db,"groups"),{name,owner:me.uid,members:[me.uid],time:new Date()}); setName(''); }
  const join = async (g)=>{ if(g.members.includes(me.uid)) return; await updateDoc(doc(db,"groups",g.id),{members:arrayUnion(me.uid)}); }
  const myGroups = groups.filter(g=> g.members?.includes(me?.uid)); const allGroups = groups;
  const list = tab==='my'?myGroups:allGroups;
  return(
    <div style={{background:'#e9eaed',minHeight:'100vh',paddingTop:50}}><Header/>
      <div style={{maxWidth:600,margin:'auto',padding:10}}>
        <div className="old-box" style={{padding:10,display:'flex',gap:5}}><input value={name} onChange={e=>setName(e.target.value)} placeholder="Group Hming - ex: Tura Thalai" style={{flex:1,padding:8,border:'1px solid #ddd'}}/><button onClick={create} className="green-btn">Create Group</button></div>
        <div style={{display:'flex',gap:5,marginTop:10}}><button onClick={()=>setTab('my')} className="blue-btn" style={{background:tab==='my'?'#3b5998':'#ddd',color:tab==='my'?'white':'black'}}>My Group ({myGroups.length})</button><button onClick={()=>setTab('all')} className="blue-btn" style={{background:tab==='all'?'#3b5998':'#ddd',color:tab==='all'?'white':'black'}}>Group List ({allGroups.length})</button></div>
        {list.map(g=><div key={g.id} className="old-box" style={{padding:10,marginTop:10,display:'flex',justifyContent:'space-between'}}><div><b>{g.name}</b><div style={{fontSize:11}}>Member: {g.members?.length}</div></div><div>{g.members?.includes(me?.uid)?<span style={{fontSize:12,color:'green'}}>Joined</span>:<button onClick={()=>join(g)} className="blue-btn">Join</button>}</div></div>)}
      </div>
    </div>
  )
  }

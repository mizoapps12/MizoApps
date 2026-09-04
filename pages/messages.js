import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '@/firebase';
export default function Messages(){
  const [users,setUsers]=useState([]); const [chat,setChat]=useState([]); const [to,setTo]=useState(null); const [text,setText]=useState(''); const [me,setMe]=useState(null);
  useEffect(()=>{
    auth.onAuthStateChanged(u=>{ setMe(u); onSnapshot(collection(db,"users"), s=> setUsers(s.docs.map(d=>d.data()).filter(x=>x.uid!==u?.uid))); });
    onSnapshot(query(collection(db,"messages"), orderBy("time","desc")), s=> setChat(s.docs.map(d=>({id:d.id,...d.data()}))));
  },[]);
  const send = async ()=>{ if(!text.trim()||!to||!me) return; await addDoc(collection(db,"messages"),{from:me.uid,to:to.uid,text,time:new Date(),read:false}); await addDoc(collection(db,"notifications"),{to:to.uid,from:me.uid,text:`${me.displayName} in message a thawn che`,read:false,time:new Date()}); setText(''); }
  const openChat = async (u)=>{ setTo(u); chat.filter(c=>c.from===u.uid && c.to===me.uid && !c.read).forEach(async m=>{ await updateDoc(doc(db,"messages",m.id),{read:true}); }); }
  const myChat = chat.filter(c=> (c.from===me?.uid && c.to===to?.uid) || (c.from===to?.uid && c.to===me?.uid)).reverse();
  return(
    <div style={{background:'#e9eaed',minHeight:'100vh',paddingTop:50}}><Header/>
      <div style={{display:'flex',maxWidth:800,margin:'auto',height:'calc(100vh - 50px)'}}>
        <div style={{width:250,background:'white',borderRight:'1px solid #ddd',overflowY:'auto'}}>{users.map(u=><div key={u.uid} onClick={()=>openChat(u)} style={{padding:10,borderBottom:'1px solid #eee',cursor:'pointer',background:to?.uid===u.uid?'#e9eaed':'white'}}>{u.name} - {u.village}{chat.filter(c=>c.from===u.uid && c.to===me?.uid && !c.read).length>0 && <span style={{background:'#f8e71c',fontSize:10,padding:'2px 4px',marginLeft:5}}>(1)</span>}</div>)}</div>
        <div style={{flex:1,background:'white',display:'flex',flexDirection:'column'}}>{to?<><div style={{padding:10,borderBottom:'1px solid #ddd',fontWeight:'bold'}}>{to.name}</div><div style={{flex:1,overflowY:'auto',padding:10}}>{myChat.map(m=><div key={m.id} style={{textAlign:m.from===me.uid?'right':'left',marginBottom:8}}><span style={{background:m.from===me.uid?'#3b5998':'#eee',color:m.from===me.uid?'white':'black',padding:'5px 10px',borderRadius:10,display:'inline-block'}}>{m.text}</span></div>)}</div><div style={{padding:10,display:'flex',gap:5}}><input value={text} onChange={e=>setText(e.target.value)} placeholder="Message..." style={{flex:1,padding:8,border:'1px solid #ddd'}}/><button onClick={send} className="blue-btn">Thawn</button></div></>:<div style={{padding:20,textAlign:'center',color:'#999'}}>Mi thlang rawh</div>}</div>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { db, auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

export default function Admin(){
  const [user,setUser]=useState(null)
  const [email,setEmail]=useState('')
  const [pass,setPass]=useState('')
  const [form,setForm]=useState({title:'',category:'Hmangaihna',contentMizo:'',contentEng:''})

  const login=async()=>{
    try{const u=await signInWithEmailAndPassword(auth,email,pass);setUser(u.user)}catch(e){alert(e.message)}
  }
  const publish=async()=>{
    await addDoc(collection(db,'stories'),{...form,createdAt:serverTimestamp()})
    alert('Published! MizoApps ah a lang nghal!');setForm({title:'',category:'Hmangaihna',contentMizo:'',contentEng:''})
  }
  if(!user) return(<div className="container"><h2>MizoApps Admin</h2><input placeholder="email" onChange={e=>setEmail(e.target.value)}/><br/><br/><input type="password" placeholder="password" onChange={e=>setPass(e.target.value)}/><br/><br/><button className="btn" onClick={login}>Login</button></div>)
  return(<div className="container"><h2>Story Thar Ziahna</h2>
    <input placeholder="Thupui / Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{width:'100%',padding:10}}/><br/><br/>
    <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Hmangaihna</option><option>Hlauhawm</option><option>Naupang</option><option>English Lehlin</option><option>Tawi Tawi</option><option>Mizo Thawnthu Hlui</option></select><br/><br/>
    <textarea placeholder="Mizo tawng a thawnthu..." value={form.contentMizo} onChange={e=>setForm({...form,contentMizo:e.target.value})} style={{width:'100%',height:200,padding:10}}/><br/><br/>
    <textarea placeholder="English original (a awm chuan)" value={form.contentEng} onChange={e=>setForm({...form,contentEng:e.target.value})} style={{width:'100%',height:100,padding:10}}/><br/><br/>
    <button className="btn" onClick={publish}>Publish to MizoApps</button>
  </div>)
}

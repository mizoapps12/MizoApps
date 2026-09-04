'use client'
import { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore'
import Link from 'next/link'

export default function Admin(){
  const [user,setUser]=useState(null)
  const [email,setEmail]=useState('')
  const [pass,setPass]=useState('')
  const [categories,setCategories]=useState([])
  const [selectedCatDoc,setSelectedCatDoc]=useState(null)
  const [form,setForm]=useState({title:'',category:'', subCategory:'', contentMizo:'',contentEng:''})

  useEffect(()=>{
    const loadCats=async()=>{
      const snap=await getDocs(collection(db,'categories'))
      if(snap.empty){
        setCategories([
          {name:'Hmangaihna', subcategories:['Thenawm','School']},
          {name:'Hlauhawm', subcategories:['Ramhuai']},
          {name:'Naupang', subcategories:[]},
          {name:'English Lehlin', subcategories:[]},
          {name:'Tawi Tawi', subcategories:[]},
          {name:'Mizo Thawnthu Hlui', subcategories:[]},
        ])
      } else {
        const docs=snap.docs.map(d=>({id:d.id,...d.data()}))
        setCategories(docs)
      }
    }
    loadCats()
  },[])

  const login=async()=>{
    try{const u=await signInWithEmailAndPassword(auth,email,pass);setUser(u.user)}catch(e){alert(e.message)}
  }

  const publish=async()=>{
    if(!form.title || !form.category || !form.contentMizo) return alert('Title, Category leh Mizo content a ngai!')
    await addDoc(collection(db,'stories'),{...form, createdAt:serverTimestamp()})
    alert('Published! MizoApps ah a lang nghal! Auto Category nen!');
    setForm({title:'',category:'', subCategory:'', contentMizo:'',contentEng:''})
    setSelectedCatDoc(null)
  }

  if(!user) return(<div className="container"><h2>MizoApps Admin</h2><input placeholder="email" onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd'}}/><br/><br/><input type="password" placeholder="password" onChange={e=>setPass(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd'}}/><br/><br/><button className="btn" onClick={login}>Login</button></div>)

  return(<div className="container">
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <h2>Story Thar Ziahna</h2>
      <Link href="/admin/categories" style={{textDecoration:'none', background:'#e8e8ec', padding:'8px 14px', borderRadius:'10px', fontWeight:'700', fontSize:'13px', color:'#111'}}>📚 Category Manage</Link>
    </div>

    <input placeholder="Thupui / Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{width:'100%',padding:'12px', borderRadius:'10px', border:'1px solid #ddd', marginTop:'10px'}}/><br/><br/>

    <select value={form.category} onChange={e=>{
      const cat=categories.find(x=>x.name===e.target.value)
      setSelectedCatDoc(cat||null)
      setForm({...form,category:e.target.value, subCategory:''})
    }} style={{width:'100%',padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}}>
      <option value="">Category thlang rawh</option>
      {categories.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}
    </select><br/><br/>

    {selectedCatDoc?.subcategories?.length>0 && (
      <>
        <select value={form.subCategory} onChange={e=>setForm({...form,subCategory:e.target.value})} style={{width:'100%',padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}}>
          <option value="">Sub Category thlang rawh (Optional)</option>
          {selectedCatDoc.subcategories.map((s,i)=><option key={i} value={s}>{s}</option>)}
        </select><br/><br/>
      </>
    )}

    <textarea placeholder="Mizo tawng a thawnthu..." value={form.contentMizo} onChange={e=>setForm({...form,contentMizo:e.target.value})} style={{width:'100%',height:200,padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}}/><br/><br/>
    <textarea placeholder="English original (a awm chuan)" value={form.contentEng} onChange={e=>setForm({...form,contentEng:e.target.value})} style={{width:'100%',height:100,padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}}/><br/><br/>
    <button className="btn" onClick={publish}>Publish to MizoApps</button>
  </div>)
}

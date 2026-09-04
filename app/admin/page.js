'use client'
import { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection, getDocs, serverTimestamp, orderBy, query } from 'firebase/firestore'
import Link from 'next/link'

export default function Admin(){
  const [user,setUser]=useState(null)
  const [email,setEmail]=useState('')
  const [pass,setPass]=useState('')
  const [categories,setCategories]=useState([])
  const [selCat,setSelCat]=useState(null)
  const [form,setForm]=useState({title:'',category:'', subCategory:'', contentMizo:'',contentEng:''})

  const loadCats=async()=>{
    const snap=await getDocs(query(collection(db,'categories'), orderBy('name','asc')))
    const list=snap.docs.map(d=>({id:d.id,...d.data()}))
    setCategories(list)
    if(list.length>0){
      const first=list[0]
      if(!form.category){
        setSelCat(first)
        setForm(f=>({...f, category:first.name}))
      }
    }
  }
  useEffect(()=>{loadCats()},[])

  const login=async()=>{ try{const u=await signInWithEmailAndPassword(auth,email,pass);setUser(u.user)}catch(e){alert(e.message)} }
  const publish=async()=>{
    if(!form.title||!form.category||!form.contentMizo) return alert('Title, Category leh Mizo content a ngai!')
    await addDoc(collection(db,'stories'),{...form, createdAt:serverTimestamp()})
    alert('Published! AUTO!'); setForm({title:'',category:categories[0]?.name||'', subCategory:'', contentMizo:'',contentEng:''})
  }

  if(!user) return(<div className="container"><h2>MizoApps Admin</h2><input placeholder="email" onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd'}}/><br/><br/><input type="password" placeholder="password" onChange={e=>setPass(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd'}}/><br/><br/><button className="btn" onClick={login}>Login</button></div>)

  return(<div className="container">
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}><h2>Story Thar Ziahna</h2><Link href="/admin/categories" style={{background:'white',padding:'8px 14px',borderRadius:'10px',fontWeight:'700',fontSize:'13px',textDecoration:'none',color:'#111',border:'1px solid #ddd'}}>📚 Category Manage</Link></div>

    <input placeholder="Thupui / Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd'}}/><br/><br/>

    <select value={form.category} onChange={e=>{const c=categories.find(x=>x.name===e.target.value); setSelCat(c); setForm({...form,category:e.target.value, subCategory:''})}} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',fontWeight:'600'}}>
      {categories.length===0 && <option>Loading... /admin/categories ah lut hmasa rawh</option>}
      {categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
    </select><br/><br/>

    {selCat?.subcategories?.length>0 && (<><select value={form.subCategory} onChange={e=>setForm({...form,subCategory:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd'}}><option value="">Sub Category (Optional)</option>{selCat.subcategories.map((s,i)=><option key={i} value={s}>{s}</option>)}</select><br/><br/></>)}

    <textarea placeholder="Mizo tawng a thawnthu..." value={form.contentMizo} onChange={e=>setForm({...form,contentMizo:e.target.value})} style={{width:'100%',height:220,padding:'12px',borderRadius:'10px',border:'1px solid #ddd'}}/><br/><br/>
    <textarea placeholder="English original (a awm chuan)" value={form.contentEng} onChange={e=>setForm({...form,contentEng:e.target.value})} style={{width:'100%',height:100,padding:'12px',borderRadius:'10px',border:'1px solid #ddd'}}/><br/><br/>
    <button className="btn" onClick={publish}>Publish to MizoApps</button>
  </div>)
                                                                                                                                                     }

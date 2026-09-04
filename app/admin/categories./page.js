'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, arrayUnion, serverTimestamp, orderBy, query } from 'firebase/firestore'

const DEFAULT_CATS = [
  'Love Story','Funny Story','Horror Story','Science Fiction','Life Lesson Story','Short story','Motivational Story','Mizo Thawnthu','Mimal Chanchin','Thu tha lawrkhawm','Lawrkhawm'
]

export default function ManageCategory(){
  const [cats,setCats]=useState([])
  const [newCat,setNewCat]=useState('')
  const [subInputs,setSubInputs]=useState({})

  const fetchCats=async()=>{
    let snap=await getDocs(query(collection(db,'categories'), orderBy('name','asc')))
    if(snap.empty){
      for(let name of DEFAULT_CATS){
        await addDoc(collection(db,'categories'),{name, subcategories:[], createdAt:serverTimestamp()})
      }
      snap=await getDocs(query(collection(db,'categories'), orderBy('name','asc')))
    }
    setCats(snap.docs.map(d=>({id:d.id,...d.data()})))
  }
  useEffect(()=>{fetchCats()},[])

  const addCategory=async()=>{
    if(!newCat.trim()) return
    await addDoc(collection(db,'categories'),{name:newCat.trim(), subcategories:[], createdAt:serverTimestamp()})
    setNewCat(''); fetchCats()
  }
  const addSub=async(id)=>{
    const sub=subInputs[id]?.trim()
    if(!sub) return
    await updateDoc(doc(db,'categories',id),{subcategories: arrayUnion(sub)})
    setSubInputs({...subInputs,[id]:''}); fetchCats()
  }
  const delCat=async(id)=>{ if(confirm('Delete duh em?')){ await deleteDoc(doc(db,'categories',id)); fetchCats() } }

  const delSub=async(catId, subName)=>{
    if(!confirm(`${subName} delete duh em?`)) return
    const cat=cats.find(c=>c.id===catId)
    const newSubs=(cat.subcategories||[]).filter(s=>s!==subName)
    await updateDoc(doc(db,'categories',catId),{subcategories:newSubs})
    fetchCats()
  }

  return(
    <div className="container">
      <h2 style={{fontWeight:'800'}}>📚 Category Manage</h2>
      <p style={{color:'#888', fontSize:'12px'}}>Hetah i siam apiang Admin leh Category page ah auto in a lang ang</p>
      <div style={{display:'flex',gap:'10px',margin:'15px 0'}}>
        <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="Category thar - entir nan: Bialnu" style={{flex:1, padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}}/>
        <button onClick={addCategory} className="btn">Add</button>
      </div>
      {cats.map(c=><div key={c.id} className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}><b style={{fontSize:'16px'}}>{c.name}</b><button onClick={()=>delCat(c.id)} style={{background:'#fee',color:'red',border:'none',padding:'6px 12px',borderRadius:'8px',cursor:'pointer'}}>Delete</button></div>
        <div style={{display:'flex',gap:'8px',marginTop:'10px'}}><input value={subInputs[c.id]||''} onChange={e=>setSubInputs({...subInputs,[c.id]:e.target.value})} placeholder="Sub category" style={{flex:1,padding:'10px',borderRadius:'8px',border:'1px solid #ddd'}}/><button onClick={()=>addSub(c.id)} style={{background:'#ff6b00',color:'white',border:'none',padding:'10px 14px',borderRadius:'8px',fontWeight:'700',cursor:'pointer'}}>+ Add</button></div>
        <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginTop:'10px'}}>{(c.subcategories||[]).map((s,i)=><span key={i} style={{background:'#e8e8ec',padding:'5px 12px',borderRadius:'20px',fontSize:'12px',display:'flex',gap:'6px',alignItems:'center'}}>{s} <span onClick={()=>delSub(c.id,s)} style={{cursor:'pointer', color:'red', fontWeight:'700'}}>x</span></span>)}</div>
      </div>)}
    </div>
  )
        }

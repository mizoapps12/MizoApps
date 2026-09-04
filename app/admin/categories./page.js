'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore'

export default function ManageCategory(){
  const [cats,setCats]=useState([])
  const [newCat,setNewCat]=useState('')
  const [subInputs,setSubInputs]=useState({})

  const fetchCats=async()=>{
    const snap=await getDocs(collection(db,'categories'))
    setCats(snap.docs.map(d=>({id:d.id,...d.data()})))
  }
  useEffect(()=>{fetchCats()},[])

  const addCategory=async()=>{
    if(!newCat.trim()) return
    await addDoc(collection(db,'categories'),{name:newCat.trim(), subcategories:[], createdAt:serverTimestamp()})
    setNewCat(''); fetchCats()
  }

  const addSub=async(catId)=>{
    const subName=subInputs[catId]?.trim()
    if(!subName) return
    await updateDoc(doc(db,'categories',catId),{subcategories: arrayUnion(subName)})
    setSubInputs({...subInputs, [catId]:''})
    fetchCats()
  }

  const delCat=async(id)=>{ if(confirm('Delete?')){ await deleteDoc(doc(db,'categories',id)); fetchCats() } }

  return(
    <div className="container">
      <h2 style={{fontWeight:'800'}}>📚 Category + Sub Category</h2>
      <div style={{display:'flex',gap:'10px',margin:'15px 0'}}>
        <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="Category thar" style={{flex:1, padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}}/>
        <button onClick={addCategory} className="btn">Add Category</button>
      </div>

      {cats.map(c=><div key={c.id} className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <b style={{fontSize:'18px'}}>{c.name}</b>
          <button onClick={()=>delCat(c.id)} style={{border:'none', background:'#fee', color:'red', padding:'6px 12px', borderRadius:'8px', cursor:'pointer'}}>Delete</button>
        </div>
        <div style={{display:'flex', gap:'8px', marginTop:'12px'}}>
          <input value={subInputs[c.id]||''} onChange={e=>setSubInputs({...subInputs, [c.id]:e.target.value})} placeholder={`${c.name} Sub Category - entir nan: Thenawm`} style={{flex:1, padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}}/>
          <button onClick={()=>addSub(c.id)} style={{background:'#ff6b00', color:'white', border:'none', padding:'10px 16px', borderRadius:'8px', fontWeight:'700', cursor:'pointer'}}>+ Add Sub</button>
        </div>
        <div style={{display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'10px'}}>
          {(c.subcategories||[]).map((s,i)=><span key={i} style={{background:'#e8e8ec', padding:'6px 12px', borderRadius:'20px', fontSize:'13px', fontWeight:'600'}}>{s}</span>)}
        </div>
      </div>)}
    </div>
  )
        }

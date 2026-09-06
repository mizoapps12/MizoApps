'use client'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'

export default function CategoryMapAdmin(){
  const [maps, setMaps] = useState([])
  const [newOriginal, setNewOriginal] = useState('')
  const [newDisplay, setNewDisplay] = useState('')

  const load = async()=>{
    const snap = await getDocs(collection(db,'categoryMap'))
    setMaps(snap.docs.map(d=>({id:d.id, ...d.data()})))
  }
  useEffect(()=>{ load() },[])

  const handleUpdate = async(id, newDisplayName)=>{
    await updateDoc(doc(db,'categoryMap', id), { display: newDisplayName })
    alert('Thlak fel! ✅')
    load()
  }

  const handleAdd = async()=>{
    if(!newOriginal || !newDisplay) return alert('Fill rawh!')
    await addDoc(collection(db,'categoryMap'),{
      original: newOriginal.trim(),
      display: newDisplay.trim(),
      createdAt: serverTimestamp()
    })
    setNewOriginal('')
    setNewDisplay('')
    alert('Add success! ✅')
    load()
  }

  const handleDelete = async(id)=>{
    if(!confirm('Delete duh em?')) return
    await deleteDoc(doc(db,'categoryMap', id))
    load()
  }

  return(
    <div style={{minHeight:'100vh', background:'#f2f2f7', padding:'20px', paddingTop:'70px'}}>
      <div style={{maxWidth:'500px', margin:'0 auto'}}>
        <h2 style={{fontWeight:'800', fontSize:'20px', marginBottom:'16px'}}>Category Hming Thlakna</h2>

        {/* Add thar */}
        <div style={{background:'white', borderRadius:'16px', padding:'16px', marginBottom:'16px', display:'flex', flexDirection:'column', gap:'10px'}}>
          <input value={newOriginal} onChange={e=>setNewOriginal(e.target.value)} placeholder="Original (Ent: Funny Story)" style={{height:'44px', border:'1px solid #ddd', borderRadius:'10px', padding:'0 12px'}}/>
          <input value={newDisplay} onChange={e=>setNewDisplay(e.target.value)} placeholder="Display (Ent: Fiamthu)" style={{height:'44px', border:'1px solid #ddd', borderRadius:'10px', padding:'0 12px'}}/>
          <button onClick={handleAdd} style={{height:'44px', background:'#16a34a', color:'white', border:'none', borderRadius:'10px', fontWeight:'700'}}>Add / Save</button>
        </div>

        {/* List */}
        <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          {maps.map(m=>(
            <div key={m.id} style={{background:'white', borderRadius:'12px', padding:'14px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontSize:'13px', color:'#888'}}>{m.original || '(ruak - delete rawh)'}</div>
                <input 
                  defaultValue={m.display} 
                  id={`input-${m.id}`}
                  style={{fontSize:'16px', fontWeight:'700', border:'1px solid #ddd', borderRadius:'8px', padding:'4px 8px', marginTop:'4px'}}
                />
              </div>
              <div style={{display:'flex', gap:'8px'}}>
                <button onClick={()=>{
                  const val = document.getElementById(`input-${m.id}`).value
                  handleUpdate(m.id, val)
                }} style={{background:'#007AFF', color:'white', border:'none', borderRadius:'8px', padding:'8px 12px', fontWeight:'700'}}>Save</button>
                <button onClick={()=>handleDelete(m.id)} style={{background:'#ff3b30', color:'white', border:'none', borderRadius:'8px', padding:'8px 10px'}}>X</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop:'20px', fontSize:'12px', color:'#888', textAlign:'center'}}>
          I thlak tawh chuan Home & Category page ah auto in a inthlak ang. Firebase console a tih a ngai lo.
        </div>
      </div>
    </div>
  )
    }

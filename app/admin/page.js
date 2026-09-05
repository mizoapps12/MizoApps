'use client'
import { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc, arrayUnion, serverTimestamp, orderBy, query } from 'firebase/firestore'

const DEFAULT_CATS = [
  'Love Story','Funny Story','Horror Story','Science Fiction','Life Lesson Story','Short story','Motivational Story','Mizo Thawnthu','Mimal Chanchin','Thu tha lawrkhawm','Lawrkhawm','Pathian thu'
]

export default function Admin(){
  const [user,setUser]=useState(null)
  const [email,setEmail]=useState('')
  const [pass,setPass]=useState('')
  const [categories,setCategories]=useState([])
  const [selCat,setSelCat]=useState(null)
  const [form,setForm]=useState({title:'',category:'', subCategory:'', contentMizo:'',contentEng:''})
  const [tab,setTab]=useState('write') // write | manage
  const [newCat,setNewCat]=useState('')
  const [subInputs,setSubInputs]=useState({})

  const loadCats=async()=>{
    let snap=await getDocs(query(collection(db,'categories'), orderBy('name','asc')))
    if(snap.empty){
      for(let name of DEFAULT_CATS){
        await addDoc(collection(db,'categories'),{name, subcategories:[], createdAt:serverTimestamp()})
      }
      snap=await getDocs(query(collection(db,'categories'), orderBy('name','asc')))
    }
    const list=snap.docs.map(d=>({id:d.id,...d.data()}))
    setCategories(list)
    if(list.length>0 &&!form.category){
      setSelCat(list[0])
      setForm(f=>({...f, category:list[0].name}))
    }
  }
  useEffect(()=>{loadCats()},[])

  const login=async()=>{ try{const u=await signInWithEmailAndPassword(auth,email,pass);setUser(u.user)}catch(e){alert(e.message)} }

  const publish=async()=>{
    if(!form.title||!form.category||!form.contentMizo) return alert('A kim lo!')
    await addDoc(collection(db,'stories'),{...form, createdAt:serverTimestamp()})
    alert('Published AUTO!'); setForm({title:'',category:categories[0]?.name||'', subCategory:'', contentMizo:'',contentEng:''})
  }

  const addCategory=async()=>{
    if(!newCat.trim()) return
    await addDoc(collection(db,'categories'),{name:newCat.trim(), subcategories:[], createdAt:serverTimestamp()})
    setNewCat(''); loadCats()
  }
  const addSub=async(id)=>{
    const sub=subInputs[id]?.trim()
    if(!sub) return
    await updateDoc(doc(db,'categories',id),{subcategories: arrayUnion(sub)})
    setSubInputs({...subInputs,[id]:''}); loadCats()
  }
  const delCat=async(id)=>{ if(confirm('Delete?')){ await deleteDoc(doc(db,'categories',id)); loadCats() } }
  const delSub=async(catId, subName)=>{
    const cat=categories.find(c=>c.id===catId)
    const newSubs=(cat.subcategories||[]).filter(s=>s!==subName)
    await updateDoc(doc(db,'categories',catId),{subcategories:newSubs})
    loadCats()
  }

  if(!user) return(<div className="container"><h2>MizoApps Admin</h2><input placeholder="email" onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd'}}/><br/><br/><input type="password" placeholder="password" onChange={e=>setPass(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd'}}/><br/><br/><button className="btn" onClick={login}>Login</button></div>)

  return(<div className="container">
    <div style={{display:'flex',gap:'10px',marginBottom:'15px'}}>
      <button onClick={()=>setTab('write')} style={{padding:'10px 18px',borderRadius:'10px',border:'1px solid #ddd',background:tab==='write'?'#111':'white',color:tab==='write'?'white':'#111',fontWeight:'700'}}>✍️ Write Story</button>
      <button onClick={()=>setTab('manage')} style={{padding:'10px 18px',borderRadius:'10px',border:'1px solid #ddd',background:tab==='manage'?'#111':'white',color:tab==='manage'?'white':'#111',fontWeight:'700'}}>📚 Category Manage</button>
    </div>

    {tab==='write' && (<div>
      <h2 style={{fontWeight:'800'}}>Story Thar Ziahna</h2>
      <input placeholder="Thupui / Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'10px'}}/><br/><br/>
      <select value={form.category} onChange={e=>{const c=categories.find(x=>x.name===e.target.value); setSelCat(c); setForm({...form,category:e.target.value, subCategory:''})}} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',fontWeight:'600'}}>
        {categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
      </select><br/><br/>
      {selCat?.subcategories?.length>0 && (<><select value={form.subCategory} onChange={e=>setForm({...form,subCategory:e.target.value})} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd'}}><option value="">Sub Category</option>{selCat.subcategories.map((s,i)=><option key={i} value={s}>{s}</option>)}</select><br/><br/></>)}
      <textarea placeholder="Mizo tawng a thawnthu..." value={form.contentMizo} onChange={e=>setForm({...form,contentMizo:e.target.value})} style={{width:'100%',height:220,padding:'12px',borderRadius:'10px',border:'1px solid #ddd'}}/><br/><br/>
      <textarea placeholder="English original (a awm chuan)" value={form.contentEng} onChange={e=>setForm({...form,contentEng:e.target.value})} style={{width:'100%',height:100,padding:'12px',borderRadius:'10px',border:'1px solid #ddd'}}/><br/><br/>
      <button className="btn" onClick={publish}>Publish to MizoApps</button>
    </div>)}

    {tab==='manage' && (<div>
      <h2 style={{fontWeight:'800'}}>📚 Category Manage - AUTO</h2>
      <p style={{color:'#888',fontSize:'12px'}}>Hetah i siam apiang Option ah leh /category ah auto in a lang ang</p>
      <div style={{display:'flex',gap:'10px',margin:'15px 0'}}>
        <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="Category thar - Pathian thu" style={{flex:1, padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}}/>
        <button onClick={addCategory} className="btn">Add</button>
      </div>
      {categories.map(c=><div key={c.id} className="card" style={{background:'white',padding:'14px',borderRadius:'14px',marginBottom:'10px',border:'1px solid #eee'}}>
        <div style={{display:'flex', justifyContent:'space-between'}}><b>{c.name}</b><button onClick={()=>delCat(c.id)} style={{background:'#fee',color:'red',border:'none',padding:'6px 12px',borderRadius:'8px'}}>Delete</button></div>
        <div style={{display:'flex',gap:'8px',marginTop:'10px'}}><input value={subInputs[c.id]||''} onChange={e=>setSubInputs({...subInputs,[c.id]:e.target.value})} placeholder="Sub category" style={{flex:1,padding:'10px',borderRadius:'8px',border:'1px solid #ddd'}}/><button onClick={()=>addSub(c.id)} style={{background:'#ff6b00',color:'white',border:'none',padding:'10px 14px',borderRadius:'8px',fontWeight:'700'}}>+</button></div>
        <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginTop:'10px'}}>{(c.subcategories||[]).map((s,i)=><span key={i} style={{background:'#eee',padding:'5px 12px',borderRadius:'20px',fontSize:'12px'}}>{s} <span onClick={()=>delSub(c.id,s)} style={{color:'red',cursor:'pointer',marginLeft:'4px',fontWeight:'700'}}>x</span></span>)}</div>
      </div>)}
    </div>)}
  </div>)
                                                                                                                                                   }

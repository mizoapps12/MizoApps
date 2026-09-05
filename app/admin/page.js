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
  const [showPass,setShowPass]=useState(false)
  const [categories,setCategories]=useState([])
  const [selCat,setSelCat]=useState(null)
  const [form,setForm]=useState({title:'',category:'', subCategory:'', contentMizo:'',contentEng:''})
  const [tab,setTab]=useState('write')
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
    alert('Published!'); setForm({title:'',category:categories[0]?.name||'', subCategory:'', contentMizo:'',contentEng:''})
  }

  const addCategory=async()=>{ if(!newCat.trim()) return; await addDoc(collection(db,'categories'),{name:newCat.trim(), subcategories:[], createdAt:serverTimestamp()}); setNewCat(''); loadCats() }
  const addSub=async(id)=>{ const sub=subInputs[id]?.trim(); if(!sub) return; await updateDoc(doc(db,'categories',id),{subcategories: arrayUnion(sub)}); setSubInputs({...subInputs,[id]:''}); loadCats() }
  const delCat=async(id)=>{ if(confirm('Delete?')){ await deleteDoc(doc(db,'categories',id)); loadCats() } }
  const delSub=async(catId, subName)=>{ const cat=categories.find(c=>c.id===catId); const newSubs=(cat.subcategories||[]).filter(s=>s!==subName); await updateDoc(doc(db,'categories',catId),{subcategories:newSubs}); loadCats() }

  const centerStyle = { width:'92%', maxWidth:'380px', margin:'0 auto', display:'block' }
  const inputStyle = { width:'100%', padding:'13px 15px', borderRadius:'12px', border:'1px solid #ddd', background:'white', fontSize:'14px', outline:'none' }

  if(!user) return(
    <div style={{minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{...centerStyle, textAlign:'center'}}>
        <h2 style={{fontWeight:'800', marginBottom:'24px'}}>MizoApps Admin</h2>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} style={{...inputStyle, marginBottom:'14px'}}/>
        <div style={{position:'relative', marginBottom:'18px'}}>
          <input type={showPass?'text':'password'} placeholder="password" value={pass} onChange={e=>setPass(e.target.value)} style={{...inputStyle, paddingRight:'45px'}}/>
          <span onClick={()=>setShowPass(!showPass)} style={{position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', cursor:'pointer', fontSize:'18px'}}>
            {showPass?'🙈':'👁️'}
          </span>
        </div>
        <button onClick={login} style={{background:'#111', color:'white', padding:'12px 28px', borderRadius:'12px', border:'none', fontWeight:'700', width:'100%'}}>Login</button>
      </div>
    </div>
  )

  return(
    <div style={{padding:'16px'}}>
      <div style={{...centerStyle, maxWidth:'420px'}}>
        <div style={{display:'flex',gap:'10px',marginBottom:'18px', justifyContent:'center'}}>
          <button onClick={()=>setTab('write')} style={{padding:'10px 18px',borderRadius:'10px',border:'1px solid #ddd',background:tab==='write'?'#111':'white',color:tab==='write'?'white':'#111',fontWeight:'700', fontSize:'13px'}}>✍️ Write</button>
          <button onClick={()=>setTab('manage')} style={{padding:'10px 18px',borderRadius:'10px',border:'1px solid #ddd',background:tab==='manage'?'#111':'white',color:tab==='manage'?'white':'#111',fontWeight:'700', fontSize:'13px'}}>📚 Manage</button>
        </div>

        {tab==='write' && (<div style={{textAlign:'center'}}>
          <h2 style={{fontWeight:'800', marginBottom:'18px'}}>Story Thar Ziahna</h2>
          <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
            <input placeholder="Thupui / Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={inputStyle}/>
            <select value={form.category} onChange={e=>{const c=categories.find(x=>x.name===e.target.value); setSelCat(c); setForm({...form,category:e.target.value, subCategory:''})}} style={inputStyle}>
              {categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            {selCat?.subcategories?.length>0 && (
              <select value={form.subCategory} onChange={e=>setForm({...form,subCategory:e.target.value})} style={inputStyle}>
                <option value="">Sub Category</option>{selCat.subcategories.map((s,i)=><option key={i} value={s}>{s}</option>)}
              </select>
            )}
            <textarea placeholder="Mizo tawng a thawnthu..." value={form.contentMizo} onChange={e=>setForm({...form,contentMizo:e.target.value})} style={{...inputStyle, height:'180px', resize:'none'}}/>
            <textarea placeholder="English original (a awm chuan)" value={form.contentEng} onChange={e=>setForm({...form,contentEng:e.target.value})} style={{...inputStyle, height:'90px', resize:'none'}}/>
            <button onClick={publish} style={{background:'#111', color:'white', padding:'13px', borderRadius:'12px', border:'none', fontWeight:'700', marginTop:'4px'}}>Publish to MizoApps</button>
          </div>
        </div>)}

        {tab==='manage' && (<div style={{textAlign:'center'}}>
          <h2 style={{fontWeight:'800'}}>📚 Category</h2>
          <p style={{color:'#888',fontSize:'11px', marginBottom:'12px'}}>Siam apiang auto in a lang ang</p>
          <div style={{display:'flex',gap:'8px',margin:'12px 0'}}>
            <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="Pathian thu" style={{...inputStyle, flex:1}}/>
            <button onClick={addCategory} style={{background:'#111', color:'white', padding:'0 18px', borderRadius:'12px', border:'none', fontWeight:'700'}}>Add</button>
          </div>
          {categories.map(c=><div key={c.id} style={{background:'white',padding:'12px',borderRadius:'12px',marginBottom:'8px',border:'1px solid #eee', textAlign:'left'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><b style={{fontSize:'14px'}}>{c.name}</b><button onClick={()=>delCat(c.id)} style={{background:'#fee',color:'red',border:'none',padding:'4px 10px',borderRadius:'8px',fontSize:'12px'}}>Delete</button></div>
            <div style={{display:'flex',gap:'6px',marginTop:'8px'}}><input value={subInputs[c.id]||''} onChange={e=>setSubInputs({...subInputs,[c.id]:e.target.value})} placeholder="Sub" style={{...inputStyle, padding:'8px 10px', fontSize:'12px'}}/><button onClick={()=>addSub(c.id)} style={{background:'#ff6b00',color:'white',border:'none',padding:'8px 12px',borderRadius:'8px',fontWeight:'700'}}>+</button></div>
            <div style={{display:'flex',gap:'5px',flexWrap:'wrap',marginTop:'8px'}}>{(c.subcategories||[]).map((s,i)=><span key={i} style={{background:'#eee',padding:'3px 10px',borderRadius:'20px',fontSize:'11px'}}>{s} <span onClick={()=>delSub(c.id,s)} style={{color:'red',cursor:'pointer'}}>x</span></span>)}</div>
          </div>)}
        </div>)}
      </div>
    </div>
  )
          }

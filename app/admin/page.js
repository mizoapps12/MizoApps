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
  const [newCatWrite,setNewCatWrite]=useState('')
  const [newSubWrite,setNewSubWrite]=useState('')
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
    } else if(form.category){
      setSelCat(list.find(c=>c.name===form.category)||list[0])
    }
  }
  useEffect(()=>{loadCats()},[])

  const login=async()=>{ try{const u=await signInWithEmailAndPassword(auth,email,pass);setUser(u.user)}catch(e){alert(e.message)} }
  const publish=async()=>{
    if(!form.title||!form.category||!form.contentMizo) return alert('A kim lo!')
    await addDoc(collection(db,'stories'),{...form, createdAt:serverTimestamp()})
    alert('Published!'); setForm({title:'',category:categories[0]?.name||'', subCategory:'', contentMizo:'',contentEng:''})
  }

  // Manage tab functions
  const addCategory=async()=>{ if(!newCat.trim()) return; await addDoc(collection(db,'categories'),{name:newCat.trim(), subcategories:[], createdAt:serverTimestamp()}); setNewCat(''); loadCats() }
  const addSub=async(id)=>{ const sub=subInputs[id]?.trim(); if(!sub) return; await updateDoc(doc(db,'categories',id),{subcategories: arrayUnion(sub)}); setSubInputs({...subInputs,[id]:''}); loadCats() }
  const delCat=async(id)=>{ if(confirm('Delete?')){ await deleteDoc(doc(db,'categories',id)); loadCats() } }
  const delSub=async(catId, subName)=>{ const cat=categories.find(c=>c.id===catId); const newSubs=(cat.subcategories||[]).filter(s=>s!==subName); await updateDoc(doc(db,'categories',catId),{subcategories:newSubs}); loadCats() }

  // Write page a category siamna
  const addCatFromWrite=async()=>{
    if(!newCatWrite.trim()) return
    await addDoc(collection(db,'categories'),{name:newCatWrite.trim(), subcategories:[], createdAt:serverTimestamp()})
    setForm({...form, category:newCatWrite.trim(), subCategory:''})
    setNewCatWrite(''); await loadCats()
  }
  const addSubFromWrite=async()=>{
    if(!newSubWrite.trim() ||!selCat) return
    await updateDoc(doc(db,'categories',selCat.id),{subcategories: arrayUnion(newSubWrite.trim())})
    setForm({...form, subCategory:newSubWrite.trim()})
    setNewSubWrite(''); await loadCats()
  }

  const inputBox = { width:'92%', maxWidth:'360px', height:'48px', padding:'0 15px', borderRadius:'12px', border:'1px solid #ddd', background:'white', fontSize:'14px', outline:'none', boxSizing:'border-box' }

  if(!user) return(
    <div style={{minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
      <h2 style={{fontWeight:'800', marginBottom:'24px', textAlign:'center'}}>MizoApps Admin</h2>
      <div style={{width:'92%', maxWidth:'360px', display:'flex', flexDirection:'column', gap:'14px', alignItems:'center'}}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} style={inputBox}/>
        <div style={{position:'relative', width:'100%'}}>
          <input type={showPass?'text':'password'} placeholder="password" value={pass} onChange={e=>setPass(e.target.value)} style={{...inputBox, width:'100%', paddingRight:'45px'}}/>
          <span onClick={()=>setShowPass(!showPass)} style={{position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', cursor:'pointer', fontSize:'20px', lineHeight:'1'}}>👁️</span>
        </div>
        <button onClick={login} style={{...inputBox, background:'#111', color:'white', fontWeight:'700', cursor:'pointer'}}>Login</button>
      </div>
    </div>
  )

  const smallInput = { flex:1, padding:'10px 12px', borderRadius:'10px', border:'1px solid #ddd', background:'white', fontSize:'13px' }

  return(
    <div style={{padding:'16px'}}>
      <div style={{width:'92%', maxWidth:'400px', margin:'0 auto'}}>
        <div style={{display:'flex',gap:'10px',marginBottom:'18px', justifyContent:'center'}}>
          <button onClick={()=>setTab('write')} style={{padding:'10px 18px',borderRadius:'10px',border:'1px solid #ddd',background:tab==='write'?'#111':'white',color:tab==='write'?'white':'#111',fontWeight:'700', fontSize:'13px'}}>✍️ Write Story</button>
          <button onClick={()=>setTab('manage')} style={{padding:'10px 18px',borderRadius:'10px',border:'1px solid #ddd',background:tab==='manage'?'#111':'white',color:tab==='manage'?'white':'#111',fontWeight:'700', fontSize:'13px'}}>📚 Category Manage</button>
        </div>

        {tab==='write' && (
          <div style={{display:'flex', flexDirection:'column', gap:'14px', alignItems:'center'}}>
            <h2 style={{fontWeight:'800', margin:'0 0 6px 0', textAlign:'center'}}>Story Thar Ziahna</h2>
            <input placeholder="Thupui / Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{...inputBox, width:'100%'}}/>

            {/* Category select + Add new category */}
            <div style={{width:'100%'}}>
              <select value={form.category} onChange={e=>{const c=categories.find(x=>x.name===e.target.value); setSelCat(c); setForm({...form,category:e.target.value, subCategory:''})}} style={{...inputBox, width:'100%'}}>
                {categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <div style={{display:'flex', gap:'6px', marginTop:'8px'}}>
                <input value={newCatWrite} onChange={e=>setNewCatWrite(e.target.value)} placeholder="Category thar siam - entir: Pathian thu" style={smallInput}/>
                <button onClick={addCatFromWrite} style={{background:'#ff6b00', color:'white', border:'none', padding:'0 14px', borderRadius:'10px', fontWeight:'700', fontSize:'12px'}}>Add</button>
              </div>
            </div>

            {/* Sub category select + Add */}
            <div style={{width:'100%'}}>
              <select value={form.subCategory} onChange={e=>setForm({...form,subCategory:e.target.value})} style={{...inputBox, width:'100%'}}>
                <option value="">Sub Category (Optional)</option>
                {(selCat?.subcategories||[]).map((s,i)=><option key={i} value={s}>{s}</option>)}
              </select>
              {selCat && (
                <div style={{display:'flex', gap:'6px', marginTop:'8px'}}>
                  <input value={newSubWrite} onChange={e=>setNewSubWrite(e.target.value)} placeholder={`${selCat.name} ah sub siam`} style={smallInput}/>
                  <button onClick={addSubFromWrite} style={{background:'#111', color:'white', border:'none', padding:'0 14px', borderRadius:'10px', fontWeight:'700', fontSize:'12px'}}>Add</button>
                </div>
              )}
            </div>

            <textarea placeholder="Mizo tawng a thawnthu..." value={form.contentMizo} onChange={e=>setForm({...form,contentMizo:e.target.value})} style={{width:'100%', height:'180px', padding:'12px 15px', borderRadius:'12px', border:'1px solid #ddd', fontSize:'14px', boxSizing:'border-box'}}/>
            <textarea placeholder="English original (a awm chuan)" value={form.contentEng} onChange={e=>setForm({...form,contentEng:e.target.value})} style={{width:'100%', height:'90px', padding:'12px 15px', borderRadius:'12px', border:'1px solid #ddd', fontSize:'14px', boxSizing:'border-box'}}/>
            <button onClick={publish} style={{...inputBox, width:'100%', background:'#111', color:'white', fontWeight:'700'}}>Publish to MizoApps</button>
          </div>
        )}

        {tab==='manage' && (
          <div>
            <h3 style={{fontWeight:'800', textAlign:'center'}}>📚 Category Manage</h3>
            <div style={{display:'flex',gap:'6px',margin:'12px 0'}}>
              <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="Category thar" style={smallInput}/>
              <button onClick={addCategory} style={{background:'#111', color:'white', border:'none', padding:'0 16px', borderRadius:'10px', fontWeight:'700'}}>Add</button>
            </div>
            {categories.map(c=><div key={c.id} style={{background:'white',padding:'10px',borderRadius:'10px',marginBottom:'8px',border:'1px solid #eee'}}>
              <div style={{display:'flex', justifyContent:'space-between'}}><b style={{fontSize:'13px'}}>{c.name}</b><button onClick={()=>delCat(c.id)} style={{background:'#fee',color:'red',border:'none',padding:'4px 8px',borderRadius:'6px',fontSize:'11px'}}>Delete</button></div>
              <div style={{display:'flex',gap:'6px',marginTop:'6px'}}><input value={subInputs[c.id]||''} onChange={e=>setSubInputs({...subInputs,[c.id]:e.target.value})} placeholder="Sub" style={{...smallInput, padding:'6px 8px'}}/><button onClick={()=>addSub(c.id)} style={{background:'#ff6b00',color:'white',border:'none',padding:'6px 10px',borderRadius:'6px',fontWeight:'700'}}>+</button></div>
              <div style={{display:'flex',gap:'4px',flexWrap:'wrap',marginTop:'6px'}}>{(c.subcategories||[]).map((s,i)=><span key={i} style={{background:'#eee',padding:'2px 8px',borderRadius:'10px',fontSize:'10px'}}>{s} <span onClick={()=>delSub(c.id,s)} style={{color:'red',cursor:'pointer'}}>x</span></span>)}</div>
            </div>)}
          </div>
        )}
      </div>
    </div>
  )
  }

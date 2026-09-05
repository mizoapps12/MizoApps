'use client'
import { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc, arrayUnion, serverTimestamp, orderBy, query } from 'firebase/firestore'

const DEFAULT_CATS = ['Love Story','Funny Story','Horror Story','Science Fiction','Life Lesson Story','Short story','Motivational Story','Mizo Thawnthu','Mimal Chanchin','Thu tha lawrkhawm','Lawrkhawm','Pathian thu']

export default function Admin(){
  const [user,setUser]=useState(null)
  const [loading,setLoading]=useState(true)
  const [email,setEmail]=useState('')
  const [pass,setPass]=useState('')
  const [showPass,setShowPass]=useState(false)
  const [categories,setCategories]=useState([])
  const [selCat,setSelCat]=useState(null)
  const [form,setForm]=useState({title:'',category:'', subCategory:'', contentMizo:'',contentEng:''})
  const [tab,setTab]=useState('write')
  const [newCat,setNewCat]=useState('')
  const [subInputs,setSubInputs]=useState({})
  const [editId,setEditId]=useState(null)
  const [editName,setEditName]=useState('')

  // LOGIN PERSIST - REFRESH PAWH A BO LO ANG!
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{
      setUser(u)
      setLoading(false)
    })
    return ()=>unsub()
  },[])

  const loadCats=async()=>{
    let snap=await getDocs(query(collection(db,'categories'), orderBy('name','asc')))
    if(snap.empty){
      for(let name of DEFAULT_CATS){ await addDoc(collection(db,'categories'),{name, subcategories:[], createdAt:serverTimestamp()}) }
      snap=await getDocs(query(collection(db,'categories'), orderBy('name','asc')))
    }
    const list=snap.docs.map(d=>({id:d.id,...d.data()}))
    setCategories(list)
    if(list.length>0 &&!form.category){ setSelCat(list[0]); setForm(f=>({...f, category:list[0].name})) }
    else if(form.category){ setSelCat(list.find(c=>c.name===form.category)||list[0]) }
  }
  useEffect(()=>{ if(user) loadCats() },[user])

  const login=async()=>{ try{await signInWithEmailAndPassword(auth,email,pass)}catch(e){alert(e.message)} }
  const logout=async()=>{ await signOut(auth); setUser(null) }
  const publish=async()=>{ if(!form.title||!form.category||!form.contentMizo) return alert('A kim lo!'); await addDoc(collection(db,'stories'),{...form, createdAt:serverTimestamp()}); alert('Published!'); setForm({title:'',category:categories[0]?.name||'', subCategory:'', contentMizo:'',contentEng:''}) }

  const addCategory=async()=>{ if(!newCat.trim()) return; await addDoc(collection(db,'categories'),{name:newCat.trim(), subcategories:[], createdAt:serverTimestamp()}); setNewCat(''); loadCats() }
  const addSub=async(id)=>{ const sub=subInputs[id]?.trim(); if(!sub) return; await updateDoc(doc(db,'categories',id),{subcategories: arrayUnion(sub)}); setSubInputs({...subInputs,[id]:''}); loadCats() }
  const delCat=async(id)=>{ if(confirm('Delete?')){ await deleteDoc(doc(db,'categories',id)); loadCats() } }
  const delSub=async(catId, subName)=>{ const cat=categories.find(c=>c.id===catId); const newSubs=(cat.subcategories||[]).filter(s=>s!==subName); await updateDoc(doc(db,'categories',catId),{subcategories:newSubs}); loadCats() }
  const startEdit=(c)=>{ setEditId(c.id); setEditName(c.name) }
  const saveEdit=async()=>{ if(!editName.trim()) return; await updateDoc(doc(db,'categories',editId),{name:editName.trim()}); setEditId(null); setEditName(''); loadCats() }

  const box = { width:'100%', height:'50px', borderRadius:'14px', border:'1px solid #ddd', background:'white', padding:'0 16px', fontSize:'14px', outline:'none', boxSizing:'border-box' }

  if(loading) return <div style={{textAlign:'center', paddingTop:'60px'}}>Loading...</div>

  if(!user) return(
    <div style={{minHeight:'70vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px'}}>
      <h2 style={{fontWeight:'800', marginBottom:'22px'}}>MizoApps Admin</h2>
      <div style={{width:'100%', maxWidth:'360px', display:'flex', flexDirection:'column', gap:'14px'}}>
        <div><div style={{fontWeight:'700', fontSize:'13px', marginBottom:'6px', marginLeft:'4px'}}>Email</div><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={box}/></div>
        <div><div style={{fontWeight:'700', fontSize:'13px', marginBottom:'6px', marginLeft:'4px'}}>Password</div><div style={{position:'relative'}}><input type={showPass?'text':'password'} placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} style={{...box, paddingRight:'44px'}}/><span onClick={()=>setShowPass(!showPass)} style={{position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', cursor:'pointer', fontSize:'20px'}}>{showPass?'🙈':'👁️'}</span></div></div>
        <button onClick={login} style={{...box, background:'#111', color:'white', fontWeight:'700', marginTop:'6px'}}>Login</button>
      </div>
    </div>
  )

  return(
    <div style={{minHeight:'100vh', background:'#f2f2f7'}}>
      {/* HEADER TAB - A CHUNG BER AH - A BO TAWH LO ANG! */}
      <div style={{background:'#111', padding:'10px', display:'flex', gap:'8px', position:'sticky', top:0, zIndex:100}}>
        <button onClick={()=>setTab('write')} style={{flex:1, padding:'13px', borderRadius:'10px', border:'none', background:tab==='write'?'#fff':'#2a2a2a', color:tab==='write'?'#111':'#999', fontWeight:'800', fontSize:'13px', letterSpacing:'0.5px'}}>{tab==='write'?'● ':''}WRITE STORY</button>
        <button onClick={()=>setTab('manage')} style={{flex:1, padding:'13px', borderRadius:'10px', border:'none', background:tab==='manage'?'#fff':'#2a2a2a', color:tab==='manage'?'#111':'#999', fontWeight:'800', fontSize:'13px', letterSpacing:'0.5px'}}>{tab==='manage'?'● ':''}MANAGE CATEGORY</button>
      </div>

      <div style={{padding:'16px'}}>
        <div style={{width:'92%', maxWidth:'400px', margin:'0 auto'}}>
          {tab==='write' && (
            <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
              <h2 style={{fontWeight:'800', textAlign:'center', margin:'8px 0'}}>Story Thar Ziahna</h2>
              <input placeholder="Thupui / Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={box}/>
              <select value={form.category} onChange={e=>{const c=categories.find(x=>x.name===e.target.value); setSelCat(c); setForm({...form,category:e.target.value, subCategory:''})}} style={box}>
                {categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <select value={form.subCategory} onChange={e=>setForm({...form,subCategory:e.target.value})} style={box}>
                <option value="">Sub Category (Optional)</option>
                {(selCat?.subcategories||[]).map((s,i)=><option key={i} value={s}>{s}</option>)}
              </select>
              <textarea placeholder="Mizo tawng a thawnthu..." value={form.contentMizo} onChange={e=>setForm({...form,contentMizo:e.target.value})} style={{width:'100%', height:'200px', padding:'14px', borderRadius:'14px', border:'1px solid #ddd', fontSize:'14px', boxSizing:'border-box'}}/>
              <textarea placeholder="English original (a awm chuan)" value={form.contentEng} onChange={e=>setForm({...form,contentEng:e.target.value})} style={{width:'100%', height:'100px', padding:'14px', borderRadius:'14px', border:'1px solid #ddd', fontSize:'14px', boxSizing:'border-box'}}/>
              <button onClick={publish} style={{...box, background:'#111', color:'white', fontWeight:'800', fontSize:'14px'}}>Publish to MizoApps</button>
              <button onClick={logout} style={{...box, background:'white', color:'#ff3b30', fontWeight:'700', border:'1px solid #ff3b30', marginTop:'10px'}}>Logout</button>
            </div>
          )}

          {tab==='manage' && (
            <div>
              <h2 style={{fontWeight:'800', textAlign:'center', margin:'8px 0'}}>Category Manage</h2>
              <p style={{textAlign:'center', fontSize:'11px', color:'#888', marginBottom:'14px'}}>Hetah i siam ang zel in Write Story option ah auto in a lang ang</p>
              <div style={{display:'flex',gap:'6px',marginBottom:'16px'}}>
                <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="Category thar - Pathian thu" style={{flex:1, padding:'12px', borderRadius:'12px', border:'1px solid #ddd', background:'white'}}/>
                <button onClick={addCategory} style={{background:'#111', color:'white', border:'none', padding:'0 20px', borderRadius:'12px', fontWeight:'800'}}>Add</button>
              </div>
              {categories.map(c=><div key={c.id} style={{background:'white',padding:'14px',borderRadius:'14px',marginBottom:'10px',border:'1px solid #eee'}}>
                {editId===c.id? (
                  <div style={{display:'flex',gap:'6px'}}><input value={editName} onChange={e=>setEditName(e.target.value)} style={{flex:1, padding:'10px', borderRadius:'10px', border:'1px solid #ddd'}}/><button onClick={saveEdit} style={{background:'#2dc653',color:'white',border:'none',padding:'0 14px',borderRadius:'10px',fontWeight:'700'}}>Save</button><button onClick={()=>setEditId(null)} style={{background:'#eee',border:'none',padding:'0 12px',borderRadius:'10px'}}>X</button></div>
                ) : (
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}><b style={{fontSize:'14px'}}>{c.name} <span style={{fontWeight:'400', fontSize:'11px', color:'#888'}}>({c.subcategories?.length||0} sub)</span></b><div style={{display:'flex',gap:'6px'}}><button onClick={()=>startEdit(c)} style={{background:'#e8f0fe',color:'#111',border:'none',padding:'6px 12px',borderRadius:'8px',fontSize:'11px',fontWeight:'700'}}>Edit</button><button onClick={()=>delCat(c.id)} style={{background:'#fee',color:'red',border:'none',padding:'6px 12px',borderRadius:'8px',fontSize:'11px',fontWeight:'700'}}>Delete</button></div></div>
                )}
                <div style={{display:'flex',gap:'6px',marginTop:'10px'}}><input value={subInputs[c.id]||''} onChange={e=>setSubInputs({...subInputs,[c.id]:e.target.value})} placeholder={`${c.name} ah Sub add`} style={{flex:1, padding:'9px 10px', borderRadius:'10px', border:'1px solid #ddd', fontSize:'12px'}}/><button onClick={()=>addSub(c.id)} style={{background:'#ff6b00',color:'white',border:'none',padding:'0 14px',borderRadius:'10px',fontWeight:'700', fontSize:'12px'}}>Add Sub</button></div>
                <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginTop:'10px'}}>{(c.subcategories||[]).map((s,i)=><span key={i} style={{background:'#f2f2f7',padding:'6px 12px',borderRadius:'20px',fontSize:'11px', display:'flex', alignItems:'center', gap:'6px'}}>{s} <span onClick={()=>delSub(c.id,s)} style={{color:'white',cursor:'pointer',fontWeight:'800', background:'#ff3b30', width:'18px', height:'18px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>x</span></span>)}</div>
              </div>)}
              <button onClick={logout} style={{...box, background:'white', color:'#ff3b30', fontWeight:'700', border:'1px solid #ff3b30', marginTop:'20px'}}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
            }

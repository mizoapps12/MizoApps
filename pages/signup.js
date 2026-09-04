import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import Link from 'next/link';
export default function Signup(){
  const [form,setForm]=useState({name:'',village:'',dob:'',email:'',pass:'',cpass:''}); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  const signup = async ()=>{
    setError('');
    if(!form.name.trim()) return setError('Hming dah rawh!'); if(!form.village.trim()) return setError('Khua / Village dah rawh!'); if(!form.dob) return setError('DoB dah rawh!');
    if(!form.email) return setError('Email dah rawh!'); if(!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Email format dik lo!');
    if(form.pass.length<6) return setError('Password 6 aia tam ni rawh se!'); if(form.pass!==form.cpass) return setError('Password in ang lo!');
    setLoading(true);
    try{
      const res = await createUserWithEmailAndPassword(auth, form.email, form.pass);
      await updateProfile(res.user, {displayName: form.name});
      await sendEmailVerification(res.user);
      await setDoc(doc(db,"users",res.user.uid),{name:form.name,village:form.village,dob:form.dob,email:form.email,uid:res.user.uid,createdAt:new Date(),friends:[],friendRequests:[],online:true});
      alert('Email ah Verification Link ka thawn e! Verify la, Login rawh!'); window.location.href='/';
    }catch(e){ if(e.code==='auth/email-already-in-use') setError('He Email hi an hmang tawh!'); else setError(e.message); setLoading(false); }
  }
  return(
    <div style={{background:'#e9eaed',minHeight:'100vh',padding:20}}><div style={{background:'white',maxWidth:400,margin:'auto',padding:20,border:'1px solid #ddd'}}>
      <h2 style={{color:'#3b5998'}}>Sign Up - MizoApps</h2>
      {error && <div style={{background:'#ffebe8',border:'1px solid #dd3c10',padding:8,marginBottom:10,fontSize:13}}>{error}</div>}
      <input placeholder="Hming (Name)" onChange={e=>setForm({...form,name:e.target.value})} className="input-old"/>
      <input placeholder="Khua (Village) - ex: Tura" onChange={e=>setForm({...form,village:e.target.value})} className="input-old"/>
      <label style={{fontSize:12}}>DoB</label><input type="date" onChange={e=>setForm({...form,dob:e.target.value})} className="input-old"/>
      <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})} className="input-old"/>
      <input type="password" placeholder="Password (6+)" onChange={e=>setForm({...form,pass:e.target.value})} className="input-old"/>
      <input type="password" placeholder="Confirm Password" onChange={e=>setForm({...form,cpass:e.target.value})} className="input-old"/>
      <button onClick={signup} disabled={loading} style={{width:'100%',background:'#69a74e',color:'white',padding:10,border:'none',fontWeight:'bold'}}>{loading?'Siam mek...':'Sign Up'}</button>
      <div style={{textAlign:'center',marginTop:15,fontSize:13}}><Link href="/">Login ah kir leh</Link></div>
    </div></div>
  )
        }

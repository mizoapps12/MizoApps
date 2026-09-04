import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase';
export default function Forgot(){
  const [email,setEmail]=useState(''); const [msg,setMsg]=useState(''); const [err,setErr]=useState('');
  const send = async()=>{ if(!email) return setErr('Email dah rawh!'); try{ await sendPasswordResetEmail(auth,email); setMsg('Reset link ka thawn e!'); }catch(e){ setErr(e.message); } }
  return(<div style={{background:'#e9eaed',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}><div style={{background:'white',padding:20,width:350,border:'1px solid #ddd'}}><h3>Forgot Password</h3>{err&&<div style={{background:'#ffebe8',padding:8,marginBottom:10}}>{err}</div>}{msg&&<div style={{background:'#e7f3ff',padding:8,marginBottom:10}}>{msg}</div>}<input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="input-old"/><button onClick={send} className="blue-btn" style={{width:'100%'}}>Reset Link Thawn</button></div></div>)
}

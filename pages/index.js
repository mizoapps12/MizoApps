import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Link from 'next/link';
export default function Login(){
  const [email,setEmail]=useState(''); const [pass,setPass]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  const login = async () => {
    setError('');
    if(!email) return setError('Email dah rawh!');
    if(!/^\S+@\S+\.\S+$/.test(email)) return setError('Email format dik lo! example@mizo.com ang ni rawh se');
    if(!pass) return setError('Password dah rawh!');
    if(pass.length<6) return setError('Password tawi lutuk! 6 aia tam ni rawh se');
    setLoading(true);
    try{
      const cred = await signInWithEmailAndPassword(auth,email,pass);
      if(!cred.user.emailVerified){ setError('Email verify hmasa rawh! I Email ah Link ka thawn tawh kha!'); setLoading(false); return; }
      window.location.href='/home';
    }catch(e){
      if(e.code==='auth/user-not-found') setError('He Email hi a awm lo!');
      else if(e.code==='auth/wrong-password') setError('Password dik lo!');
      else if(e.code==='auth/invalid-credential') setError('Email emaw Password dik lo!');
      else setError(e.message);
      setLoading(false);
    }
  }
  return(
    <div style={{background:'#3b5998',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',padding:10}}>
      <div style={{background:'white',padding:25,width:360,border:'1px solid #ddd'}}>
        <h1 style={{color:'#3b5998',textAlign:'center',margin:'0 0 15px 0'}}>MizoApps</h1>
        <div style={{fontSize:13,color:'#666',textAlign:'center',marginBottom:15}}>Old Facebook ang - Mizo tan bik - A chak ber</div>
        {error && <div style={{background:'#ffebe8',border:'1px solid #dd3c10',padding:8,marginBottom:10,fontSize:13}}>{error}</div>}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="input-old" />
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" className="input-old" />
        <button onClick={login} disabled={loading} style={{width:'100%',background:'#3b5998',color:'white',padding:10,border:'none',fontWeight:'bold',cursor:'pointer'}}>{loading?'Lut mek...':'Log In'}</button>
        <div style={{textAlign:'center',marginTop:10,fontSize:13}}>
          <Link href="/forgot" style={{color:'#3b5998'}}>Forgot Password?</Link><hr style={{margin:'15px 0'}}/>
          <Link href="/signup"><button style={{background:'#69a74e',color:'white',padding:10,border:'none',fontWeight:'bold',cursor:'pointer'}}>Create New Account</button></Link>
        </div>
        <div style={{textAlign:'center',marginTop:20,fontSize:11,color:'#666'}}><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms and Condition</Link></div>
      </div>
    </div>
  )
}

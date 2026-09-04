import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Search(){
  const router = useRouter();
  const k = router.query.k?.toLowerCase() || '';
  const [users,setUsers]=useState([]);
  const [posts,setPosts]=useState([]);
  const [groups,setGroups]=useState([]);
  const [f,setF]=useState('');

  useEffect(()=>{
    const load = async()=>{
      const u = await getDocs(collection(db,"users"));
      const p = await getDocs(collection(db,"posts"));
      const g = await getDocs(collection(db,"groups"));
      setUsers(u.docs.map(d=>d.data()));
      setPosts(p.docs.map(d=>({id:d.id,...d.data()})));
      setGroups(g.docs.map(d=>({id:d.id,...d.data()})));
    };
    load();
  },[]);

  const doSearch = (e)=>{
    if(e.key==='Enter' && f.trim()){
      router.push(`/search?k=${encodeURIComponent(f.trim())}`);
    }
  };

  const fu = users.filter(x=> (x.name?.toLowerCase().includes(k) || x.village?.toLowerCase().includes(k) || x.email?.toLowerCase().includes(k)));
  const fp = posts.filter(x=> x.text?.toLowerCase().includes(k) || x.name?.toLowerCase().includes(k));
  const fg = groups.filter(x=> x.name?.toLowerCase().includes(k));

  return(
    <div style={{background:'#e9eaed',minHeight:'100vh',paddingTop:78}}>
      <Header/>
      <div style={{maxWidth:600,margin:'auto',padding:10}}>
        <div className="old-box" style={{padding:10,display:'flex',gap:8}}>
          <input value={f} defaultValue={k} onChange={e=>setF(e.target.value)} onKeyDown={doSearch} placeholder="User, Post, Group zawng rawh..." style={{flex:1,padding:8,border:'1px solid #bdc7d8'}}/>
          <button onClick={()=> f.trim() && router.push(`/search?k=${encodeURIComponent(f.trim())}`)} style={{background:'#3b5998',color:'white',border:'none',padding:'0 15px',fontWeight:'bold'}}>Search</button>
        </div>

        {!k && <div style={{marginTop:20,textAlign:'center',color:'#666'}}>Engkim zawng theihna - User, Post, Group</div>}

        {k && <>
          <h3 style={{color:'#3b5998',margin:'15px 0 8px'}}>Users ({fu.length})</h3>
          {fu.map((u,i)=><div key={i} className="old-box" style={{padding:8,marginBottom:6}}><b>{u.name}</b> - {u.village} - {u.email}</div>)}
          
          <h3 style={{color:'#3b5998',margin:'15px 0 8px'}}>Posts ({fp.length})</h3>
          {fp.map(p=><div key={p.id} className="old-box" style={{padding:8,marginBottom:6}}><b>{p.name}</b>: {p.text}</div>)}

          <h3 style={{color:'#3b5998',margin:'15px 0 8px'}}>Groups ({fg.length})</h3>
          {fg.map(g=><div key={g.id} className="old-box" style={{padding:8,marginBottom:6}}><b>{g.name}</b> - Member: {g.members?.length||0}</div>)}
          
          {fu.length===0 && fp.length===0 && fg.length===0 && <div style={{marginTop:10,color:'#666'}}>Engmah hmuh loh - "{k}"</div>}
        </>}
      </div>
    </div>
  )
            }

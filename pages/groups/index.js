import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import Header from '../components/Header';
import Link from 'next/link';

export default function Groups(){
  const [groups,setGroups]=useState([]);
  const [search,setSearch]=useState('');
  const [showCreate,setShowCreate]=useState(false);
  const [name,setName]=useState('');
  const [type,setType]=useState('Closed Group');

  useEffect(()=>{
    const q = query(collection(db,"groups"), orderBy("created","desc"));
    const un = onSnapshot(q, snap=>{
      setGroups(snap.docs.map(d=>({id:d.id,...d.data()})));
    });
    return ()=>un();
  },[]);

  const createGroup = async()=>{
    if(!name.trim()){ alert('Group name dah rawh'); return; }
    const u = auth.currentUser;
    if(!u){ alert('Login la'); return; }
    try{
      await addDoc(collection(db,"groups"),{
        name: name.trim(),
        type: type,
        members: [u.uid],
        membersCount: 1,
        icon: '📚',
        created: serverTimestamp(),
        owner: u.uid,
        ownerName: u.displayName || u.email?.split('@')[0] || 'User'
      });
      setName(''); setShowCreate(false);
    }catch(e){ alert(e.message); }
  };

  const filtered = groups.filter(g=> g.name.toLowerCase().includes(search.toLowerCase()));
  const icons = ['🎓','⛺','🧁','📷','🐾','🧳','⚽','🎵','💼','🎸'];
  const getIcon = (g,i)=> icons[i % icons.length];

  return(
    <div style={{background:'#e9eaed',minHeight:'100vh',paddingTop:108}}>
      <Header/>
      <div style={{maxWidth:600,margin:'0 auto',background:'white',minHeight:'100vh',borderLeft:'1px solid #ccc',borderRight:'1px solid #ccc'}}>

        {/* BLUE HEADER - 2012 */}
        <div style={{background:'#3b5998',color:'white',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px'}}>
          <Link href="/" style={{color:'white',textDecoration:'none',fontSize:14}}>◀ More</Link>
          <div style={{fontSize:20,fontWeight:'bold',letterSpacing:0.5}}>Groups</div>
          <button onClick={()=>setShowCreate(true)} style={{background:'#4a6bb5',border:'1px solid #2a4a8a',color:'white',width:32,height:32,borderRadius:5,fontSize:22,fontWeight:'bold',lineHeight:'20px',cursor:'pointer'}}>+</button>
        </div>

        {/* SEARCH - rounded like 2012 iPhone */}
        <div style={{padding:10,background:'#f6f7f8',borderBottom:'1px solid #ddd'}}>
          <div style={{display:'flex',alignItems:'center',background:'white',border:'1px solid #bdc7d8',borderRadius:15,padding:'6px 12px'}}>
            <span style={{fontSize:14,marginRight:6}}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search groups" style={{flex:1,border:'none',outline:'none',fontSize:13}}/>
          </div>
        </div>

        <div style={{background:'#f0f0f0',padding:'7px 12px',fontSize:11,color:'#666',fontWeight:'bold',borderBottom:'1px solid #ddd'}}>YOUR GROUPS</div>

        {filtered.map((g,i)=>(
          <Link key={g.id} href={`/groups/${g.id}`} style={{textDecoration:'none',color:'inherit'}}>
            <div style={{display:'flex',alignItems:'center',padding:'9px 12px',borderBottom:'1px solid #e5e5e5'}}>
              <div style={{width:44,height:44,background:'#edeef2',borderRadius:5,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,marginRight:10,border:'1px solid #ddd'}}>
                {getIcon(g,i)}
              </div>
              <div style={{flex:1,overflow:'hidden'}}>
                <div style={{fontSize:14,fontWeight:'bold',color:'black',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{g.name}</div>
                <div style={{fontSize:11,color:'#666'}}>{g.type} • {g.membersCount || g.members?.length || 1} members</div>
              </div>
              <div style={{color:'#bbb',fontSize:16}}>›</div>
            </div>
          </Link>
        ))}

        {filtered.length===0 && (
          <div style={{padding:40,textAlign:'center'}}>
            <div style={{fontSize:40}}>👥</div>
            <div style={{color:'#888',fontSize:13,marginTop:6}}>Group a awm lo</div>
            <div style={{color:'#888',fontSize:11}}>Create New Group hmet rawh</div>
          </div>
        )}

        <div style={{padding:'14px 12px',borderTop:'1px solid #e5e5e5',background:'#f6f7f8'}}>
          <button onClick={()=>setShowCreate(true)} style={{background:'none',border:'none',color:'#3b5998',fontSize:14,fontWeight:'bold',cursor:'pointer'}}>+ Create New Group</button>
        </div>

        {/* OLD FB CREATE GROUP POPUP - 2010 Style */}
        {showCreate && (
          <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.6)',zIndex:9999,display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:50}}>
            <div style={{background:'white',width:'92%',maxWidth:360,border:'1px solid #333',boxShadow:'0 0 10px rgba(0,0,0,0.7)'}}>
              <div style={{background:'#6d84b4',color:'white',padding:'7px 10px',fontWeight:'bold',fontSize:13,display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #3b5998'}}>
                <span>Create New Group</span>
                <span onClick={()=>setShowCreate(false)} style={{cursor:'pointer',background:'#3b5998',border:'1px solid #2d3f63',padding:'1px 7px',fontSize:12}}>X</span>
              </div>
              <div style={{padding:14,background:'white'}}>
                <div style={{fontSize:12,fontWeight:'bold',marginBottom:4}}>Group Name:</div>
                <input value={name} onChange={e=>setName(e.target.value)} style={{width:'100%',border:'1px solid #888',padding:'6px 8px',fontSize:13,boxSizing:'border-box'}} placeholder="e.g. Mizo Students"/>

                <div style={{fontSize:12,fontWeight:'bold',margin:'12px 0 6px'}}>Privacy:</div>
                <div style={{border:'1px solid #ccc',background:'#f9f9f9',padding:8}}>
                  <label style={{display:'flex',gap:6,fontSize:12,marginBottom:6,cursor:'pointer'}}>
                    <input type="radio" checked={type==='Closed Group'} onChange={()=>setType('Closed Group')}/>
                    <span><b>Closed Group</b><br/><span style={{color:'#666',fontSize:11}}>Anyone can see group and members. Only members post.</span></span>
                  </label>
                  <label style={{display:'flex',gap:6,fontSize:12,marginBottom:6,cursor:'pointer'}}>
                    <input type="radio" checked={type==='Public Group'} onChange={()=>setType('Public Group')}/>
                    <span><b>Public Group</b><br/><span style={{color:'#666',fontSize:11}}>Anyone can see, join and post.</span></span>
                  </label>
                  <label style={{display:'flex',gap:6,fontSize:12,cursor:'pointer'}}>
                    <input type="radio" checked={type==='Secret Group'} onChange={()=>setType('Secret Group')}/>
                    <span><b>Secret Group</b><br/><span style={{color:'#666',fontSize:11}}>Only members can see group.</span></span>
                  </label>
                </div>

                <div style={{marginTop:12,background:'#f2f2f2',borderTop:'1px solid #ccc',marginLeft:-14,marginRight:-14,marginBottom:-14,padding:'8px 10px',display:'flex',justifyContent:'flex-end',gap:8}}>
                  <button onClick={()=>setShowCreate(false)} style={{border:'1px solid #999',background:'#e4e4e4',padding:'5px 14px',fontSize:12,cursor:'pointer'}}>Cancel</button>
                  <button onClick={createGroup} style={{border:'1px solid #29447e',background:'#5b74a8',color:'white',padding:'5px 16px',fontWeight:'bold',fontSize:12,cursor:'pointer'}}>Create</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
        }

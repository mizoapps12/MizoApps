import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import Header from '@/components/Header';
import Link from 'next/link';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('my'); // my | all | create
  const [newGroupName, setNewGroupName] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'groups'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const myGroups = groups.filter(g => g.members?.includes(auth.currentUser?.uid));
  const filteredGroups = (tab === 'my' ? myGroups : groups).filter(g => 
    g.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    if(!newGroupName.trim()) return alert("Group hming dah rawh");
    await addDoc(collection(db, 'groups'), {
      name: newGroupName,
      description: desc,
      createdBy: auth.currentUser.uid,
      members: [auth.currentUser.uid],
      createdAt: serverTimestamp()
    });
    setNewGroupName(''); setDesc('');
    setTab('my');
    alert("Group siam a ni ta!");
  };

  return (
    <div style={{background:'#e9eaed', minHeight:'100vh'}}>
      <Header />
      
      {/* Top Tabs - Lian */}
      <div style={{background:'#3b5998', padding:'10px', display:'flex', gap:'5px'}}>
        <button onClick={()=>setTab('my')} style={{flex:1, padding:'12px', background: tab==='my' ? '#fff' : '#4c70ba', color: tab==='my' ? '#3b5998' : 'white', border:'none', fontWeight:'bold', fontSize:'18px', borderRadius:'3px'}}>My Groups</button>
        <button onClick={()=>setTab('all')} style={{flex:1, padding:'12px', background: tab==='all' ? '#fff' : '#4c70ba', color: tab==='all' ? '#3b5998' : 'white', border:'none', fontWeight:'bold', fontSize:'18px', borderRadius:'3px'}}>Group List</button>
        <button onClick={()=>setTab('create')} style={{flex:1, padding:'12px', background: tab==='create' ? '#fff' : '#4c70ba', color: tab==='create' ? '#3b5998' : 'white', border:'none', fontWeight:'bold', fontSize:'18px', borderRadius:'3px'}}>Create Group</button>
      </div>

      {/* Content */}
      <div style={{maxWidth:'600px', margin:'0 auto', background:'white'}}>
        
        {tab !== 'create' && (
          <div style={{padding:'10px', background:'#f6f7f8', borderBottom:'1px solid #ddd'}}>
            <input 
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Search groups"
              style={{width:'100%', padding:'12px', fontSize:'18px', border:'1px solid #bdc7d8', borderRadius:'20px'}}
            />
          </div>
        )}

        {tab === 'my' && (
          <div>
            <div style={{padding:'10px', background:'#f6f7f8', fontWeight:'bold', color:'#4e5665', fontSize:'18px', borderBottom:'1px solid #ddd'}}>YOUR GROUPS</div>
            {filteredGroups.length === 0 ? <p style={{padding:'20px', fontSize:'18px'}}>Group i la nei lo.</p> :
              filteredGroups.map(g => (
                <Link key={g.id} href={`/groups/${g.id}`} style={{textDecoration:'none', color:'black'}}>
                  <div style={{display:'flex', padding:'15px', borderBottom:'1px solid #e9eaed', alignItems:'center'}}>
                    <div style={{width:'60px', height:'60px', background:'#e9eaed', border:'1px solid #ccc', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'30px', marginRight:'12px'}}>🎓</div>
                    <div>
                      <div style={{fontWeight:'bold', fontSize:'20px', color:'#3b5998'}}>{g.name}</div>
                      <div style={{fontSize:'16px', color:'#7f7f7f'}}>Closed Group • {g.members?.length || 1} members</div>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        )}

        {tab === 'all' && (
          <div>
            <div style={{padding:'10px', background:'#f6f7f8', fontWeight:'bold', color:'#4e5665', fontSize:'18px', borderBottom:'1px solid #ddd'}}>ALL GROUPS</div>
            {filteredGroups.map(g => (
              <Link key={g.id} href={`/groups/${g.id}`} style={{textDecoration:'none', color:'black'}}>
                <div style={{display:'flex', padding:'15px', borderBottom:'1px solid #e9eaed', alignItems:'center'}}>
                  <div style={{width:'60px', height:'60px', background:'#e9eaed', border:'1px solid #ccc', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'30px', marginRight:'12px'}}>👥</div>
                  <div>
                    <div style={{fontWeight:'bold', fontSize:'20px', color:'#3b5998'}}>{g.name}</div>
                    <div style={{fontSize:'16px', color:'#555'}}>{g.description || 'No description'}</div>
                    <div style={{fontSize:'16px', color:'#7f7f7f'}}>{g.members?.length || 1} members</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab === 'create' && (
          <div style={{padding:'20px'}}>
            <h2 style={{fontSize:'24px', fontWeight:'bold', color:'#333', marginBottom:'15px'}}>Create New Group</h2>
            <form onSubmit={handleCreate}>
              <label style={{fontSize:'18px', fontWeight:'bold'}}>Group Name</label>
              <input value={newGroupName} onChange={e=>setNewGroupName(e.target.value)} style={{width:'100%', padding:'14px', fontSize:'19px', margin:'8px 0 15px 0', border:'1px solid #bdc7d8'}} placeholder="Group hming" />
              
              <label style={{fontSize:'18px', fontWeight:'bold'}}>Description</label>
              <textarea value={desc} onChange={e=>setDesc(e.target.value)} style={{width:'100%', padding:'14px', fontSize:'19px', margin:'8px 0 15px 0, border:'1px solid #bdc7d8', height:'100px'}} placeholder="Group chungchang..." />
              
              <button type="submit" style={{width:'100%', padding:'14px', background:'#3b5998', color:'white', fontSize:'20px', fontWeight:'bold', border:'none'}}>Create Group</button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
          }

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import Header from '../../components/Header';

export default function GroupDetail(){
  const router = useRouter();
  const { id } = router.query;
  const [group,setGroup]=useState(null);
  const [posts,setPosts]=useState([]);
  const [text,setText]=useState('');
  const [members,setMembers]=useState([]);
  const [joined,setJoined]=useState(false);

  useEffect(()=>{
    if(!id) return;
    const unG = onSnapshot(doc(db,"groups",id), async snap=>{
      if(snap.exists()){
        const data = {id:snap.id,...snap.data()};
        setGroup(data);
        setJoined(data.members?.includes(auth.currentUser?.uid));
        // members details
        if(data.members?.length){
          const list = await Promise.all(data.members.slice(0,10).map(async uid=>{
            const ud = await getDoc(doc(db,"users",uid));
            return ud.exists()? {id:ud.id,...ud.data()} : {name:'User'};
          }));
          setMembers(list);
        }
      }
    });
    const q = query(collection(db,"groupPosts"), where("groupId","==",id));
    const unP = onSnapshot(q, s=> setPosts(s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=> (b.created?.seconds||0)-(a.created?.seconds||0))));
    return ()=>{unG(); unP();};
  },[id]);

  const doPost = async()=>{
    if(!text.trim()) return;
    await addDoc(collection(db,"groupPosts"),{
      groupId:id,
      uid: auth.currentUser.uid,
      name: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
      text:text.trim(),
      created:serverTimestamp()
    });
    setText('');
  };

  const toggleJoin = async()=>{
    const ref = doc(db,"groups",id);
    if(joined){
      await updateDoc(ref,{members: arrayRemove(auth.currentUser.uid), membersCount: (group.membersCount||1)-1});
    }else{
      await updateDoc(ref,{members: arrayUnion(auth.currentUser.uid), membersCount: (group.membersCount||0)+1});
    }
  };

  if(!group) return <div style={{paddingTop:108}}><Header/><div style={{padding:20}}>Loading...</div></div>;

  return(
    <div style={{background:'#e9eaed',minHeight:'100vh',paddingTop:108}}>
      <Header/>
      <div style={{maxWidth:600,margin:'0 auto',background:'white',minHeight:'100vh',borderLeft:'1px solid #ccc',borderRight:'1px solid #ccc'}}>
        {/* HEADER */}
        <div style={{background:'#3b5998',color:'white',display:'flex',alignItems:'center',padding:'10px 12px',gap:12}}>
          <span onClick={()=>router.back()} style={{cursor:'pointer'}}>◀ Back</span>
          <span style={{fontWeight:'bold'}}>{group.name}</span>
        </div>

        {/* COVER ICON */}
        <div style={{background:'#f6f7f8',padding:12,display:'flex',gap:12,borderBottom:'1px solid #ddd'}}>
          <div style={{width:60,height:60,background:'#3b5998',color:'white',fontSize:32,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:4}}>{group.icon||'📚'}</div>
          <div>
            <div style={{fontWeight:'bold',fontSize:16}}>{group.name}</div>
            <div style={{fontSize:12,color:'#666'}}>{group.type} • {group.membersCount||group.members?.length} members</div>
            <button onClick={toggleJoin} style={{marginTop:6,background:joined?'#ddd':'#3b5998',color:joined?'#333':'white',border:'1px solid #999',padding:'3px 10px',fontSize:12,fontWeight:'bold'}}>
              {joined?'✓ Joined':' + Join Group'}
            </button>
          </div>
        </div>

        {/* MEMBERS */}
        <div style={{padding:10,borderBottom:'1px solid #eee'}}>
          <div style={{fontSize:13,fontWeight:'bold',marginBottom:6}}>Members ({members.length})</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {members.map((m,i)=>(
              <div key={i} style={{textAlign:'center'}}>
                <img src={m.photo||'/default.png'} style={{width:40,height:40,background:'#ddd'}} alt=""/>
                <div style={{fontSize:9,width:40,overflow:'hidden',whiteSpace:'nowrap'}}>{m.name?.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* POST BOX - Old FB style */}
        <div style={{padding:8,background:'#f6f7f8',borderBottom:'1px solid #ddd',display:'flex',gap:6}}>
          <input value={text} onChange={e=>setText(e.target.value)} placeholder={`Write something in ${group.name}...`} style={{flex:1,border:'1px solid #bdc7d8',padding:'6px 8px',fontSize:13}}/>
          <button onClick={doPost} style={{background:'#3b5998',color:'white',border:'none',padding:'0 14px',fontWeight:'bold',fontSize:12}}>Post</button>
        </div>

        {/* POSTS */}
        {posts.map(p=>(
          <div key={p.id} style={{padding:10,borderBottom:'1px solid #e5e5e5'}}>
            <div style={{fontWeight:'bold',fontSize:13,color:'#3b5998'}}>{p.name} <span style={{fontSize:11,color:'#888',fontWeight:'normal'}}>{p.created?.toDate? new Date(p.created.toDate()).toLocaleDateString() : 'Just now'}</span></div>
            <div style={{fontSize:13,marginTop:4}}>{p.text}</div>
            <div style={{marginTop:6,fontSize:11,color:'#3b5998'}}>Like • Comment</div>
          </div>
        ))}
        {posts.length===0 && <div style={{padding:20,textAlign:'center',color:'#888',fontSize:13}}>Post la awm lo - First post siam rawh!</div>}
      </div>
    </div>
  )
    }

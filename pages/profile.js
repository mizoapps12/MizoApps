import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase';
import Header from '../components/Header';

export default function Profile(){
  const [user,setUser]=useState(null);
  const [posts,setPosts]=useState([]);
  const [friends,setFriends]=useState([]);
  const [text,setText]=useState('');
  const [up,setUp]=useState(false);
  const [tab,setTab]=useState('Posts');

  useEffect(()=>{
    const u = auth.currentUser;
    if(!u) return;
    getDoc(doc(db,"users",u.uid)).then(async d=>{
      if(d.exists()){
        const data = {id:d.id,...d.data()};
        setUser(data);
        // friends list
        if(data.friends?.length){
          const fList = await Promise.all(data.friends.slice(0,9).map(async fid=>{
            const fd = await getDoc(doc(db,"users",fid));
            return fd.exists()? {id:fd.id,...fd.data()} : null;
          }));
          setFriends(fList.filter(Boolean));
        }
      }
    });
    const q = query(collection(db,"posts"), where("uid","==",u.uid), orderBy("created","desc"));
    const un = onSnapshot(q,s=> setPosts(s.docs.map(x=>({id:x.id,...x.data()}))));
    return ()=>un();
  },[]);

  const doPost = async()=>{
    if(!text.trim()) return;
    await addDoc(collection(db,"posts"),{
      uid: auth.currentUser.uid,
      name: user?.name||'User',
      photo: user?.photo||'',
      text: text.trim(),
      created: serverTimestamp(),
      likes: []
    });
    setText('');
  };

  const changePic = async(e,type)=>{
    const file = e.target.files[0];
    if(!file) return;
    setUp(true);
    try{
      const path = type==='cover'? `cover/${auth.currentUser.uid}` : `profile/${auth.currentUser.uid}`;
      const r = ref(storage,path);
      await uploadBytes(r,file);
      const url = await getDownloadURL(r);
      const field = type==='cover'? {cover:url} : {photo:url};
      await updateDoc(doc(db,"users",auth.currentUser.uid),field);
      setUser({...user,...field});
    }catch(err){ alert(err.message); }
    setUp(false);
  };

  if(!user) return <div style={{paddingTop:108}}><Header/><div style={{padding:20}}>Loading...</div></div>;

  return(
    <div style={{background:'#e9eaed',minHeight:'100vh',paddingTop:108}}>
      <Header/>
      <div style={{maxWidth:600,margin:'0 auto',background:'white',minHeight:'100vh',borderLeft:'1px solid #ccc',borderRight:'1px solid #ccc'}}>
        {/* COVER */}
        <div style={{position:'relative',height:190,background:'#333',overflow:'hidden'}}>
          <img src={user.cover || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'} style={{width:'100%',height:'100%',objectFit:'cover'}} alt="cover"/>
          <label style={{position:'absolute',right:8,top:8,background:'rgba(0,0,0,0.6)',color:'white',fontSize:11,padding:'4px 8px',borderRadius:3,cursor:'pointer'}}>
            {up?'...':'Cover Thlak'}<input type="file" accept="image/*" onChange={e=>changePic(e,'cover')} hidden/>
          </label>
          {/* PROFILE PIC */}
          <div style={{position:'absolute',left:12,bottom:-35,border:'3px solid white',borderRadius:2,background:'white',boxShadow:'0 1px 2px rgba(0,0,0,0.3)'}}>
            <img src={user.photo || '/default.png'} style={{width:90,height:90,objectFit:'cover',display:'block',background:'#ddd'}} alt=""/>
          </div>
        </div>

        {/* NAME & INFO */}
        <div style={{padding:'40px 12px 8px 12px'}}>
          <div style={{fontSize:22,fontWeight:'bold',color:'black'}}>{user.name}</div>
          <div style={{fontSize:12,color:'#666',marginTop:2}}>{user.work || 'Graphic Designer'} • Lives in {user.village || 'Zamuanga'}</div>
          <div style={{fontSize:11,color:'#666',marginTop:2}}>Studied at University</div>
        </div>

        {/* TABS - 2012 STYLE */}
        <div style={{display:'flex',borderTop:'1px solid #ddd',borderBottom:'1px solid #ddd',background:'#f6f7f8',marginTop:4}}>
          <button onClick={()=>setTab('About')} style={{flex:1,padding:'10px 0',border:'none',background:tab==='About'?'white':'transparent',borderRight:'1px solid #ddd',fontWeight:tab==='About'?'bold':'normal',fontSize:13,borderBottom:tab==='About'?'3px solid #3b5998':'none'}}>👤 About</button>
          <button onClick={()=>setTab('Friends')} style={{flex:1,padding:'10px 0',border:'none',background:tab==='Friends'?'white':'transparent',borderRight:'1px solid #ddd',fontWeight:tab==='Friends'?'bold':'normal',fontSize:13,borderBottom:tab==='Friends'?'3px solid #3b5998':'none'}}>👥 Friends<br/><span style={{fontSize:11}}>{user.friends?.length||0}</span></button>
          <button onClick={()=>setTab('Posts')} style={{flex:1,padding:'10px 0',border:'none',background:tab==='Posts'?'white':'transparent',fontWeight:tab==='Posts'?'bold':'normal',fontSize:13,borderBottom:tab==='Posts'?'3px solid #3b5998':'none'}}>💬 Posts</button>
        </div>

        {/* ABOUT TAB */}
        {tab==='About' && (
          <div style={{padding:10}}>
            <div style={{fontWeight:'bold',marginBottom:8}}>About</div>
            <div style={{background:'#f6f7f8',border:'1px solid #ddd',padding:8,fontSize:13,lineHeight:'22px'}}>
              <div>💼 {user.work || 'Graphic Designer'} at Studio</div>
              <div>📍 {user.village || 'Seattle, Washington'}</div>
              <div>🔗 {user.email}</div>
              <div>🎂 {user.dob || '17-02-1995'}</div>
            </div>
            <label style={{display:'block',textAlign:'center',marginTop:10,fontSize:12,color:'#3b5998',cursor:'pointer',fontWeight:'bold'}}>
              Profile Pic Thlak - Click <input type="file" accept="image/*" onChange={e=>changePic(e,'profile')} hidden/>
            </label>
          </div>
        )}

        {/* FRIENDS GRID - 3x3 like 2012 */}
        {tab==='Friends' && (
          <div style={{padding:10}}>
            <div style={{fontWeight:'bold',marginBottom:8}}>Friends · {friends.length}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6}}>
              {friends.map(f=>(
                <div key={f.id} style={{border:'1px solid #ddd',padding:2}}>
                  <img src={f.photo || '/default.png'} style={{width:'100%',height:80,objectFit:'cover',background:'#eee'}} alt=""/>
                  <div style={{fontSize:11,fontWeight:'bold',textAlign:'center',padding:'2px 0',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{f.name}</div>
                </div>
              ))}
              {friends.length===0 && <div style={{gridColumn:'1/4',textAlign:'center',color:'#888',fontSize:13,padding:20}}>Friends la nei lo</div>}
            </div>
          </div>
        )}

        {/* POSTS TAB - 2012 Timeline */}
        {tab==='Posts' && (
          <div>
            <div style={{padding:8,background:'#f6f7f8',borderBottom:'1px solid #ddd',display:'flex',gap:6}}>
              <img src={user.photo || '/default.png'} style={{width:36,height:36,borderRadius:2,background:'#ddd'}} alt=""/>
              <input value={text} onChange={e=>setText(e.target.value)} placeholder="What's on your mind?" style={{flex:1,border:'1px solid #bdc7d8',padding:'0 8px',fontSize:13}}/>
              <button onClick={doPost} style={{background:'#3b5998',color:'white',border:'none',padding:'0 14px',fontWeight:'bold',fontSize:13}}>Post</button>
            </div>

            <div style={{padding:'8px 10px',fontWeight:'bold',fontSize:14}}>Posts · {posts.length}</div>
            {posts.map(p=>(
              <div key={p.id} style={{borderTop:'1px solid #e5e5e5',padding:10}}>
                <div style={{display:'flex',gap:8}}>
                  <img src={user.photo || '/default.png'} style={{width:40,height:40,background:'#ddd'}} alt=""/>
                  <div>
                    <div style={{fontWeight:'bold',fontSize:13}}>{p.name}</div>
                    <div style={{fontSize:11,color:'#666'}}>{p.created?.toDate? new Date(p.created.toDate()).toLocaleDateString() : 'Just now'} • near {user.village || 'Zamuanga'}</div>
                  </div>
                </div>
                <div style={{fontSize:13,marginTop:8}}>{p.text}</div>
                <div style={{marginTop:10,borderTop:'1px solid #eee',paddingTop:6,fontSize:12,color:'#666',display:'flex',gap:12}}>
                  <span>👍 Like</span><span>💬 Comment</span><span>↗️ Share</span><span style={{marginLeft:'auto'}}>{p.likes?.length||0} Likes • 0 Comments</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
                }

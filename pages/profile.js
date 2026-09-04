import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase';
import Header from '../components/Header';

export default function Profile(){
  const [user,setUser]=useState(null);
  const [posts,setPosts]=useState([]);
  const [text,setText]=useState('');
  const [up,setUp]=useState(false);

  useEffect(()=>{
    const u = auth.currentUser;
    if(!u) return;
    getDoc(doc(db,"users",u.uid)).then(d=>{ if(d.exists()) setUser({id:d.id,...d.data()}) });
    const q = query(collection(db,"posts"), where("uid","==",u.uid), orderBy("created","desc"));
    const un = onSnapshot(q,s=> setPosts(s.docs.map(x=>({id:x.id,...x.data()}))));
    return ()=>un();
  },[]);

  const doPost = async()=>{
    if(!text.trim()) return;
    await addDoc(collection(db,"posts"),{
      uid: auth.currentUser.uid,
      name: user?.name||'User',
      text: text.trim(),
      created: serverTimestamp(),
      likes: []
    });
    setText('');
  };

  const changePic = async(e)=>{
    const file = e.target.files[0];
    if(!file) return;
    setUp(true);
    try{
      const r = ref(storage,`profile/${auth.currentUser.uid}`);
      await uploadBytes(r,file);
      const url = await getDownloadURL(r);
      await updateDoc(doc(db,"users",auth.currentUser.uid),{photo:url});
      setUser({...user,photo:url});
    }catch(err){ alert(err.message); }
    setUp(false);
  };

  if(!user) return <div style={{paddingTop:108}}><Header/><div style={{padding:20}}>Loading...</div></div>;

  return(
    <div style={{background:'#e9eaed',minHeight:'100vh',paddingTop:108}}>
      <Header/>
      <div className="profileWrap">
        {/* PROFILE PIC - MOBILE TOP */}
        <div className="picBox">
          <img src={user.photo || '/default.png'} className="pic" alt=""/>
          <label className="picBtn">
            {up?'Uploading...':'Profile Pic Thlak'}
            <input type="file" accept="image/*" onChange={changePic} hidden/>
          </label>
          <div className="name">{user.name}</div>
          <div style={{fontSize:12,textAlign:'center'}}>is online now</div>
        </div>

        {/* INFORMATION - BLUE HEADER */}
        <div className="infoBox">
          <div className="infoHead">Information</div>
          <div className="infoRow"><b>Lives in:</b> {user.village || 'Zamuanga'}</div>
          <div className="infoRow"><b>Email:</b> {user.email}</div>
          <div className="infoRow"><b>DoB:</b> {user.dob || '17-02-1995'}</div>
          <div className="infoRow"><b>Gender:</b> {user.gender || ''}</div>
          <div className="infoRow"><b>Friends:</b> {user.friends?.length || 0}</div>
        </div>

        {/* WHAT'S ON YOUR MIND */}
        <div className="mindBox">
          <div style={{fontWeight:'bold',color:'#3b5998',marginBottom:6}}>What's on your mind?</div>
          <div style={{display:'flex',gap:6}}>
            <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write something..." className="mindInput"/>
            <button onClick={doPost} className="postBtn">Post</button>
          </div>
        </div>

        {/* WALL */}
        <div style={{padding:'8px 8px 2px',fontWeight:'bold'}}>Wall Posts</div>
        {posts.map(p=>(
          <div key={p.id} className="postBox">
            <div style={{fontWeight:'bold',color:'#3b5998',fontSize:13}}>{p.name} <span style={{color:'#999',fontWeight:'normal',fontSize:11}}>· {p.created?.toDate? new Date(p.created.toDate()).toLocaleDateString() : 'Just now'}</span></div>
            <div style={{fontSize:13,marginTop:4}}>{p.text}</div>
            <div style={{marginTop:6,fontSize:11,color:'#3b5998'}}>Like · Comment</div>
          </div>
        ))}
      </div>

      <style jsx>{`
       .profileWrap{max-width:600px;margin:0 auto;padding:6px;}
       .picBox{background:white;border:1px solid #b3b3b3;padding:10px;text-align:center;}
       .pic{width:150px;height:150px;object-fit:cover;background:#ddd;border:1px solid #aaa;margin:0 auto;display:block;}
       .picBtn{display:block;background:#eee;border:1px solid #ccc;margin:6px auto 0;width:150px;font-size:11px;padding:4px;cursor:pointer;color:#3b5998;font-weight:bold;text-align:center;}
       .name{font-size:22px;font-weight:bold;color:#0e1f5b;margin-top:8px;}
       .infoBox{background:white;border:1px solid #b3b3b3;margin-top:8px;}
       .infoHead{background:#3b5998;color:white;padding:6px 8px;font-weight:bold;font-size:14px;}
       .infoRow{padding:7px 8px;border-bottom:1px solid #e5e5e5;font-size:13px;}
       .mindBox{background:white;border:1px solid #b3b3b3;margin-top:8px;padding:8px;}
       .mindInput{flex:1;border:1px solid #bdc7d8;padding:7px;font-size:13px;outline:none;}
       .postBtn{background:#3b5998;color:white;border:1px solid #29447e;padding:0 14px;font-weight:bold;}
       .postBox{background:white;border:1px solid #b3b3b3;margin:6px 0;padding:8px;}
        @media(min-width:600px){
         .pic{width:180px;height:180px;}
        }
      `}</style>
    </div>
  )
          }

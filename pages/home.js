
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function Home() {
  const [user,setUser]=useState(null);
  const [text,setText]=useState('');
  const [posts,setPosts]=useState([]);
  
  useEffect(()=>{
    const un = auth.onAuthStateChanged(u=> setUser(u));
    const q = query(collection(db,"posts"), orderBy("time","desc"));
    const un2 = onSnapshot(q, s=> setPosts(s.docs.map(d=>({id:d.id,...d.data()}))));
    return ()=>{un(); un2();};
  },[]);

  const post = async ()=>{
    if(!text.trim()||!user) return;
    await addDoc(collection(db,"posts"),{
      text:text,
      uid:user.uid,
      name:user.displayName||user.email,
      time:new Date(),
      likes:[]
    });
    setText('');
  };

  const like = async (p)=>{
    if(!user) return;
    const ref = doc(db,"posts",p.id);
    if(p.likes?.includes(user.uid)){
      await updateDoc(ref,{likes:arrayRemove(user.uid)});
    } else {
      await updateDoc(ref,{likes:arrayUnion(user.uid)});
      if(p.uid!==user.uid){
        await addDoc(collection(db,"notifications"),{
          to:p.uid,
          from:user.uid,
          text:`${user.displayName||user.email} in i post a like`,
          read:false,
          time:new Date()
        });
      }
    }
  };

  return(
    <div style={{background:'#e9eaed',minHeight:'100vh',paddingTop:95}}>
      <Header/>
      <div style={{maxWidth:600,margin:'auto',padding:10}}>
        <div className="old-box" style={{padding:10}}>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Eng nge i ngaihtuah? Mizo tawngin..." style={{width:'100%',height:60,border:'1px solid #ddd',padding:8,boxSizing:'border-box'}}></textarea>
          <div style={{textAlign:'right',marginTop:8}}>
            <button onClick={post} className="blue-btn">Post</button>
          </div>
        </div>

        {posts.map(p=>(
          <div key={p.id} className="old-box" style={{padding:10,marginTop:10}}>
            <div style={{fontWeight:'bold',color:'#3b5998'}}>{p.name}</div>
            <div style={{fontSize:13,marginTop:5}}>{p.text}</div>
            <div style={{marginTop:10,borderTop:'1px solid #eee',paddingTop:8,display:'flex',gap:15}}>
              <span onClick={()=>like(p)} style={{cursor:'pointer',color:p.likes?.includes(user?.uid)?'#3b5998':'#666',fontWeight:'bold',fontSize:13}}>
                Like ({p.likes?.length||0})
              </span>
              <span style={{color:'#666',fontSize:13}}>Comment</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
                                                 }

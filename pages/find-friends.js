import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import Header from '../components/Header';

export default function FindFriends(){
  const [users,setUsers]=useState([]);
  const [me,setMe]=useState(null);

  useEffect(()=>{
    setMe(auth.currentUser);
    const load = async()=>{
      const s = await getDocs(collection(db,"users"));
      const all = s.docs.map(d=>({id:d.id,...d.data()})).filter(u=>u.id!==auth.currentUser?.uid);
      setUsers(all);
    };
    load();
  },[]);

  const addFriend = async(uid)=>{
    if(!me) return;
    const ref = doc(db,"users",uid);
    await updateDoc(ref,{friendRequests: arrayUnion(me.uid)});
    alert('Friend request thawn ta!');
  };

  return(
    <div style={{background:'#e9eaed',minHeight:'100vh',paddingTop:110}}>
      <Header/>
      <div style={{maxWidth:600,margin:'auto',padding:10}}>
        <div style={{background:'white',border:'1px solid #ddd',padding:10,fontWeight:'bold',color:'#3b5998',fontSize:16}}>Find Friends - Users zawng zawng</div>
        {users.map(u=>(
          <div key={u.id} style={{background:'white',border:'1px solid #ddd',borderTop:'none',padding:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{fontWeight:'bold',fontSize:15}}>{u.name}</div>
              <div style={{fontSize:13,color:'#666'}}>{u.village} | {u.email}</div>
            </div>
            <button onClick={()=>addFriend(u.id)} style={{background:'#3b5998',color:'white',border:'none',padding:'6px 12px',fontWeight:'bold',fontSize:13}}>Add Friend</button>
          </div>
        ))}
      </div>
    </div>
  )
}

import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '@/firebase';
export default function Notifications(){
  const [notis,setNotis]=useState([]); const [me,setMe]=useState(null);
  useEffect(()=>{ auth.onAuthStateChanged(u=>{ setMe(u); if(u) onSnapshot(query(collection(db,"notifications"), where("to","==",u.uid), orderBy("time","desc")), s=>{ setNotis(s.docs.map(d=>({id:d.id,...d.data()}))); s.docs.forEach(async d=>{ if(!d.data().read) await updateDoc(doc(db,"notifications",d.id),{read:true}); }); }); }); },[]);
  return(
    <div style={{background:'#e9eaed',minHeight:'100vh',paddingTop:50}}><Header/>
      <div style={{maxWidth:600,margin:'auto',padding:10}}>
        <div className="old-box" style={{padding:10}}><b>Notifications</b></div>
        {notis.length===0 && <div className="old-box" style={{padding:20,textAlign:'center',marginTop:10}}>Notification a awm lo</div>}
        {notis.map(n=><div key={n.id} className="old-box" style={{padding:10,marginTop:10,background:!n.read?'#e9f0ff':'white'}}><div style={{fontSize:13}}>{n.text}</div><div style={{fontSize:11,color:'#999'}}>{n.time?.toDate? n.time.toDate().toLocaleString():''}</div></div>)}
      </div>
    </div>
  )
}

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Newsfeed(){
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");

  useEffect(()=>{ fetchPosts() },[]);
  const fetchPosts = async () => {
    const { data } = await supabase.from("posts").select("*").order("created_at", {ascending:false});
    if(data) setPosts(data);
  };

  const addPost = async () => {
    if(!text) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("posts").insert([{ text, user_email: user.email, user_name: user.email }]);
    setText(""); fetchPosts();
  };

  return (
    <div style={{background:"#e9eaed", minHeight:"100vh"}}>
      <div style={{background:"#3b5998", color:"white", padding:"8px 15px", fontWeight:"bold"}}>mizoapps - Newsfeed</div>
      <div style={{maxWidth:"500px", margin:"10px auto", background:"white", padding:"10px", border:"1px solid #bdc7d8"}}>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Enge i ngaihtuah?" style={{width:"100%", border:"1px solid #bdc7d8", padding:"6px"}} />
        <button onClick={addPost} style={{background:"#5b74a8", color:"white", border:"1px solid #2f477a", padding:"5px 10px", marginTop:"5px"}}>Post</button>
      </div>
      {posts.map(p=>(
        <div key={p.id} style={{maxWidth:"500px", margin:"10px auto", background:"white", border:"1px solid #bdc7d8", padding:"10px"}}>
          <b style={{color:"#3b5998", fontSize:"13px"}}>{p.user_name}</b>
          <p style={{fontSize:"13px", marginTop:"5px"}}>{p.text}</p>
        </div>
      ))}
    </div>
  );
}

import { useState } from "react";
import Link from "next/link";

export default function NewsFeed() {
  const [posts, setPosts] = useState([
    { id: 1, hming: "Lalnunmawia Sailo", hun: "2 hours ago", thu: "Khawpui lamah ka chhuak a, Thingtlang boruak hi a thawl nuam hle mai! 🌲", like: 35, comment: 8 },
    { id: 2, hming: "Lalrinpuii Hnamte", hun: "5 hours ago", thu: "Vawiin chu buhchiar kan seng a, kan vengho te nen kan hlim hle! 🌾", like: 29, comment: 4 },
    { id: 3, hming: "Vanlalhriata", hun: "Yesterday", thu: "MizoApps hmangin kan khaw chanchinthar ka rawn share leh e! Pawl Kut programme a awm dawn!", like: 12, comment: 2 },
  ]);
  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = { id: Date.now(), hming: "Nangma (You)", hun: "Just now", thu: newPost, like: 0, comment: 0 };
    setPosts([post,...posts]);
    setNewPost("");
  };

  return (
    <div style={{ background: "#e9eaed", minHeight: "100vh" }}>
      {/* Header */}
      <header className="fb-header">
        <Link href="/newsfeed"><b style={{ cursor: "pointer" }}>☰ MizoApps</b></Link>
        <div style={{ display: "flex", gap: "15px" }}>
          <Link href="/friends">👥</Link>
          <Link href="/messages">💬²</Link>
          <Link href="/notifications">🌍¹</Link>
          <Link href="/settings">⚙️</Link>
        </div>
      </header>

      {/* Post Box */}
      <div className="fb-card">
        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
          <button className="fb-button" style={{ background: "#f6f7f8", color: "#333", flex: 1 }}>📷 Photo</button>
          <button className="fb-button" style={{ background: "#f6f7f8", color: "#333", flex: 1 }}>✏️ Status</button>
          <button className="fb-button" style={{ background: "#f6f7f8", color: "#333", flex: 1 }}>📍 Check In</button>
        </div>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="I ngaihtuahna rawn ziak rawh... (What's on your mind?)"
          style={{ width: "100%", minHeight: "60px", padding: "10px", border: "1px solid #ddd", resize: "none" }}
        />
        <div style={{ textAlign: "right", marginTop: "8px" }}>
          <button onClick={handlePost} className="fb-button">Post</button>
        </div>
      </div>

      {/* Feed */}
      {posts.map((post) => (
        <div key={post.id} className="fb-card">
          <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ width: "40px", height: "40px", background: "#3b5998", borderRadius: "50%", marginRight: "10px" }}></div>
            <div>
              <b style={{ color: "#3b5998" }}>{post.hming}</b><br/>
              <small style={{ color: "gray" }}>{post.hun}</small>
            </div>
          </div>
          <p style={{ margin: "10px 0", lineHeight: "1.4" }}>{post.thu}</p>
          <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: "8px", display: "flex", gap: "20px", fontSize: "13px", color: "#3b5998" }}>
            <span>👍 {post.like} Like</span>
            <span>💬 {post.comment} Comment</span>
            <span>↗️ Share</span>
          </div>
        </div>
      ))}
    </div>
  );
        }

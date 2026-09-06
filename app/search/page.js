'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useSettings } from '../components/SettingsContext'

function timeAgo(timestamp){
  if(!timestamp) return ''
  const now = new Date()
  const time = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const diff = Math.floor((now - time)/1000)
  if(diff < 60) return 'Just now'
  if(diff < 3600) return `${Math.floor(diff/60)}m ago`
  if(diff < 86400) return `${Math.floor(diff/3600)}h ago`
  if(diff < 2592000) return `${Math.floor(diff/86400)}d ago`
  return time.toLocaleDateString()
}

export default function SearchPage(){
  const {dark, fontSize} = useSettings()
  const router = useRouter()
  const [stories,setStories]=useState([])
  const [catMap,setCatMap]=useState({})
  const [qText,setQText]=useState('')

  useEffect(()=>{
    const fetchData=async()=>{
      const q=query(collection(db,'stories'),orderBy('createdAt','desc'))
      const snap=await getDocs(q)
      setStories(snap.docs.map(d=>({id:d.id,...d.data()})))

      // Home ang chiah - ADMIN a category thlak la tur
      const mapSnap = await getDocs(collection(db,'categoryMap'))
      const m = {}
      mapSnap.docs.forEach(d=>{
        const data = d.data()
        m[data.original.trim().toLowerCase()] = data.display
      })
      setCatMap(m)
    }
    fetchData()
  },[])

  const renameCategory = (cat)=>{
    if(!cat) return cat
    return catMap[cat.trim().toLowerCase()] || cat
  }

  const handleStoryClick = (id) => {
    router.push(`/story/${id}`)
  }

  const filtered=stories.filter(s=>{
    const t=(qText||'').toLowerCase().trim()
    if(!t) return true
    return s.title?.toLowerCase().includes(t) || 
           s.contentMizo?.toLowerCase().includes(t) || 
           s.contentEng?.toLowerCase().includes(t) || 
           s.category?.toLowerCase().includes(t) ||
           s.subCategory?.toLowerCase().includes(t)
  })

  return(
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', paddingTop:'62px'}}>
      <div style={{padding:'10px 12px', position:'sticky', top:'54px', zIndex:10, background: dark?'#121212':'#f2f2f7'}}>
        <div style={{width:'92%', maxWidth:'420px', margin:'0 auto'}}>
          <input 
            value={qText}
            onChange={e=>setQText(e.target.value)}
            placeholder="Thawnthu zawng rawh..."
            style={{
              width:'100%',
              height:'44px',
              borderRadius:'12px',
              border: dark?'1px solid #333':'1px solid #ddd',
              background: dark?'#1e1e1e':'white',
              color: dark?'white':'#111',
              padding:'0 14px',
              fontSize:'14px',
              outline:'none',
              boxSizing:'border-box'
            }}
          />
        </div>
      </div>

      <div style={{padding:'8px 12px 20px 12px'}}>
        <div style={{width:'92%', maxWidth:'420px', margin:'0 auto', display:'flex', flexDirection:'column', gap:'12px'}}>
          {filtered.length===0 ? (
            <div style={{textAlign:'center', color: dark?'#888':'#888', marginTop:'30px', fontSize:'13px'}}>
              {qText ? `"${qText}" hmuh loh` : 'Story a la awm lo'}
            </div>
          ) : (
            filtered.map(story=>{
              const preview = story.contentMizo ? story.contentMizo.replace(/^\s*TITLE:\s*.*$/gim, '').trim().substring(0,140) : ''
              const displayCategory = renameCategory(story.category)
              return(
                <div key={story.id} style={{background: dark?'#1e1e1e':'white', borderRadius:'18px', padding:'18px', border: dark?'1px solid #333':'1px solid #eee'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                    <div style={{fontSize:'13.5px', fontWeight:'700', color: dark?'#aaa':'#888', display:'flex', gap:'4px', alignItems:'center'}}>
                      <span onClick={(e)=>{ e.stopPropagation(); router.push(`/category/${encodeURIComponent(displayCategory)}`) }} style={{cursor:'pointer', color:'#16a34a', fontWeight:'800'}}>
                        {displayCategory}
                      </span>
                      {story.subCategory && (
                        <><span>{'>'}</span><span onClick={(e)=>{ e.stopPropagation(); router.push(`/series/${encodeURIComponent(story.subCategory)}`) }} style={{cursor:'pointer', color:'#16a34a', fontWeight:'800'}}>{story.subCategory}</span></>
                      )}
                    </div>
                    <div style={{fontSize:'12.5px', fontWeight:'600', color: dark?'#888':'#888'}}>{timeAgo(story.createdAt)}</div>
                  </div>
                  <div onClick={()=>handleStoryClick(story.id)} style={{fontSize: `${fontSize+2}px`, fontWeight:'800', color: dark?'#ffffff':'#111111', marginBottom:'10px', lineHeight:'1.3', cursor:'pointer'}}>{story.title}</div>
                  <div style={{fontSize: `${fontSize-1}px`, color: dark?'#e5e5e5':'#333333', lineHeight:'1.6'}}>
                    <span style={{display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden'}}>{preview}...</span>
                    <div style={{textAlign:'right', marginTop:'3px'}}>
                      <span onClick={()=>handleStoryClick(story.id)} style={{color:'#16a34a', fontWeight:'800', cursor:'pointer', fontSize:'14px'}}>Read more...</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

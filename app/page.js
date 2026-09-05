'use client'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useSettings } from './components/SettingsContext'

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

export default function HomePage(){
  const {dark, fontSize} = useSettings()
  const router = useRouter()
  const [stories,setStories]=useState([])
  const [catMap,setCatMap]=useState({})
  const [visible,setVisible]=useState(16)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    const load=async()=>{
      const snap = await getDocs(query(collection(db,'stories'), orderBy('createdAt','desc')))
      setStories(snap.docs.map(d=>({id:d.id,...d.data()})))
      
      // ADMIN atanga category hming thlak la tur
      const mapSnap = await getDocs(collection(db,'categoryMap'))
      const m = {}
      mapSnap.docs.forEach(d=>{
        const data = d.data()
        m[data.original.trim().toLowerCase()] = data.display
      })
      setCatMap(m)
      setLoading(false)
    }
    load()
    if('scrollRestoration' in window.history){
      window.history.scrollRestoration = 'manual'
    }
  },[])

  const renameCategory = (cat)=>{
    if(!cat) return cat
    return catMap[cat.trim().toLowerCase()] || cat
  }

  useEffect(()=>{
    if(loading) return
    const savedScroll = sessionStorage.getItem('home-scroll-y')
    const savedVisible = sessionStorage.getItem('home-visible')
    if(savedVisible) setVisible(parseInt(savedVisible))
    if(savedScroll){
      setTimeout(()=>{ window.scrollTo({top: parseInt(savedScroll), behavior: 'instant'}) }, 300)
    }
  },[loading, stories])

  useEffect(()=>{
    const handleScroll = () => { sessionStorage.setItem('home-scroll-y', window.scrollY.toString()) }
    window.addEventListener('scroll', handleScroll, {passive:true})
    return () => window.removeEventListener('scroll', handleScroll)
  },[])

  const handleStoryClick = (id) => {
    sessionStorage.setItem('home-scroll-y', window.scrollY.toString())
    sessionStorage.setItem('home-visible', visible.toString())
    router.push(`/story/${id}`)
  }

  if(loading){
    return <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', paddingTop:'80px', textAlign:'center', color: dark?'white':'#111'}}>Loading...</div>
  }

  return(
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', padding:'12px', paddingTop:'70px'}}>
      <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
        {stories.slice(0, visible).map(story=>{
          const preview = story.contentMizo ? story.contentMizo.replace(/^\s*TITLE:\s*.*$/gim, '').trim().substring(0,140) : ''
          const displayCategory = renameCategory(story.category)
          return(
            <div key={story.id} style={{background: dark?'#1e1e1e':'white', borderRadius:'18px', padding:'18px', border: dark?'1px solid #333':'1px solid #eee'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                <div style={{fontSize:'13.5px', fontWeight:'700', color: dark?'#aaa':'#888', display:'flex', gap:'4px', alignItems:'center'}}>
                  <span onClick={(e)=>{ e.stopPropagation(); sessionStorage.setItem('home-scroll-y', window.scrollY.toString()); sessionStorage.setItem('home-visible', visible.toString()); router.push(`/category/${encodeURIComponent(displayCategory)}`) }} style={{cursor:'pointer', color:'#16a34a', fontWeight:'800'}}>
                    {displayCategory}
                  </span>
                  {story.subCategory && (
                    <><span>{'>'}</span><span onClick={(e)=>{ e.stopPropagation(); sessionStorage.setItem('home-scroll-y', window.scrollY.toString()); sessionStorage.setItem('home-visible', visible.toString()); router.push(`/series/${encodeURIComponent(story.subCategory)}`) }} style={{cursor:'pointer', color:'#16a34a', fontWeight:'800'}}>{story.subCategory}</span></>
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
        })}
      </div>
      {visible < stories.length && (
        <button onClick={()=>{ const newV = visible + 16; setVisible(newV); sessionStorage.setItem('home-visible', newV.toString()) }} style={{width:'100%', marginTop:'16px', padding:'14px', background:'#007AFF', color:'white', border:'none', borderRadius:'14px', fontWeight:'700', fontSize:'15px'}}>
          Load More ({visible} / {stories.length})
        </button>
      )}
    </div>
  )
}

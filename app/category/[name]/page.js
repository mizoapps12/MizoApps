'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useParams, useRouter } from 'next/navigation'
import { useSettings } from '../../components/SettingsContext'

function timeAgo(ts){
  if(!ts) return ''
  const t = ts.toDate? ts.toDate() : new Date(ts)
  const d = Math.floor((new Date() - t)/1000)
  if(d<60) return 'Just now'
  if(d<3600) return `${Math.floor(d/60)}m ago`
  if(d<86400) return `${Math.floor(d/3600)}h ago`
  return `${Math.floor(d/86400)}d ago`
}

export default function CategoryPage(){
  const {name} = useParams()
  const router = useRouter()
  const {dark, fontSize} = useSettings()
  const [subCats,setSubCats]=useState([])
  const [stories,setStories]=useState([])
  const [loading,setLoading]=useState(true)
  const decoded = decodeURIComponent(name)

  useEffect(()=>{
    const load=async()=>{
      const snap = await getDocs(collection(db,'stories'))
      const all = snap.docs.map(d=>({id:d.id,...d.data()}))

      // Admin map la ve - old leh new link ve a support nan
      const mapSnap = await getDocs(collection(db,'categoryMap'))
      const displayMap = {} // funny story -> Fiamthu
      const reverseMap = {} // fiamthu -> funny story
      mapSnap.docs.forEach(doc=>{
        const data = doc.data()
        displayMap[data.original.trim().toLowerCase()] = data.display
        reverseMap[data.display.trim().toLowerCase()] = data.original.trim().toLowerCase()
      })

      const lower = decoded.trim().toLowerCase()
      // decoded hi Fiamthu a nih chuan Funny Story zawng, Funny Story a nih chuan Fiamthu zawng
      const searchOriginal = reverseMap[lower] || lower
      const searchDisplay = displayMap[lower] || lower

      const filtered = all.filter(s=> {
        const catLower = (s.category||'').trim().toLowerCase()
        // Story category hi Funny Story emaw Fiamthu emaw ve ve a nih chuan la
        return catLower === lower || catLower === searchOriginal || catLower === searchDisplay
      })

      const map = {}
      filtered.forEach(s=>{
        const sc = (s.subCategory || s.series || s.sub_category || '').trim()
        if(!sc) return
        map[sc] = (map[sc]||0)+1
      })

      setSubCats(Object.keys(map).map(k=>({name:k, count:map[k]})))
      setStories(filtered)
      setLoading(false)
    }
    load()
  },[decoded])

  if(loading) return <div style={{paddingTop:'90px', textAlign:'center'}}>Loading...</div>

  return(
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', paddingTop:'70px'}}>
      <div onClick={()=>router.back()} style={{padding:'14px', display:'flex', alignItems:'center', gap:'10px', cursor:'pointer'}}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={dark?'white':'black'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        <span style={{fontSize:'20px', fontWeight:'800', color: dark?'white':'black'}}>{decoded}</span>
      </div>

      <div style={{padding:'10px 14px'}}>
        {subCats.length > 0 ? (
          <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'6px'}}>
            {subCats.map(sc=>(
              <div key={sc.name} onClick={()=>router.push(`/series/${encodeURIComponent(sc.name)}`)} style={{background: dark?'#1e1e1e':'white', padding:'18px', borderRadius:'16px', border: dark?'1px solid #333':'1px solid #eee', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontWeight:'700', fontSize:'15px', color: dark?'white':'black'}}>{sc.name}</span>
                <span style={{background:'#16a34a', color:'white', fontSize:'13px', fontWeight:'800', padding:'5px 12px', borderRadius:'20px'}}>({sc.count})</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'12px', marginTop:'6px'}}>
            {stories.length===0 && <div style={{textAlign:'center', padding:'40px', color:'#888'}}>He category ah hian story a awm lo</div>}
            {stories.map(s=>{
              const preview = s.contentMizo? s.contentMizo.replace(/^\s*TITLE:\s*.*$/gim,'').trim().substring(0,140) : ''
              return(
                <div key={s.id} style={{background: dark?'#1e1e1e':'white', borderRadius:'18px', padding:'18px', border: dark?'1px solid #333':'1px solid #eee'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                    <div style={{fontSize:'13.5px', fontWeight:'800', color:'#16a34a'}}>{s.category}</div>
                    <div style={{fontSize:'12.5px', fontWeight:'600', color:'#888'}}>{timeAgo(s.createdAt)}</div>
                  </div>
                  <div onClick={()=>router.push(`/story/${s.id}`)} style={{fontSize:`${fontSize?fontSize+2:18}px`, fontWeight:'800', color: dark?'white':'black', marginBottom:'10px', cursor:'pointer'}}>{s.title}</div>
                  <div style={{fontSize:`${fontSize?fontSize-1:14}px`, color: dark?'#e5e5e5':'#333', lineHeight:'1.6'}}>
                    <span style={{display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden'}}>{preview}...</span>
                    <div style={{textAlign:'right', marginTop:'10px'}}>
                      <span onClick={()=>router.push(`/story/${s.id}`)} style={{color:'#16a34a', fontWeight:'800', cursor:'pointer'}}>Read more...</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useSettings } from '../components/SettingsContext'

export default function CategoryPage(){
  const {dark} = useSettings()
  const router = useRouter()
  const [cats, setCats] = useState([])
  const [stories, setStories] = useState([])
  const [openCat, setOpenCat] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const load = async()=>{
      const catSnap = await getDocs(collection(db,'categories'))
      const storySnap = await getDocs(collection(db,'stories'))
      const mapSnap = await getDocs(collection(db,'categoryMap'))

      const allStories = storySnap.docs.map(d=>({id:d.id,...d.data()}))
      setStories(allStories)

      // Map siam - Love Story -> Hmangaihna, Funny Story -> Fiamthu
      const nameMap = {}
      mapSnap.docs.forEach(doc=>{
        const data = doc.data()
        if(data.original && data.display){
          nameMap[data.original.trim().toLowerCase()] = data.display
        }
      })
      const fixedMap = {
        'love story': 'Hmangaihna',
        'funny story': 'Fiamthu',
       ...nameMap
      }

      // Category count dik tak
      const countMap = {}
      allStories.forEach(s=>{
        if(!s.category) return
        let low = s.category.trim().toLowerCase()
        let display = fixedMap[low] || s.category
        countMap[display.toLowerCase()] = (countMap[display.toLowerCase()] || 0) + 1
      })

      let catList = catSnap.docs.map(d=>{
        const data = d.data()
        let origName = data.name
        let displayName = fixedMap[origName.trim().toLowerCase()] || origName
        let low = displayName.toLowerCase()
        return {
          id: d.id,
          name: displayName,
          count: countMap[low] || 0
        }
      })

      // Merge duplicate - Hmangaihna a hran a awm lo nan
      const merged = {}
      catList.forEach(c=>{
        let low = c.name.toLowerCase()
        if(!merged[low]) merged[low] = {...c}
        else merged[low].count += c.count
      })

      setCats(Object.values(merged).sort((a,b)=>a.name.localeCompare(b.name)))
      setLoading(false)
    }
    load()
  },[])

  const getStoriesForCat = (catName)=>{
    return stories.filter(s=>{
      if(!s.category) return false
      let low = s.category.trim().toLowerCase()
      let catLow = catName.toLowerCase()
      // Love Story leh Hmangaihna pahnih kha Hmangaihna ah ngai vek
      if(catLow === 'hmangaihna' && (low === 'love story' || low === 'hmangaihna')) return true
      if(catLow === 'fiamthu' && (low === 'funny story' || low === 'fiamthu')) return true
      return low === catLow
    })
  }

  if(loading) return <div style={{paddingTop:'90px', textAlign:'center'}}>Loading...</div>

  return(
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', paddingTop:'70px'}}>
      <div style={{padding:'20px 16px 10px 16px'}}>
        <h2 style={{fontWeight:'900', fontSize:'24px', display:'flex', gap:'8px', alignItems:'center', color: dark?'white':'black'}}>
          <span>📚</span> Categories - AUTO
        </h2>
        <p style={{fontSize:'13px', color:'#888', marginTop:'4px'}}>Admin ah i siam apiang hetah a lang nghal ang</p>
      </div>

      <div style={{padding:'0 12px 20px 12px', display:'flex', flexDirection:'column', gap:'12px'}}>
        {cats.map(c=>{
          const isOpen = openCat === c.name
          const catStories = getStoriesForCat(c.name)
          return(
            <div key={c.name} style={{background: dark?'#1e1e1e':'white', borderRadius:'18px', border: dark?'1px solid #333':'1px solid #eee', overflow:'hidden'}}>
              <div onClick={()=>setOpenCat(isOpen? null : c.name)} style={{padding:'16px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer'}}>
                <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                  <div style={{width:'48px', height:'48px', background:'#f2f2f7', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px'}}>📚</div>
                  <div>
                    <div style={{fontWeight:'800', fontSize:'16px', color: dark?'white':'black'}}>{c.name}</div>
                    <div style={{fontSize:'12px', color:'#888'}}>{c.count} stories</div>
                  </div>
                </div>
                <div style={{width:'32px', height:'32px', background:'#f2f2f7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>{isOpen?'⌄':'>'}</div>
              </div>

              {isOpen && (
                <div style={{padding:'0 12px 12px 12px', display:'flex', flexDirection:'column', gap:'8px'}}>
                  {catStories.length===0 && <div style={{padding:'10px', color:'#888', fontSize:'13px'}}>Story a la awm lo</div>}
                  {catStories.map(s=>(
                    <div key={s.id} onClick={()=>router.push(`/story/${s.id}`)} style={{background: dark?'#252525':'#f9f9f9', padding:'14px', borderRadius:'12px', cursor:'pointer', border: dark?'1px solid #333':'1px solid #eee'}}>
                      <div style={{fontWeight:'700', fontSize:'14px', color: dark?'white':'black'}}>{s.title}</div>
                      <div style={{fontSize:'11px', color:'#888', marginTop:'2px'}}>{s.category}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
                }

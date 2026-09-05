'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useSettings } from '../components/SettingsContext'

export default function CategoriesAutoPage(){
  const {dark} = useSettings()
  const router = useRouter()
  const [cats, setCats] = useState([])
  const [stories, setStories] = useState([])
  const [openCat, setOpenCat] = useState('Funny Story')
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const load = async()=>{
      const catSnap = await getDocs(collection(db,'categories'))
      const storySnap = await getDocs(collection(db,'stories'))
      const mapSnap = await getDocs(collection(db,'categoryMap'))

      const allStories = storySnap.docs.map(d=>({id:d.id,...d.data()}))
      setStories(allStories)

      // Mapping - Admin a i thlak te
      const nameMap = {}
      mapSnap.docs.forEach(d=>{
        const data = d.data()
        if(data.original && data.display){
          nameMap[data.original.trim().toLowerCase()] = data.display
        }
      })
      // Hard fix - i duh duh i thlak theih nan
      const translate = {
        'love story': 'Hmangaihna',
        'funny story': 'Fiamthu',
       ...nameMap
      }

      // Category list + count dik tak
      const countMap = {}
      allStories.forEach(s=>{
        if(!s.category) return
        const low = s.category.trim().toLowerCase()
        const display = translate[low] || s.category
        const key = display.toLowerCase()
        countMap[key] = (countMap[key] || 0) + 1
      })

      let list = catSnap.docs.map(d=>{
        const orig = (d.data().name || '').trim()
        const display = translate[orig.toLowerCase()] || orig
        return { id: d.id, orig, name: display, count: countMap[display.toLowerCase()] || 0 }
      })

      // Duplicate merge - Love Story leh Hmangaihna 1 a nih lo nan
      const merged = {}
      list.forEach(c=>{
        const key = c.name.toLowerCase()
        if(!merged[key]) merged[key] = c
        else merged[key].count += c.count
      })

      // Count 0 pawh lang tho se, mahse a awm zat dik tak nen
      setCats(Object.values(merged).sort((a,b)=>a.name.localeCompare(b.name)))
      setLoading(false)
    }
    load()
  },[])

  const getStories = (catName)=>{
    const lowCat = catName.toLowerCase()
    return stories.filter(s=>{
      if(!s.category) return false
      const sLow = s.category.trim().toLowerCase()
      // Fiamthu = funny story, Hmangaihna = love story
      if(lowCat === 'fiamthu') return sLow === 'fiamthu' || sLow === 'funny story'
      if(lowCat === 'hmangaihna') return sLow === 'hmangaihna' || sLow === 'love story'
      return sLow === lowCat
    })
  }

  if(loading) return <div style={{paddingTop:'90px', textAlign:'center'}}>Loading...</div>

  return(
    <div style={{minHeight:'100vh', background:'#f2f2f7', paddingTop:'60px'}}>
      <div style={{padding:'16px'}}>
        <h2 style={{fontSize:'22px', fontWeight:'900', display:'flex', alignItems:'center', gap:'8px'}}>📚 Categories - AUTO</h2>
        <p style={{fontSize:'13px', color:'#888', marginTop:'2px'}}>Admin ah i siam apiang hetah a lang nghal ang</p>
      </div>

      <div style={{padding:'0 12px', display:'flex', flexDirection:'column', gap:'12px', paddingBottom:'30px'}}>
        {cats.map(c=>{
          const isOpen = openCat === c.name
          const catStories = getStories(c.name)
          return(
            <div key={c.name} style={{background:'white', borderRadius:'18px', boxShadow:'0 1px 3px rgba(0,0,0,0.05)', overflow:'hidden'}}>
              <div onClick={()=>setOpenCat(isOpen? null : c.name)} style={{padding:'16px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer'}}>
                <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                  <div style={{width:'44px', height:'44px', background:'#f1f1f3', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center'}}>📚</div>
                  <div>
                    <div style={{fontWeight:'800', fontSize:'15px'}}>{c.name}</div>
                    <div style={{fontSize:'12px', color:'#888'}}>{c.count} stories</div>
                  </div>
                </div>
                <div style={{width:'32px', height:'32px', background:'#f1f1f3', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px'}}>
                  {isOpen? '⌄' : '›'}
                </div>
              </div>

              {isOpen && (
                <div style={{padding:'0 10px 10px 10px'}}>
                  {catStories.length === 0? (
                    <div style={{padding:'12px', textAlign:'center', color:'#999', fontSize:'13px', background:'#fafafa', borderRadius:'12px'}}>Story a la awm lo</div>
                  ) : catStories.map(s=>(
                    <div key={s.id} onClick={()=>router.push(`/story/${s.id}`)} style={{padding:'14px', background:'#fff', border:'1px solid #f0f0f0', borderRadius:'14px', marginTop:'8px', cursor:'pointer'}}>
                      <div style={{fontWeight:'700', fontSize:'14px', lineHeight:'1.3'}}>{s.title || 'Thil theihnghil chhungkhua'}</div>
                      <div style={{fontSize:'12px', color:'#888', marginTop:'3px'}}>{c.name}</div>
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

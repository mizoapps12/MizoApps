'use client'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import Link from 'next/link'
import { useSettings } from '../components/SettingsContext'

export default function CategoriesPage(){
  const {dark} = useSettings()
  const [categories,setCategories]=useState([])
  const [stories,setStories]=useState([])
  const [openCat,setOpenCat]=useState(null)
  const [filterSub,setFilterSub]=useState(null)

  useEffect(()=>{
    const load=async()=>{
      const catSnap = await getDocs(query(collection(db,'categories'), orderBy('name','asc')))
      setCategories(catSnap.docs.map(d=>({id:d.id,...d.data()})))
      
      const storySnap = await getDocs(query(collection(db,'stories'), orderBy('createdAt','desc')))
      setStories(storySnap.docs.map(d=>({id:d.id,...d.data()})))
    }
    load()
  },[])

  const toggleCat=(catName)=>{
    if(openCat===catName){ setOpenCat(null); setFilterSub(null) }
    else{ setOpenCat(catName); setFilterSub(null) }
  }

  const getStoriesByCat=(catName, subName=null)=>{
    return stories.filter(s=>{
      if(subName) return s.category===catName && s.subCategory===subName
      return s.category===catName
    })
  }

  return(
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', padding:'16px', paddingTop:'75px', transition:'background 0.3s'}}>
      <h2 style={{fontWeight:'800', fontSize:'26px', margin:'10px 6px', color: dark?'#f0f0f0':'#111'}}>📚 Categories - AUTO</h2>
      <p style={{color: dark?'#aaa':'#888', fontSize:'13px', margin:'0 6px 16px 6px'}}>Admin ah i siam apiang hetah a lang nghal ang</p>

      {categories.map(cat=>{
        const isOpen = openCat===cat.name
        const catStories = getStoriesByCat(cat.name)
        const hasSub = cat.subcategories && cat.subcategories.length>0

        return(
          <div key={cat.id} style={{background: dark?'#1e1e1e':'white', borderRadius:'18px', marginBottom:'12px', border: dark?'1px solid #333':'1px solid #eee', overflow:'hidden', transition:'background 0.3s'}}>
            {/* Category Row */}
            <div onClick={()=>toggleCat(cat.name)} style={{display:'flex', alignItems:'center', padding:'16px', cursor:'pointer'}}>
              <div style={{width:'48px', height:'48px', borderRadius:'12px', background: dark?'#2a2a2a':'#f2f2f7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px'}}>📚</div>
              <div style={{flex:1, marginLeft:'14px'}}>
                <div style={{fontWeight:'700', fontSize:'16px', color: dark?'#fff':'#111'}}>{cat.name}</div>
                <div style={{fontSize:'11px', color: dark?'#888':'#888'}}>{catStories.length} stories {hasSub? `• ${cat.subcategories.length} sub` : ''}</div>
              </div>
              <div style={{width:'32px', height:'32px', borderRadius:'50%', background: dark?'#2a2a2a':'#f2f2f7', color: dark?'#fff':'#111', display:'flex', alignItems:'center', justifyContent:'center', transform:isOpen?'rotate(90deg)':'rotate(0deg)', transition:'0.2s'}}>›</div>
            </div>

            {/* Sub Category + Stories */}
            {isOpen && (
              <div style={{background: dark?'#181818':'#fafafb', borderTop: dark?'1px solid #333':'1px solid #eee', padding:'12px'}}>
                {/* Sub Categories */}
                {hasSub ? (
                  <div style={{display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'12px'}}>
                    <button onClick={()=>setFilterSub(null)} style={{padding:'8px 14px', borderRadius:'20px', border: dark?'1px solid #444':'1px solid #ddd', background: !filterSub ? (dark?'#fff':'#111') : (dark?'#252525':'white'), color: !filterSub ? (dark?'#111':'white') : (dark?'#fff':'#111'), fontSize:'12px', fontWeight:'700'}}>All ({catStories.length})</button>
                    {cat.subcategories.map((sub,i)=>{
                      const count = getStoriesByCat(cat.name, sub).length
                      return <button key={i} onClick={()=>setFilterSub(sub)} style={{padding:'8px 14px', borderRadius:'20px', border: dark?'1px solid #444':'1px solid #ddd', background: filterSub===sub ? (dark?'#fff':'#111') : (dark?'#252525':'white'), color: filterSub===sub ? (dark?'#111':'white') : (dark?'#fff':'#111'), fontSize:'12px', fontWeight:'700'}}>{sub} ({count})</button>
                    })}
                  </div>
                ) : null}

                {/* Stories List */}
                <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                  {getStoriesByCat(cat.name, filterSub).length===0 ? (
                    <div style={{textAlign:'center', color:'#999', fontSize:'12px', padding:'20px'}}>Story a la awm lo</div>
                  ) : (
                    getStoriesByCat(cat.name, filterSub).map(story=>(
                      <Link key={story.id} href={`/story/${story.id}`} style={{textDecoration:'none', background: dark?'#252525':'white', padding:'12px 14px', borderRadius:'12px', border: dark?'1px solid #333':'1px solid #eee', display:'block'}}>
                        <div style={{fontWeight:'700', fontSize:'14px', color: dark?'#fff':'#111'}}>{story.title}</div>
                        <div style={{fontSize:'11px', color: dark?'#aaa':'#888', marginTop:'2px'}}>{story.subCategory? `${story.category} › ${story.subCategory}` : story.category}</div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
                        }

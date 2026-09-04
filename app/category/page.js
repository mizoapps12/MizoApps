'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

const iconMap: any = {
  'Love Story': { icon: '❤️', color: '#ff4d6d' },
  'Funny Story': { icon: '😂', color: '#ffb703' },
  'Horror Story': { icon: '👻', color: '#7b2cbf' },
  'Science Fiction': { icon: '🚀', color: '#00b4d8' },
  'Life Lesson Story': { icon: '🌱', color: '#2dc653' },
  'Short story': { icon: '📖', color: '#ff8c00' },
  'Motivational Story': { icon: '💪', color: '#ff5400' },
  'Mizo Thawnthu': { icon: '🌾', color: '#007f5f' },
  'Mimal Chanchin': { icon: '👤', color: '#3a86ff' },
  'Thu tha lawrkhawm': { icon: '✨', color: '#8338ec' },
  'Lawrkhawm': { icon: '📚', color: '#6b21a8' },
}
const defaultIcon = { icon: '📚', color: '#6b21a8' }

export default function CategoryPage(){
  const [cats,setCats]=useState<any[]>([])

  useEffect(()=>{
    const load=async()=>{
      const snap=await getDocs(query(collection(db,'categories'), orderBy('name','asc')))
      setCats(snap.docs.map(d=>({id:d.id,...d.data()})))
    }
    load()
  },[])

  return(
    <div className="container">
      <h2 style={{fontWeight:'800', marginBottom:'16px'}}>📚 Categories - AUTO</h2>
      <p style={{color:'#888', fontSize:'13px', marginBottom:'12px'}}>Admin ah i siam apiang hetah a lang nghal ang</p>
      
      <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
        {cats.map((c)=>{
          const style=iconMap[c.name] || defaultIcon
          return(
            <Link key={c.id} href={`/category/${encodeURIComponent(c.name)}`} style={{textDecoration:'none'}}>
              <div style={{background:'white', borderRadius:'16px', padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid #f0f0f0'}}>
                <div style={{display:'flex', alignItems:'center', gap:'14px'}}>
                  <div style={{width:'46px', height:'46px', borderRadius:'12px', background:`${style.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px'}}>
                    {style.icon}
                  </div>
                  <div>
                    <div style={{fontWeight:'700', fontSize:'16px', color:'#111'}}>{c.name}</div>
                    {c.subcategories?.length>0 && <div style={{fontSize:'11px', color:'#888'}}>{c.subcategories.length} sub</div>}
                  </div>
                </div>
                <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'#f5f5f7', display:'flex', alignItems:'center', justifyContent:'center', color:'#888', fontSize:'18px', fontWeight:'700'}}>›</div>
              </div>
            </Link>
          )
        })}
        {cats.length===0 && <p style={{textAlign:'center', color:'#888', marginTop:'30px'}}>Category ala awm lo... /admin/categories ah siam rawh</p>}
      </div>
    </div>
  )
}

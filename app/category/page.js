'use client'
import Link from 'next/link'

const categories = [
  { name: 'Love Story', icon: '❤️', color: '#ff4d6d' },
  { name: 'Funny Story', icon: '😂', color: '#ffb703' },
  { name: 'Horror Story', icon: '👻', color: '#7b2cbf' },
  { name: 'Science Fiction', icon: '🚀', color: '#00b4d8' },
  { name: 'Life Lesson Story', icon: '🌱', color: '#2dc653' },
  { name: 'Short story', icon: '📖', color: '#ff8c00' },
  { name: 'Motivational Story', icon: '💪', color: '#ff5400' },
  { name: 'Mizo Thawnthu', icon: '🌾', color: '#007f5f' },
  { name: 'Mimal Chanchin', icon: '👤', color: '#3a86ff' },
  { name: 'Thu tha lawrkhawm', icon: '✨', color: '#8338ec' },
  { name: 'Lawrkhawm', icon: '📚', color: '#6b21a8' },
]

export default function CategoryPage(){
  return(
    <div className="container">
      <h2 style={{fontWeight:'800', marginBottom:'16px'}}>📚 Categories</h2>

      <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
        {categories.map((c)=>(
          <Link key={c.name} href={`/category/${encodeURIComponent(c.name)}`} style={{textDecoration:'none'}}>
            <div style={{
              background:'white',
              borderRadius:'16px',
              padding:'14px 16px',
              display:'flex',
              alignItems:'center',
              justifyContent:'space-between',
              boxShadow:'0 2px 12px rgba(0,0,0,0.06)',
              border:'1px solid #f0f0f0'
            }}>
              <div style={{display:'flex', alignItems:'center', gap:'14px'}}>
                <div style={{
                  width:'46px', height:'46px',
                  borderRadius:'12px',
                  background:`${c.color}15`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'22px'
                }}>
                  <span>{c.icon}</span>
                </div>
                <span style={{fontWeight:'700', fontSize:'16px', color:'#111'}}>{c.name}</span>
              </div>
              <div style={{
                width:'32px', height:'32px',
                borderRadius:'50%',
                background:'#f5f5f7',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#888', fontSize:'18px', fontWeight:'700'
              }}>
                ›
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

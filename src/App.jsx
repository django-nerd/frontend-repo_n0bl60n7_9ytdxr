import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Play, Music2, Sparkles, Clock, ShieldCheck, ArrowRight, Menu, Headphones, BadgeDollarSign, Wand2 } from 'lucide-react'
import Spline from '@splinetool/react-spline'

const backend = import.meta.env.VITE_BACKEND_URL || ''

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur border-b border-white/10 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 shadow-lg"></div>
          <span className="text-white font-semibold">SongScribe.AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
          <Link to="/pricing" className="hover:text-white">Pricing</Link>
          <Link to="/how-it-works" className="hover:text-white">How it works</Link>
          <Link to="/samples" className="hover:text-white">Samples</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
          <Link to="/demo" className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white">Free Demo</Link>
          <Link to="/create" className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium shadow-lg hover:shadow-violet-500/20">Create Your Song</Link>
        </nav>
        <button onClick={() => setOpen(!open)} className="md:hidden text-white"><Menu /></button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {['/pricing','/how-it-works','/samples','/contact','/demo','/create'].map((p,i)=> (
            <Link key={i} to={p} className="block px-3 py-2 rounded-lg bg-white/5 text-white" onClick={()=>setOpen(false)}>
              {p.replace('/','').replace('-', ' ')||'home'}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="relative pt-28">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Your Story, Turned Into a Song
          </h1>
          <p className="mt-6 text-lg text-white/80">
            Instantly create custom AI-generated songs for birthdays, brands, podcasts, films, and more. No music skills. No DAW. Just your idea.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/create" className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-medium flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Create Your Song
            </Link>
            <Link to="/demo" className="px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 font-medium">
              Try a Free Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Steps() {
  const items = [
    { icon: Wand2, title: 'Tell us your story', text: 'Share the purpose, style, and vibes.' },
    { icon: Music2, title: 'Pick style + rights', text: 'Choose genre, mood, and licensing tier.' },
    { icon: Clock, title: 'Get it in seconds', text: 'Receive a playable link almost instantly.' },
  ]
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-white mb-8">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {items.map(({icon:Icon,title,text},i)=> (
            <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6 text-white">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-medium mb-1">{title}</h3>
              <p className="text-white/70 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Samples() {
  const [samples, setSamples] = useState([])
  useEffect(()=>{
    fetch(`${backend}/samples`).then(r=>r.json()).then(d=>setSamples(d.samples||[])).catch(()=>{})
  },[])
  const defaultSamples = [
    { title: 'Birthday Song', category: 'Birthday', audio_url: 'https://cdn.pixabay.com/download/audio/2022/10/13/audio_7465cc.mp3?filename=birthday.mp3' },
    { title: 'Love Song', category: 'Love', audio_url: 'https://cdn.pixabay.com/download/audio/2022/11/07/audio_b0f5ad.mp3?filename=love.mp3' },
    { title: 'Corporate Anthem', category: 'Corporate', audio_url: 'https://cdn.pixabay.com/download/audio/2021/11/18/audio_11c2.mp3?filename=corporate.mp3' },
  ]
  const list = samples.length ? samples : defaultSamples
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-white mb-8">Sample Tracks</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {list.map((s,i)=> (
            <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-white/70">{s.category}</p>
                  <h3 className="font-semibold">{s.title}</h3>
                </div>
                <Headphones />
              </div>
              <audio className="w-full" controls src={s.audio_url}></audio>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const [cfg, setCfg] = useState(null)
  useEffect(()=>{ fetch(`${backend}/config`).then(r=>r.json()).then(setCfg).catch(()=>{}) },[])
  const tiers = [
    { key:'personal', name:'Personal', desc:'For personal listening & private use.'},
    { key:'standard', name:'Standard', desc:'Broader social use, non-commercial.'},
    { key:'business', name:'Business', desc:'Non-exclusive commercial rights.'},
    { key:'exclusive', name:'Exclusive', desc:'Full exclusive rights.'},
  ]
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-white">Pricing</h2>
          <Link to="/pricing" className="text-white/80 hover:text-white text-sm">View full pricing</Link>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {tiers.map(t=> (
            <div key={t.key} className="rounded-2xl bg-white/5 border border-white/10 p-6 text-white">
              <h3 className="font-semibold mb-1">{t.name}</h3>
              <p className="text-white/70 text-sm mb-4">{t.desc}</p>
              <p className="text-3xl font-bold mb-4">{cfg ? `$${(cfg.pricing[t.key].price_cents/100).toFixed(0)}` : '—'}</p>
              <Link to={`/create?tier=${t.key}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20">Choose {t.name} <ArrowRight className="w-4 h-4" /></Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-12 border-t border-white/10 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white/70 text-sm">
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <p>© {new Date().getFullYear()} SongScribe.AI</p>
          <nav className="flex gap-5">
            {['Pricing','How It Works','Contact','Terms','Privacy','Refund','License'].map((l,i)=> (
              <a key={i} href="#" className="hover:text-white">{l}</a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <Hero />
      <Steps />
      <Samples />
      <Pricing />
      <Footer />
    </div>
  )
}

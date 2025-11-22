import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const backend = import.meta.env.VITE_BACKEND_URL || ''

export function PricingPage(){
  const [cfg, setCfg] = useState(null)
  useEffect(()=>{ fetch(`${backend}/config`).then(r=>r.json()).then(setCfg).catch(()=>{}) },[])
  const tiers = [
    { key:'personal', name:'Personal', rights:'Personal listening, private videos, non-commercial socials.' },
    { key:'standard', name:'Standard', rights:'Broader social, still non-commercial.' },
    { key:'business', name:'Business', rights:'Non-exclusive commercial rights.' },
    { key:'exclusive', name:'Exclusive', rights:'Exclusive commercial rights for this track.' },
  ]
  const features = [
    'Variations','Revisions','Delivery speed','Lyrics generation','Instrumental option','License document'
  ]
  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Pricing</h1>
      <div className="grid md:grid-cols-4 gap-6">
        {tiers.map(t=> (
          <div key={t.key} className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h3 className="font-semibold mb-1">{t.name}</h3>
            <p className="text-white/70 text-sm mb-3">{t.rights}</p>
            <p className="text-3xl font-bold mb-4">{cfg ? `$${(cfg.pricing[t.key].price_cents/100).toFixed(0)}` : '—'}</p>
            <ul className="text-sm text-white/80 space-y-1 mb-4">
              {features.map((f,i)=> <li key={i}>• {f}</li>)}
            </ul>
            <Link to={`/create?tier=${t.key}`} className="inline-block px-4 py-2 rounded-full bg-white/10 hover:bg-white/20">Choose {t.name}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HowItWorksPage(){
  return (
    <div className="pt-24 pb-16 max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">How It Works</h1>
      <ol className="list-decimal pl-6 space-y-2 text-white/80">
        <li>Fill the song request form with purpose, style, mood, and story.</li>
        <li>Choose a licensing tier and delivery speed.</li>
        <li>Pay securely; we call the AI engine to generate your song.</li>
        <li>Get links to play and download; request revisions within your tier.</li>
      </ol>
    </div>
  )
}

export function SamplesPage(){
  const [samples, setSamples] = useState([])
  useEffect(()=>{ fetch(`${backend}/samples`).then(r=>r.json()).then(d=>setSamples(d.samples||[])).catch(()=>{}) },[])
  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Samples</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {samples.map((s,i)=> (
          <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <p className="text-sm text-white/70">{s.category}</p>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-sm text-white/70 mb-3">{s.description}</p>
            <audio className="w-full" controls src={s.audio_url}></audio>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ContactPage(){
  const [state, setState] = useState({ name:'', email:'', message:'' })
  const [sent, setSent] = useState(false)
  return (
    <div className="pt-24 pb-16 max-w-md mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <form className="space-y-3" onSubmit={async (e)=>{e.preventDefault(); await fetch(`${backend}/contact`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(state)}); setSent(true)}}>
        <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Name" value={state.name} onChange={e=>setState({...state, name:e.target.value})} />
        <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Email" value={state.email} onChange={e=>setState({...state, email:e.target.value})} />
        <textarea className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" rows="5" placeholder="Message" value={state.message} onChange={e=>setState({...state, message:e.target.value})} />
        <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-600">Send</button>
      </form>
      {sent && <p className="text-green-400 mt-3">Thanks! We will reply at support@songscribe.ai</p>}
    </div>
  )
}

export function DemoPage(){
  const [form, setForm] = useState({ purpose:'', styles:[], style_text:'', moods:[], instrumental_only:false, email:'' })
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  return (
    <div className="pt-24 pb-16 max-w-2xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Free Demo</h1>
      <p className="text-white/70 mb-6">Generate a short, watermarked preview. 1 per day.</p>
      <form className="space-y-3" onSubmit={async (e)=>{e.preventDefault(); setLoading(true); try{ const r=await fetch(`${backend}/demo/create`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)}); const d=await r.json(); setPreview(d)} finally{ setLoading(false)} }}>
        <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Email (optional)" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Purpose (e.g., Birthday)" value={form.purpose} onChange={e=>setForm({...form, purpose:e.target.value})} />
        <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Style (e.g., Afrobeats)" value={form.style_text} onChange={e=>setForm({...form, style_text:e.target.value})} />
        <div className="flex items-center gap-2">
          <input id="inst" type="checkbox" checked={form.instrumental_only} onChange={e=>setForm({...form, instrumental_only:e.target.checked})} />
          <label htmlFor="inst" className="text-white/80">Instrumental only</label>
        </div>
        <button disabled={loading} className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-600">{loading? 'Generating...' : 'Generate Preview'}</button>
      </form>
      {preview && (
        <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5">
          <audio className="w-full mb-4" controls src={preview.preview_url}></audio>
          <div className="p-4 rounded-xl bg-white/5">
            <h3 className="font-semibold mb-1">Unlock the full song</h3>
            <p className="text-white/70 text-sm mb-3">Full length, no watermark, commercial options, downloads included.</p>
            <Link to="/pricing" className="inline-block px-4 py-2 rounded-full bg-white/10 hover:bg-white/20">View Paid Tiers</Link>
          </div>
        </div>
      )}
    </div>
  )
}

function Chip({label, selected, onClick}){
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-full border ${selected? 'bg-violet-600 border-transparent' : 'bg-white/5 border-white/10'} text-sm`}>{label}</button>
  )
}

export function CreatePage(){
  const [params] = useSearchParams()
  const [step, setStep] = useState(1)
  const [state, setState] = useState({
    email:'', purpose:'', for_whom:'', styles:[], style_text:'', moods:[], vocals:'full', vocal_pref:'none', lyrics_mode:'write_for_me', user_lyrics:'', key_phrases:'', names_to_include:'', languages:'', story:'', special_elements:[], length:'full', delivery_speed:'standard', license_tier: params.get('tier')||'personal'
  })

  const styles = ['Afrobeats','Amapiano','Pop','R&B','Hip-Hop','Gospel','EDM','Piano Ballad','Acoustic','Cinematic','Epic','Choir','Jazz','Funk']
  const moods = ['Happy','Romantic','Emotional','Funny','Inspirational','Calm','Energetic','Dramatic','Serious','Luxury','Dark']
  const specials = ['Shout-outs','Rap verse','Choir section','Big drop','Emotional bridge','Call-and-response']

  async function submit(){
    const payload = {
      ...state,
      key_phrases: state.key_phrases? state.key_phrases.split(',').map(s=>s.trim()).filter(Boolean) : undefined,
      names_to_include: state.names_to_include? state.names_to_include.split(',').map(s=>s.trim()).filter(Boolean) : undefined,
      languages: state.languages? state.languages.split(',').map(s=>s.trim()).filter(Boolean) : undefined,
    }
    const r = await fetch(`${backend}/orders/create`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})
    const d = await r.json()
    setStep(5)
    setState(s=> ({...s, order_id: d.order_id, audio_urls: d.audio_urls}))
  }

  return (
    <div className="pt-24 pb-16 max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Create Your Song</h1>
      {step===1 && (
        <div className="space-y-4">
          <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Email" value={state.email} onChange={e=>setState({...state, email:e.target.value})} />
          <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Purpose (e.g., Corporate Anthem)" value={state.purpose} onChange={e=>setState({...state, purpose:e.target.value})} />
          <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Who is this for?" value={state.for_whom} onChange={e=>setState({...state, for_whom:e.target.value})} />
          <div className="flex justify-end"><button className="px-4 py-2 rounded-lg bg-white/10" onClick={()=>setStep(2)}>Next</button></div>
        </div>
      )}
      {step===2 && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {styles.map(s=> <Chip key={s} label={s} selected={state.styles.includes(s)} onClick={()=> setState({...state, styles: state.styles.includes(s)? state.styles.filter(x=>x!==s): [...state.styles, s]})} />)}
          </div>
          <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Describe your style in your own words" value={state.style_text} onChange={e=>setState({...state, style_text:e.target.value})} />
          <div className="flex flex-wrap gap-2">
            {moods.map(m=> <Chip key={m} label={m} selected={state.moods.includes(m)} onClick={()=> setState({...state, moods: state.moods.includes(m)? state.moods.filter(x=>x!==m): [...state.moods, m]})} />)}
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <select className="px-3 py-2 rounded-lg bg-white/5 border border-white/10" value={state.vocals} onChange={e=>setState({...state, vocals:e.target.value})}>
              <option value="full">Full Song</option>
              <option value="instrumental">Instrumental Only</option>
              <option value="vocals_only">Vocals Only</option>
            </select>
            <select className="px-3 py-2 rounded-lg bg-white/5 border border-white/10" value={state.vocal_pref} onChange={e=>setState({...state, vocal_pref:e.target.value})}>
              <option value="none">No preference</option>
              <option value="male">Male vocal</option>
              <option value="female">Female vocal</option>
            </select>
            <select className="px-3 py-2 rounded-lg bg-white/5 border border-white/10" value={state.length} onChange={e=>setState({...state, length:e.target.value})}>
              <option value="full">Standard full song</option>
              <option value="jingle">Short jingle (10–30s)</option>
              <option value="extended">Extended version</option>
              <option value="cinematic">Cinematic long version</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button className="px-4 py-2 rounded-lg bg-white/10" onClick={()=>setStep(1)}>Back</button>
            <button className="px-4 py-2 rounded-lg bg-white/10" onClick={()=>setStep(3)}>Next</button>
          </div>
        </div>
      )}
      {step===3 && (
        <div className="space-y-4">
          <select className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" value={state.lyrics_mode} onChange={e=>setState({...state, lyrics_mode:e.target.value})}>
            <option value="write_for_me">Write the lyrics for me</option>
            <option value="paste_lyrics">I will paste my own lyrics</option>
            <option value="generate_from_story">Use my story to generate lyrics</option>
          </select>
          {state.lyrics_mode==='paste_lyrics' ? (
            <textarea rows="6" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Paste your lyrics" value={state.user_lyrics} onChange={e=>setState({...state, user_lyrics:e.target.value})} />
          ) : (
            <>
              <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Key phrases (comma separated)" value={state.key_phrases} onChange={e=>setState({...state, key_phrases:e.target.value})} />
              <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Names to include (comma separated)" value={state.names_to_include} onChange={e=>setState({...state, names_to_include:e.target.value})} />
              <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Language(s) (comma separated)" value={state.languages} onChange={e=>setState({...state, languages:e.target.value})} />
              <textarea rows="5" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Story & background" value={state.story} onChange={e=>setState({...state, story:e.target.value})} />
            </>
          )}
          <div className="flex flex-wrap gap-2">
            {specials.map(s=> <Chip key={s} label={s} selected={state.special_elements.includes(s)} onClick={()=> setState({...state, special_elements: state.special_elements.includes(s)? state.special_elements.filter(x=>x!==s): [...state.special_elements, s]})} />)}
          </div>
          <div className="flex justify-between">
            <button className="px-4 py-2 rounded-lg bg-white/10" onClick={()=>setStep(2)}>Back</button>
            <button className="px-4 py-2 rounded-lg bg-white/10" onClick={()=>setStep(4)}>Next</button>
          </div>
        </div>
      )}
      {step===4 && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <select className="px-3 py-2 rounded-lg bg-white/5 border border-white/10" value={state.delivery_speed} onChange={e=>setState({...state, delivery_speed:e.target.value})}>
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="super_express">Super Express</option>
            </select>
            <select className="px-3 py-2 rounded-lg bg-white/5 border border-white/10" value={state.license_tier} onChange={e=>setState({...state, license_tier:e.target.value})}>
              <option value="personal">Personal</option>
              <option value="standard">Standard</option>
              <option value="business">Business Commercial</option>
              <option value="exclusive">Exclusive Rights</option>
            </select>
          </div>
          <div className="p-4 rounded-xl bg-white/5 text-white/80 text-sm">
            <p>By proceeding, you accept the Terms of Service and Licensing Policy and confirm you are not submitting copyrighted or harmful content.</p>
          </div>
          <div className="flex justify-between">
            <button className="px-4 py-2 rounded-lg bg-white/10" onClick={()=>setStep(3)}>Back</button>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-600" onClick={submit}>Pay & Generate</button>
          </div>
        </div>
      )}
      {step===5 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Your song is ready</h2>
          <p className="text-white/70">Below are your generated tracks.</p>
          <div className="grid gap-4">
            {(state.audio_urls||[]).map((u,i)=> (
              <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4">
                <p className="mb-2 text-sm">Version {i+1}</p>
                <audio className="w-full" controls src={u}></audio>
              </div>
            ))}
          </div>
          <Link to="/" className="inline-block px-4 py-2 rounded-lg bg-white/10">Back to Home</Link>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Music2, Rocket, ShieldCheck, Sparkles, Timer } from 'lucide-react'

const backend = import.meta.env.VITE_BACKEND_URL || ''

const fade = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

function PageShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(139,92,246,0.18),rgba(2,6,23,0))]" />
      <div className="pt-24 pb-10 max-w-7xl mx-auto px-4">
        <motion.div variants={fade} initial="hidden" animate="show" className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-white/70 mt-2 max-w-2xl">{subtitle}</p>}
        </motion.div>
        {children}
      </div>
    </div>
  )
}

export function PricingPage(){
  const [cfg, setCfg] = useState(null)
  useEffect(()=>{ fetch(`${backend}/config`).then(r=>r.json()).then(setCfg).catch(()=>{}) },[])
  const tiers = [
    { key:'personal', name:'Personal', rights:'Personal listening, private videos, non-commercial socials.', icon: Sparkles },
    { key:'standard', name:'Standard', rights:'Broader social, still non-commercial.', icon: Music2 },
    { key:'business', name:'Business', rights:'Non-exclusive commercial rights.', icon: ShieldCheck },
    { key:'exclusive', name:'Exclusive', rights:'Exclusive commercial rights for this track.', icon: Rocket },
  ]
  const features = [
    'Variations','Revisions','Delivery speed','Lyrics generation','Instrumental option','License document'
  ]
  return (
    <PageShell title="Pricing" subtitle="Simple tiers for personal moments and serious brands. Upgrade any time.">
      <div className="grid md:grid-cols-4 gap-6">
        {tiers.map((t,i)=> {
          const Icon = t.icon
          const price = cfg ? `$${(cfg.pricing[t.key].price_cents/100).toFixed(0)}` : '—'
          return (
            <motion.div key={t.key} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.06, duration: 0.45 }} className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/[0.07] transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">{t.name}</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">{t.rights}</p>
              <p className="text-3xl font-bold mb-4">{price}</p>
              <ul className="text-sm text-white/80 space-y-2 mb-5">
                {features.map((f,idx)=> (
                  <li key={idx} className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> {f}</li>
                ))}
              </ul>
              <Link to={`/create?tier=${t.key}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition">Choose {t.name}</Link>
            </motion.div>
          )})}
      </div>
    </PageShell>
  )
}

export function HowItWorksPage(){
  const steps = [
    { title: 'Describe', text: 'Purpose, style, mood, vocals, and story.' , icon: Sparkles },
    { title: 'Choose rights', text: 'Pick delivery speed and licensing tier.' , icon: ShieldCheck },
    { title: 'Pay & generate', text: 'We call the AI engine and deliver links.' , icon: Timer },
  ]
  return (
    <PageShell title="How it works" subtitle="A focused, three-step experience that respects your time.">
      <div className="grid sm:grid-cols-3 gap-6">
        {steps.map((s,i)=> {
          const Icon = s.icon
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.08, duration: 0.45 }} className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/[0.07] transition">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-1">{s.title}</h3>
              <p className="text-white/70 text-sm">{s.text}</p>
            </motion.div>
          )
        })}
      </div>
    </PageShell>
  )
}

export function SamplesPage(){
  const [samples, setSamples] = useState([])
  useEffect(()=>{ fetch(`${backend}/samples`).then(r=>r.json()).then(d=>setSamples(d.samples||[])).catch(()=>{}) },[])
  return (
    <PageShell title="Samples" subtitle="A taste of what you can create — fast.">
      <div className="grid md:grid-cols-3 gap-6">
        {samples.map((s,i)=> (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.06, duration: 0.45 }} className="rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/[0.07] transition">
            <p className="text-sm text-white/70">{s.category}</p>
            <h3 className="font-semibold">{s.title}</h3>
            {s.description && <p className="text-sm text-white/70 mb-3">{s.description}</p>}
            <audio className="w-full" controls src={s.audio_url}></audio>
          </motion.div>
        ))}
        {samples.length===0 && (
          <motion.div variants={fade} initial="hidden" animate="show" className="col-span-full text-white/60">No samples yet. Check back soon.</motion.div>
        )}
      </div>
    </PageShell>
  )
}

export function ContactPage(){
  const [state, setState] = useState({ name:'', email:'', message:'' })
  const [sent, setSent] = useState(false)
  return (
    <PageShell title="Contact" subtitle="We reply within 24 hours. For support, include your order ID.">
      <motion.form variants={fade} initial="hidden" animate="show" className="max-w-md space-y-3">
        <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/40" placeholder="Name" value={state.name} onChange={e=>setState({...state, name:e.target.value})} />
        <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/40" placeholder="Email" value={state.email} onChange={e=>setState({...state, email:e.target.value})} />
        <textarea className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/40" rows="5" placeholder="Message" value={state.message} onChange={e=>setState({...state, message:e.target.value})} />
        <button type="button" onClick={async ()=>{ await fetch(`${backend}/contact`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(state)}); setSent(true)}} className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:opacity-95 transition">Send</button>
        <AnimatePresence>
          {sent && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-green-400">Thanks! We will reply at support@songscribe.ai</motion.p>
          )}
        </AnimatePresence>
      </motion.form>
    </PageShell>
  )
}

export function DemoPage(){
  const [form, setForm] = useState({ purpose:'', styles:[], style_text:'', moods:[], instrumental_only:false, email:'' })
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  return (
    <PageShell title="Free demo" subtitle="One short, watermarked preview per day. Upgrade for full quality.">
      <motion.form variants={fade} initial="hidden" animate="show" className="max-w-2xl space-y-3" onSubmit={async (e)=>{e.preventDefault(); setLoading(true); try{ const r=await fetch(`${backend}/demo/create`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)}); const d=await r.json(); setPreview(d)} finally{ setLoading(false)} }}>
        <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/40" placeholder="Email (optional)" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/40" placeholder="Purpose (e.g., Birthday)" value={form.purpose} onChange={e=>setForm({...form, purpose:e.target.value})} />
        <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/40" placeholder="Style (e.g., Afrobeats)" value={form.style_text} onChange={e=>setForm({...form, style_text:e.target.value})} />
        <label className="flex items-center gap-2 text-white/80 select-none"><input type="checkbox" checked={form.instrumental_only} onChange={e=>setForm({...form, instrumental_only:e.target.checked})} /> Instrumental only</label>
        <button disabled={loading} className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:opacity-95 transition">{loading? 'Generating…' : 'Generate preview'}</button>
      </motion.form>
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5 max-w-2xl">
            <audio className="w-full mb-4" controls src={preview.preview_url}></audio>
            <div className="p-4 rounded-xl bg-white/5">
              <h3 className="font-semibold mb-1">Unlock the full song</h3>
              <p className="text-white/70 text-sm mb-3">Full length, no watermark, commercial options, downloads included.</p>
              <Link to="/pricing" className="inline-block px-4 py-2 rounded-full bg-white/10 hover:bg-white/20">View paid tiers</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  )
}

function Chip({label, selected, onClick}){
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-full border ${selected? 'bg-violet-600 border-transparent' : 'bg-white/5 border-white/10'} text-sm hover:bg-white/[0.08] transition`}>{label}</button>
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

  function StepShell({children}){
    return (
      <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4" >
        {children}
      </motion.div>
    )
  }

  const progress = (step/5)*100

  return (
    <PageShell title="Create your song" subtitle="A focused, guided flow. You can be done in under a minute.">
      <div className="max-w-3xl">
        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden mb-6">
          <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-600" style={{ width: `${progress}%` }} />
        </div>
        {step===1 && (
          <StepShell>
            <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/40" placeholder="Email" value={state.email} onChange={e=>setState({...state, email:e.target.value})} />
            <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/40" placeholder="Purpose (e.g., Corporate Anthem)" value={state.purpose} onChange={e=>setState({...state, purpose:e.target.value})} />
            <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/40" placeholder="Who is this for?" value={state.for_whom} onChange={e=>setState({...state, for_whom:e.target.value})} />
            <div className="flex justify-end"><button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition" onClick={()=>setStep(2)}>Next</button></div>
          </StepShell>
        )}
        {step===2 && (
          <StepShell>
            <div className="flex flex-wrap gap-2">
              {styles.map(s=> <Chip key={s} label={s} selected={state.styles.includes(s)} onClick={()=> setState({...state, styles: state.styles.includes(s)? state.styles.filter(x=>x!==s): [...state.styles, s]})} />)}
            </div>
            <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/40" placeholder="Describe your style in your own words" value={state.style_text} onChange={e=>setState({...state, style_text:e.target.value})} />
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
              <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition" onClick={()=>setStep(1)}>Back</button>
              <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition" onClick={()=>setStep(3)}>Next</button>
            </div>
          </StepShell>
        )}
        {step===3 && (
          <StepShell>
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
              <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition" onClick={()=>setStep(2)}>Back</button>
              <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition" onClick={()=>setStep(4)}>Next</button>
            </div>
          </StepShell>
        )}
        {step===4 && (
          <StepShell>
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
              <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition" onClick={()=>setStep(3)}>Back</button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:opacity-95 transition" onClick={submit}>Pay & Generate</button>
            </div>
          </StepShell>
        )}
        {step===5 && (
          <StepShell>
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
            <Link to="/" className="inline-block px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">Back to Home</Link>
          </StepShell>
        )}
      </div>
    </PageShell>
  )
}

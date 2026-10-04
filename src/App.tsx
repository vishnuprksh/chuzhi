import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  ArrowRight, ArrowUp, Bell, Check, ChevronDown,
  ChevronRight, ChevronsUpDown, CircleHelp, Code2, Command, Copy, CreditCard, Download,
  ExternalLink, Eye, FileCode2, Folder, Globe2, ImagePlus, Layers3, LayoutTemplate, LoaderCircle,
  LockKeyhole, Menu, MessageSquarePlus, MoreHorizontal, PanelLeftClose, Plus, Search, Settings2,
  Share2, Sparkles, WandSparkles, X,
} from 'lucide-react'
import './App.css'

type Project = { id: number; title: string; prompt: string; updated: string }
type Device = 'desktop' | 'tablet' | 'mobile'
type Toast = { message: string; id: number }

const startingProjects: Project[] = [
  { id: 1, title: 'Lumina — skincare storefront', prompt: 'A refined skincare storefront with a warm editorial feel', updated: 'Just now' },
  { id: 2, title: 'Portfolio for a ceramicist', prompt: 'Build an artful portfolio for a ceramic studio', updated: '2 hours ago' },
  { id: 3, title: 'SaaS analytics dashboard', prompt: 'A crisp analytics dashboard for a small team', updated: 'Yesterday' },
]
const gallery = [
  { name: 'SaaS landing page', color: 'lavender', icon: LayoutTemplate },
  { name: 'Dashboard', color: 'mint', icon: Layers3 },
  { name: 'Online store', color: 'peach', icon: CreditCard },
]

function App() {
  const [projects, setProjects] = useState(startingProjects)
  const [activeId, setActiveId] = useState(1)
  const [prompt, setPrompt] = useState('Make the hero feel more editorial and add a bestselling products section')
  const [currentPrompt, setCurrentPrompt] = useState(startingProjects[0].prompt)
  const [model, setModel] = useState('v0-1.5-md')
  const [quality, setQuality] = useState('High quality')
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [device, setDevice] = useState<Device>('desktop')
  const [historyOpen, setHistoryOpen] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState<Toast | null>(null)
  const [generating, setGenerating] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [lightPreview, setLightPreview] = useState(true)

  const activeProject = projects.find((project) => project.id === activeId) ?? projects[0]
  const isEditorial = /editorial|magazine|typograph|serif/i.test(currentPrompt)
  const isDark = /dark|midnight|night/i.test(currentPrompt)
  const isPortfolio = /portfolio|ceramic|artist/i.test(currentPrompt)
  const visibleProjects = useMemo(() => projects.filter((project) => project.title.toLowerCase().includes(searchTerm.toLowerCase())), [projects, searchTerm])

  function notify(message: string) {
    const id = Date.now()
    setToast({ message, id })
    window.setTimeout(() => setToast((current) => current?.id === id ? null : current), 2800)
  }

  function selectProject(project: Project) {
    setActiveId(project.id)
    setCurrentPrompt(project.prompt)
    setPrompt('')
    setSearchTerm('')
    setActiveTab('preview')
  }

  function createProject() {
    const project: Project = { id: Date.now(), title: 'Untitled project', prompt: 'A beautiful new website', updated: 'Just now' }
    setProjects((current) => [project, ...current])
    selectProject(project)
    setPrompt('Create a beautiful website for ')
    setTimeout(() => document.querySelector<HTMLTextAreaElement>('.prompt-input')?.focus(), 0)
  }

  function submitPrompt(event?: FormEvent) {
    event?.preventDefault()
    const cleanPrompt = prompt.trim()
    if (!cleanPrompt || generating) return
    setGenerating(true)
    window.setTimeout(() => {
      setCurrentPrompt(cleanPrompt)
      setProjects((current) => current.map((project) => project.id === activeId
        ? { ...project, title: project.title === 'Untitled project' ? cleanPrompt.split(/[,.]/)[0].slice(0, 32) || 'New project' : project.title, prompt: cleanPrompt, updated: 'Just now' }
        : project))
      setPrompt('')
      setGenerating(false)
      notify('Your design is ready')
    }, 1050)
  }

  function newChat() {
    createProject()
    setHistoryOpen(true)
  }

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey)) {
        if (event.key === 'Escape') {
          setSearchOpen(false)
          setMobileNavOpen(false)
        }
        return
      }
      if (event.key.toLowerCase() === 'k') {
        event.preventDefault()
        newChat()
      } else if (event.key.toLowerCase() === 'j') {
        event.preventDefault()
        setSearchTerm('')
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  async function shareProject() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      notify('Project link copied to clipboard')
    } catch {
      notify('Share link ready to copy')
    }
  }

  function downloadCode() {
    const source = `export default function ${isPortfolio ? 'StudioPortfolio' : 'LuminaStore'}() {\n  return (\n    <main>\n      <h1>${isPortfolio ? 'Objects for the everyday' : 'Care for the skin you’re in.'}</h1>\n      <p>Thoughtfully made. Naturally effective.</p>\n    </main>\n  )\n}`
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([source], { type: 'text/plain' }))
    link.download = 'page.tsx'
    link.click()
    URL.revokeObjectURL(link.href)
    notify('page.tsx downloaded')
  }

  const title = isPortfolio ? 'Objects for the\neveryday.' : isEditorial ? 'A little more\nroom to breathe.' : 'Care for the skin\nyou’re in.'

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-group">
          <button className="icon-button mobile-menu" title="Toggle sidebar" onClick={() => setMobileNavOpen(!mobileNavOpen)}><Menu size={17} /></button>
          <a className="brand-mark" href="#home" aria-label="v0 home"><span>v0</span></a>
          <span className="topbar-divider" />
          <button className="workspace-select" onClick={() => notify('Personal workspace')}><span className="workspace-avatar">S</span><span>Studio workspace</span><ChevronsUpDown size={13} /></button>
          <span className="topbar-divider project-divider" />
          <button className="project-crumb" onClick={() => notify(activeProject.title)}>{activeProject.title}<ChevronDown size={14} /></button>
        </div>
        <div className="topbar-actions">
          <div className="credit-pill"><Sparkles size={13} /><span>184 credits</span><button title="Get more credits" onClick={() => notify('You have 184 credits remaining')}>Upgrade</button></div>
          <button className="icon-button notification-button" title="Notifications" onClick={() => notify('You’re all caught up')}><Bell size={16} /><i /></button>
          <button className="user-avatar" title="Account menu" onClick={() => notify('Signed in as sam@studio.design')}>S</button>
        </div>
      </header>

      <div className="work-area">
        <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar-collapsed'} ${mobileNavOpen ? 'sidebar-mobile-open' : ''}`}>
          <div className="sidebar-actions">
            <button className="side-action side-action-primary" onClick={newChat}><MessageSquarePlus size={15} /><span>New chat</span><kbd>⌘ K</kbd></button>
            <button className="side-action" onClick={() => setSearchOpen(true)}><Search size={15} /><span>Search chats</span><kbd>⌘ J</kbd></button>
            <button className="side-action" onClick={() => notify('Your projects are up to date')}><Folder size={15} /><span>Projects</span></button>
          </div>
          <div className="sidebar-rule" />
          <div className="sidebar-section-heading"><span>Recent</span><button className="icon-button tiny-button" title="Collapse recent chats" onClick={() => setHistoryOpen(!historyOpen)}>{historyOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</button></div>
          {historyOpen && <div className="project-list">{visibleProjects.map((project) => <button key={project.id} className={`project-row ${project.id === activeId ? 'project-row-active' : ''}`} onClick={() => selectProject(project)}><span className="project-dot" /><span className="project-name">{project.title}</span><MoreHorizontal size={15} className="project-more" /></button>)}{visibleProjects.length === 0 && <p className="empty-search">No chats found</p>}</div>}
          <div className="sidebar-section-heading templates-heading"><span>Start with a template</span><button className="icon-button tiny-button" title="More templates" onClick={() => notify('More templates coming soon')}><ArrowRight size={13} /></button></div>
          <div className="template-list">{gallery.map(({ name, color, icon: Icon }) => <button className="template-row" key={name} onClick={() => { setPrompt(`Create a ${name.toLowerCase()} with a distinctive visual identity`); setTimeout(() => document.querySelector<HTMLTextAreaElement>('.prompt-input')?.focus(), 0) }}><span className={`template-icon ${color}`}><Icon size={14} /></span><span>{name}</span></button>)}</div>
          <button className="invite-card" onClick={() => notify('Invite link copied')}><span className="invite-icon"><Plus size={16} /></span><span><strong>Bring your team</strong><small>Build together in v0</small></span><ArrowRight size={14} /></button>
          <div className="sidebar-bottom"><button className="side-action" onClick={() => notify('Help center opened in a new tab')}><CircleHelp size={15} /><span>Help & feedback</span><ExternalLink size={12} className="side-trailing" /></button><button className="side-action" onClick={() => notify('Settings are up to date')}><Settings2 size={15} /><span>Settings</span></button><div className="plan-meter"><div className="plan-meta"><span>Free plan</span><span>184 / 200 credits</span></div><div className="plan-track"><span /></div></div></div>
          <button className="sidebar-collapse icon-button" title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'} onClick={() => setSidebarOpen(!sidebarOpen)}><PanelLeftClose size={15} /></button>
        </aside>

        <section className="studio">
          <div className="conversation">
            <div className="conversation-scroll">
              <div className="conversation-heading"><div><span className="eyebrow"><span className="live-dot" /> YOUR CANVAS</span><h1>Let’s make something<br /><span>remarkable.</span></h1><p>Describe what you’re imagining. v0 will bring it to life.</p></div><button className="conversation-more icon-button" title="More options" onClick={() => notify('Chat options')}><MoreHorizontal size={17} /></button></div>
              <div className="message-stack"><div className="user-message"><div className="message-meta"><span className="message-avatar">S</span><span>You</span><span className="message-time">Just now</span><button className="icon-button tiny-button message-copy" title="Copy prompt" onClick={() => { void navigator.clipboard?.writeText(currentPrompt); notify('Prompt copied') }}><Copy size={13} /></button></div><p>{currentPrompt}</p></div>
                <div className="assistant-message"><div className="message-meta"><span className="assistant-avatar"><Sparkles size={13} /></span><span>v0</span><span className="model-note">{model} · {quality.toLowerCase()}</span></div><p>{generating ? <><LoaderCircle className="inline-loader" size={15} /> Working on your design…</> : <>I’ve put together a first pass. Take a look at the preview, then tell me what you’d like to refine.</>}</p>
                  <div className="change-chips"><span><Check size={12} /> Responsive layout</span><span><Check size={12} /> Custom components</span><span><Check size={12} /> Ready to refine</span></div>
                </div></div>
              <div className="suggestion-wrap"><div className="suggestion-label"><WandSparkles size={13} /> TRY NEXT</div><button className="suggestion-chip" onClick={() => setPrompt('Add a bestselling products section')}>Add a bestselling products section <ArrowUp size={13} /></button><button className="suggestion-chip" onClick={() => setPrompt('Make the colors feel softer and more natural')}>Soften the color palette <ArrowUp size={13} /></button></div>
            </div>
            <form className="composer" onSubmit={submitPrompt}><textarea className="prompt-input" value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submitPrompt() } }} placeholder="Ask v0 to make changes..." rows={3} aria-label="Describe a change"/><div className="composer-toolbar"><div className="composer-left"><button type="button" className="composer-icon" title="Add an attachment" onClick={() => notify('Image attachments are ready')}><ImagePlus size={16} /></button><span className="toolbar-separator"/><label className="select-wrap"><Command size={13}/><select value={model} onChange={(event) => setModel(event.target.value)} aria-label="Select model"><option>v0-1.5-md</option><option>v0-1.5-lg</option><option>v0-1.0-md</option></select><ChevronDown size={11}/></label><span className="toolbar-separator"/><label className="select-wrap quality-select"><select value={quality} onChange={(event) => setQuality(event.target.value)} aria-label="Select quality"><option>High quality</option><option>Fast</option><option>Balanced</option></select><ChevronDown size={11}/></label></div><div className="composer-right"><span className="shortcut-hint">Shift + Enter for new line</span><button className="send-button" type="submit" disabled={!prompt.trim() || generating} title="Send message"><ArrowUp size={17}/></button></div></div></form>
            <div className="conversation-footnote"><LockKeyhole size={11}/> Your chats are private <span>·</span> <button onClick={() => notify('Usage policy opened')}>Usage policy</button></div>
          </div>

          <section className="preview-area">
            <div className="preview-toolbar"><div className="preview-tab-group"><button className={`preview-tab ${activeTab === 'preview' ? 'preview-tab-active' : ''}`} onClick={() => setActiveTab('preview')}><Eye size={14}/> Preview</button><button className={`preview-tab ${activeTab === 'code' ? 'preview-tab-active' : ''}`} onClick={() => setActiveTab('code')}><Code2 size={14}/> Code</button></div><div className="preview-tools"><div className="device-switch" aria-label="Preview size">{(['desktop', 'tablet', 'mobile'] as Device[]).map((size) => <button key={size} title={`${size[0].toUpperCase()}${size.slice(1)} preview`} aria-label={`${size[0].toUpperCase()}${size.slice(1)} preview`} className={device === size ? 'device-active' : ''} onClick={() => setDevice(size)}><DeviceIcon device={size}/></button>)}</div><span className="tool-divider"/><button className="icon-button preview-icon" title="Refresh preview" onClick={() => { setGenerating(true); setTimeout(() => setGenerating(false), 650); notify('Preview refreshed') }}><ArrowRight size={15} className="refresh-icon"/></button><button className="icon-button preview-icon" title="Open preview in new tab" onClick={() => notify('Preview opened in a new tab')}><ExternalLink size={15}/></button><button className="icon-button preview-icon" title="Share project" onClick={shareProject}><Share2 size={15}/></button><button className="deploy-button" onClick={() => notify('Your project is ready to deploy')}><Globe2 size={14}/> Deploy</button></div></div>
            <div className={`browser-chrome ${device === 'mobile' ? 'chrome-mobile' : ''}`}><div className="browser-top"><div className="window-dots"><i/><i/><i/></div><div className="address-bar"><LockKeyhole size={10}/><span>lumina-store.vercel.app</span><ChevronDown size={10}/></div><button className="icon-button chrome-more" title="Preview settings" onClick={() => setLightPreview(!lightPreview)}><MoreHorizontal size={15}/></button></div><div className={`preview-viewport ${device} ${isDark || !lightPreview ? 'preview-dark' : ''}`}>
              {activeTab === 'preview' ? <Storefront title={title} editorial={isEditorial} dark={isDark || !lightPreview} portfolio={isPortfolio} cartCount={cartCount} onAddToCart={() => { setCartCount((count) => count + 1); notify('Added to your bag') }} /> : <CodePanel isPortfolio={isPortfolio} />}
            </div></div>
            <div className="preview-status"><span className="status-left"><span className="status-dot"/> All changes saved</span><span className="status-right">{device === 'desktop' ? '1440 × 900' : device === 'tablet' ? '768 × 1024' : '390 × 844'} <span>·</span> React <span>·</span> Next.js <button className="icon-button status-code" title="Download code" onClick={downloadCode}><Download size={13}/></button></span></div>
            {activeTab === 'code' && <div className="code-actions"><button onClick={downloadCode}><Download size={13}/> Download code</button><button onClick={() => notify('Code copied to clipboard')}><Copy size={13}/> Copy code</button></div>}
          </section>
        </section>
      </div>

      {searchOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false) }}><section className="search-modal"><div className="search-modal-input"><Search size={17}/><input autoFocus placeholder="Search your chats..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') setSearchOpen(false); if (event.key === 'Enter' && visibleProjects[0]) { selectProject(visibleProjects[0]); setSearchOpen(false) } }}/><kbd>ESC</kbd><button className="icon-button tiny-button" onClick={() => setSearchOpen(false)} title="Close search"><X size={15}/></button></div><div className="search-results-label">RECENT CHATS</div>{visibleProjects.map((project) => <button key={project.id} className="search-result" onClick={() => { selectProject(project); setSearchOpen(false) }}><MessageSquarePlus size={14}/><span>{project.title}</span><span className="search-result-time">{project.updated}</span><ChevronRight size={14}/></button>)}{visibleProjects.length === 0 && <p className="search-empty">No matching chats. Try a different search.</p>}<div className="search-modal-footer"><span><kbd>↵</kbd> to select</span><span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span><span><kbd>esc</kbd> to close</span></div></section></div>}
      {toast && <div className="toast" role="status"><span className="toast-check"><Check size={13}/></span>{toast.message}<button className="icon-button tiny-button" title="Dismiss notification" onClick={() => setToast(null)}><X size={13}/></button></div>}
    </main>
  )
}

function DeviceIcon({ device }: { device: Device }) {
  return device === 'desktop' ? <span className="desktop-glyph"/> : device === 'tablet' ? <span className="tablet-glyph"/> : <span className="mobile-glyph"/>
}

function Storefront({ title, editorial, dark, portfolio, cartCount, onAddToCart }: { title: string; editorial: boolean; dark: boolean; portfolio: boolean; cartCount: number; onAddToCart: () => void }) {
  const products = portfolio
    ? [{ name: 'Forma vase no. 04', kind: 'STONEWARE · 2024', price: '$128', image: 'vase' }, { name: 'Soft form bowl', kind: 'GLAZED CERAMIC', price: '$86', image: 'bowl' }, { name: 'Study in clay', kind: 'LIMITED EDITION', price: '$240', image: 'sculpture' }]
    : [{ name: 'The Daily Ritual', kind: 'BESTSELLER · 3 ITEMS', price: '$68', image: 'serum' }, { name: 'Cloud Cream', kind: 'NOURISHING MOISTURIZER', price: '$42', image: 'cream' }, { name: 'Night Shift', kind: 'OVERNIGHT RENEWAL', price: '$56', image: 'dropper' }]
  return <article className={`storefront ${dark ? 'storefront-dark' : ''} ${editorial ? 'storefront-editorial' : ''} ${portfolio ? 'storefront-portfolio' : ''}`}>
    <nav className="store-nav"><button className="store-menu-button" title="Open navigation"><span/><span/></button><a className="store-logo" href="#store">{portfolio ? 'F O R M A' : 'lumina'}</a><div className="store-links"><a href="#shop">Shop</a><a href="#story">Our story</a><a href="#journal">Journal</a></div><div className="store-nav-right"><button className="store-search" title="Search"><Search size={15}/></button><button className="bag-button" onClick={onAddToCart}>Bag <span>{cartCount.toString().padStart(2, '0')}</span></button></div></nav>
    <section className="store-hero"><div className="hero-copy"><span className="hero-kicker"><i/> {portfolio ? 'HANDMADE IN BROOKLYN' : 'SKINCARE, SIMPLIFIED'}</span><h2>{title.split('\n').map((line, index) => <span key={line}>{line}{index === 0 && <br/>}</span>)}</h2><p>{portfolio ? 'Objects shaped slowly, made to be lived with, and loved for a long, long time.' : 'Thoughtful formulas. Honest ingredients. A little more ritual in your everyday.'}</p><a className="hero-cta" href="#products">{portfolio ? 'Explore the collection' : 'Find your ritual'}<ArrowRight size={14}/></a><span className="hero-index">01 <i/> 03</span></div><div className={`hero-image ${portfolio ? 'hero-image-vase' : ''}`}><div className="sun-disc"/><div className="hero-product"><div className="product-cap"/><div className="product-bottle"><span className="bottle-brand">{portfolio ? 'FORMA' : 'l u m i n a'}</span><span className="bottle-name">{portfolio ? 'object\n04' : 'BOTANICAL\nFACE OIL'}</span><span className="bottle-volume">{portfolio ? 'STONEWARE · 2024' : '30 ML / 1 FL OZ'}</span></div><div className="bottle-shadow"/></div><div className="hero-image-label">{portfolio ? 'A study in form, nº 04' : 'Plant-powered. People-approved.'}</div><span className="image-sparkle sparkle-one">✳</span><span className="image-sparkle sparkle-two">✳</span></div></section>
    <section id="products" className="products-section"><div className="products-heading"><div><span className="section-eyebrow">THE SHORT LIST</span><h3>{portfolio ? 'Made to keep.' : 'The everyday essentials.'}</h3></div><a href="#all-products">Shop all <ArrowRight size={13}/></a></div><div className="product-grid">{products.map((product, index) => <article className="product-card" key={product.name}><button className={`product-image product-image-${product.image}`} onClick={onAddToCart} aria-label={`Add ${product.name} to bag`}><div className="still-life"><span className="product-vessel"/><span className="product-vessel-label">{portfolio ? 'F' : 'L'}</span><span className="still-life-orb"/></div><span className="product-badge">{index === 0 ? (portfolio ? 'ONE OF A KIND' : 'BESTSELLER') : 'JUST FOR YOU'}</span><span className="quick-add"><Plus size={14}/></span></button><div className="product-details"><div><span className="product-kind">{product.kind}</span><h4>{product.name}</h4></div><span className="product-price">{product.price}</span></div></article>)}</div></section>
    <footer className="store-footer"><span>Good things, made with care.</span><span>© 2025 {portfolio ? 'FORMA STUDIO' : 'LUMINA SKIN'}</span></footer>
  </article>
}

function CodePanel({ isPortfolio }: { isPortfolio: boolean }) {
  const lines = isPortfolio
    ? ['import { ArrowRight } from "lucide-react"', '', 'export default function FormaStudio() {', '  return (', '    <main className="studio">', '      <Navigation />', '      <section className="hero">', '        <p>HANDMADE IN BROOKLYN</p>', '        <h1>Objects for the everyday.</h1>', '        <p>Objects shaped slowly, made to be lived with.', '      </section>', '      <ProductCollection />', '    </main>', '  )', '}']
    : ['import { ArrowRight } from "lucide-react"', '', 'export default function LuminaStore() {', '  return (', '    <main className="storefront">', '      <Navigation />', '      <section className="hero">', '        <p>SKINCARE, SIMPLIFIED</p>', '        <h1>Care for the skin you’re in.</h1>', '        <p>Thoughtful formulas. Honest ingredients.', '        <a href="#shop">Find your ritual <ArrowRight /></a>', '      </section>', '      <ProductCollection title="The everyday essentials" />', '    </main>', '  )', '}']
  return <div className="code-panel"><div className="code-panel-tab"><FileCode2 size={13}/><span>page.tsx</span><button title="Copy code"><Copy size={13}/></button></div><pre>{lines.map((line, index) => <span key={`${index}-${line}`} className="code-line"><i>{String(index + 1).padStart(2, '0')}</i><code className={line.trim().startsWith('import') ? 'syntax-import' : line.includes('return') || line.trim().startsWith('export') ? 'syntax-keyword' : line.includes('"') || line.includes('\'') ? 'syntax-string' : ''}>{line || ' '}</code></span>)}</pre><div className="code-panel-hint"><span className="status-dot"/> Your code is ready to edit</div></div>
}

export default App

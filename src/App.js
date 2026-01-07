import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Mail, Github, Linkedin, Sun, Moon, Cloud, 
  CloudRain, CloudSnow, Sunrise, ArrowLeft, ChevronDown 
} from 'lucide-react';

// This is the file that contains all your articles
import postsData from './data/posts.json';

const WeatherEffect = ({ theme, type }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (type === 'none') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();
    const particles = [];
    const count = 120;
    const createParticle = () => {
      if (type === 'rain') return { x: Math.random() * canvas.width, y: Math.random() * canvas.height, length: Math.random() * 20 + 10, speed: Math.random() * 10 + 7, opacity: Math.random() * 0.3 + 0.1 };
      if (type === 'snow') return { x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 3 + 1, speed: Math.random() * 1 + 0.5, wind: Math.random() * 1 - 0.5, opacity: Math.random() * 0.5 + 0.2 };
      return null;
    };
    for (let i = 0; i < count; i++) { const p = createParticle(); if (p) particles.push(p); }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let color = theme === 'dark' ? '255, 255, 255' : theme === 'sunset' ? '139, 92, 246' : '0, 0, 0';
      particles.forEach(p => {
        ctx.beginPath();
        if (type === 'rain') {
          ctx.strokeStyle = `rgba(${color}, ${p.opacity})`;
          ctx.lineWidth = 1; ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y + p.length); ctx.stroke();
          p.y += p.speed; if (p.y > canvas.height) p.y = -p.length;
        } else if (type === 'snow') {
          ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
          p.y += p.speed; p.x += p.wind + Math.sin(p.y / 50) * 0.5;
          if (p.y > canvas.height) p.y = -p.radius;
          if (p.x > canvas.width) p.x = 0; if (p.x < 0) p.x = canvas.width;
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, [theme, type]);
  return type === 'none' ? null : <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
};

const Navbar = ({ activePage, setActivePage, theme }) => {
  const [isWanderOpen, setIsWanderOpen] = useState(false);
  const dropdownRef = useRef(null);
  const wanderLinks = ["current projects", "film log", "sports datasets", "tools i use", "favorite quotes", "things i believe", "reading list", "good media", "encrypted contact", "how this is built"];
  
  useEffect(() => {
    const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsWanderOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTextColor = (id) => activePage === id ? (theme === 'dark' ? 'text-white underline decoration-slate-300' : theme === 'sunset' ? 'text-[#4a3733] underline decoration-orange-300' : 'text-slate-900 underline decoration-slate-300') : (theme === 'sunset' ? 'text-[#8c746f] hover:text-[#4a3733]' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white');

  return (
    <nav className="flex items-center relative z-50 gap-x-4 md:gap-x-8">
      {['home', 'about', 'blog', 'now'].map((id) => (
        <button key={id} onClick={() => { setActivePage(id); setIsWanderOpen(false); }} className={`text-sm tracking-tight font-medium underline-offset-4 transition-all ${id === 'home' ? (theme === 'dark' ? 'text-white font-bold' : theme === 'sunset' ? 'text-[#4a3733] font-bold' : 'text-slate-900 font-bold') : getTextColor(id)}`}>
          {id === 'home' ? 'aarush pathuri' : id}
        </button>
      ))}
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setIsWanderOpen(!isWanderOpen)} className={`text-sm tracking-tight font-medium flex items-center gap-1 ${getTextColor('wander')}`}>
          wander <ChevronDown size={14} className={`transition-transform ${isWanderOpen ? 'rotate-180' : ''}`} />
        </button>
        {isWanderOpen && (
          <div className={`absolute left-0 mt-2 w-48 rounded-xl shadow-xl border p-2 backdrop-blur-md animate-in fade-in zoom-in-95 ${theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : theme === 'sunset' ? 'bg-[#fffcf0]/90 border-orange-100' : 'bg-white/90 border-slate-200'}`}>
            {wanderLinks.map((link, idx) => (
              <button key={idx} onClick={() => { setActivePage('wander-placeholder'); setIsWanderOpen(false); }} className={`w-full text-left px-3 py-2 text-xs rounded-lg ${theme === 'sunset' ? 'text-[#8c746f] hover:bg-orange-50 hover:text-[#4a3733]' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white'}`}>{link}</button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

const WritingItem = ({ date, title, readTime, description, theme, onClick }) => (
  <div className="group mb-4 cursor-pointer" onClick={onClick}>
    <div className="flex items-baseline gap-x-4 mb-0.5">
      <span className={`text-[10px] uppercase tracking-widest font-mono ${theme === 'sunset' ? 'text-orange-400' : 'text-slate-400'}`}>{date}</span>
      <span className={`text-[10px] uppercase tracking-widest font-mono ${theme === 'sunset' ? 'text-pink-300' : 'text-slate-300 dark:text-slate-600'}`}>{readTime}</span>
    </div>
    <h3 className={`text-lg font-medium transition-colors ${theme === 'sunset' ? 'text-[#4a3733] group-hover:text-orange-600' : 'text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>{title}</h3>
    <p className={`text-sm leading-snug mt-0.5 max-w-xl ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-500 dark:text-slate-400'}`}>{description}</p>
  </div>
);

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [theme, setTheme] = useState('light');
  const [weatherType, setWeatherType] = useState('none');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const cycleTheme = () => { const themes = ['light', 'sunset', 'dark']; setTheme(themes[(themes.indexOf(theme) + 1) % themes.length]); };
  const cycleWeather = () => { const types = ['none', 'rain', 'snow']; setWeatherType(types[(types.indexOf(weatherType) + 1) % types.length]); };
  const getThemeStyles = () => theme === 'dark' ? 'bg-[#0a0a0a] text-slate-300' : theme === 'sunset' ? 'bg-gradient-to-b from-[#fffcf0] via-[#fdf2f0] to-[#fce4ec] text-[#4a3733]' : 'bg-[#fcfaf2] text-slate-700';

  const renderPage = () => {
    if (activePage === 'article' && selectedPost) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-2xl relative z-10">
          <button onClick={() => setActivePage('home')} className="flex items-center gap-2 text-xs uppercase tracking-widest font-mono mb-4 hover:gap-3 transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white"><ArrowLeft size={14} /> back</button>
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest font-mono text-slate-400 block mb-1">{selectedPost.date} — {selectedPost.readTime}</span>
            <h1 className="text-3xl font-semibold tracking-tighter mb-2 leading-tight">{selectedPost.title}</h1>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap font-serif text-[18px] text-slate-700 dark:text-slate-300 selection:bg-orange-100">{selectedPost.content}</div>
        </div>
      );
    }
    switch(activePage) {
      case 'about': return <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-2xl text-lg font-serif italic leading-relaxed">I’m Aarush. I find myself at the crossroads of competition and calculation. For me, sports aren't just a pastime: they're a puzzle. I focus on sports analytics and the mechanics of impact beyond raw box scores.</div>;
      case 'blog': return <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">{postsData.map((p, i) => <WritingItem key={i} {...p} theme={theme} onClick={() => { setSelectedPost(p); setActivePage('article'); }} />)}</div>;
      case 'now': return <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-2xl text-lg font-serif">Currently refining predictive models for the NBA season, digging into sports datasets, and observing the changing patterns in the weather.</div>;
      case 'wander-placeholder': return <div className="py-8 text-center italic text-slate-400">idk i havent made it this far yet</div>;
      default: return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <section className="mb-8">
            <h1 className={`text-4xl md:text-5xl font-semibold tracking-tighter mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>aarush pathuri</h1>
            <p className="text-lg font-serif italic text-slate-600 dark:text-slate-400">exploring the intersection of data, competition, and storytelling.</p>
          </section>
          <section className="mb-8">
            <div className="flex justify-between items-center border-b pb-1 mb-4 border-slate-200 dark:border-slate-800">
              <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400">writing</h2>
              <button onClick={() => setActivePage('blog')} className="text-xs flex items-center gap-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">view all <ArrowRight size={12} /></button>
            </div>
            {postsData.slice(0, 3).map((p, i) => <WritingItem key={i} {...p} theme={theme} onClick={() => { setSelectedPost(p); setActivePage('article'); }} />)}
          </section>
          <section>
            <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 border-b pb-1 mb-4 border-slate-200 dark:border-slate-800">elsewhere</h2>
            <div className="flex gap-8">
              <a href="mailto:aarushvpathuri2807@gmail.com" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors"><Mail size={16} /> email</a>
              <a href="https://github.com/aarush2807" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors"><Github size={16} /> github</a>
              <a href="https://www.linkedin.com/in/aarush-pathuri-b943b0265/" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors"><Linkedin size={16} /> linkedin</a>
            </div>
          </section>
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${getThemeStyles()}`}>
      <WeatherEffect theme={theme} type={weatherType} />
      <div className="max-w-3xl mx-auto px-6 py-4 md:py-8 relative z-10">
        <header className="flex items-center justify-between mb-6 md:mb-8">
          <Navbar activePage={activePage} setActivePage={setActivePage} theme={theme} />
          <div className="flex items-center gap-2">
            <button onClick={cycleWeather} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Toggle Weather"><Cloud size={18} /></button>
            <button onClick={cycleTheme} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Cycle Theme">{theme === 'light' ? <Sun size={18} /> : theme === 'sunset' ? <Sunrise size={18} /> : <Moon size={18} />}</button>
          </div>
        </header>
        <main className="min-h-[50vh]">{renderPage()}</main>
        <footer className="mt-12 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[10px] uppercase tracking-widest font-mono text-slate-400">
          <span>bloomington, 2026</span>
          <span className="hidden md:inline text-[9px] opacity-40">built with sports analytics intent</span>
          <span>updated jan 2026</span>
        </footer>
      </div>
    </div>
  );
};

export default App;

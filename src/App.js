import React, { useState, useEffect, useRef } from 'react';
import { 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  useLocation, 
  useParams 
} from 'react-router-dom';
import { 
  ArrowRight, 
  Mail, 
  Github, 
  Linkedin, 
  MapPin, 
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Sunrise,
  ArrowLeft,
  ChevronDown,
  Star,
  StarHalf,
  ExternalLink,
} from 'lucide-react';

import posts from './posts.json';
import films from './films.json';

// --- Custom Markdown Renderer ---

const MarkdownRenderer = ({ content, theme }) => {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-6">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
          const language = match ? match[1] : '';
          const code = match ? match[2] : part.slice(3, -3);

          return (
            <div key={index} className="relative rounded-lg overflow-hidden my-6 text-sm">
              <div className={`px-4 py-2 text-xs font-mono uppercase tracking-wider ${
                theme === 'dark' ? 'bg-slate-800 text-slate-400' : 
                theme === 'sunset' ? 'bg-[#eaddd7] text-[#6d5a56]' : 
                'bg-slate-200 text-slate-500'
              }`}>
                <span>{language || 'text'}</span>
              </div>
              <div className={`overflow-x-auto p-4 font-mono leading-relaxed ${
                theme === 'dark' ? 'bg-[#1e1e1e] text-blue-200' : 
                theme === 'sunset' ? 'bg-[#fff8f0] border border-orange-100 text-[#5c4a45]' : 
                'bg-slate-50 text-slate-800 border border-slate-200'
              }`}>
                <pre className="m-0 whitespace-pre">{code}</pre>
              </div>
            </div>
          );
        } else {
          const blocks = part.split(/\n\n/);
          return blocks.map((block, i) => {
            if (!block.trim()) return null;

            if (block.startsWith('### ')) {
              return (
                <h3 key={`${index}-${i}`} className={`text-xl font-semibold mt-8 mb-4 tracking-tight ${
                  theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-900 dark:text-white'
                }`}>
                  {block.replace('### ', '')}
                </h3>
              );
            }

            const parseInline = (text) => {
              const regex = /(\*\*.*?\*\*|`.*?`)/g;
              const inlineParts = text.split(regex);

              return inlineParts.map((segment, j) => {
                if (segment.startsWith('**') && segment.endsWith('**')) {
                  return (
                    <strong key={j} className={`font-bold ${theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-900 dark:text-white'}`}>
                      {segment.slice(2, -2)}
                    </strong>
                  );
                }
                if (segment.startsWith('`') && segment.endsWith('`')) {
                  return (
                    <code key={j} className={`px-1.5 py-0.5 rounded text-sm font-mono ${
                      theme === 'dark' ? 'bg-slate-800 text-blue-300' : 
                      theme === 'sunset' ? 'bg-orange-100 text-[#4a3733]' : 
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {segment.slice(1, -1)}
                    </code>
                  );
                }
                return segment;
              });
            };

            return (
              <p key={`${index}-${i}`} className={`text-base leading-relaxed mb-4 font-normal ${
                theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-600 dark:text-slate-400'
              }`}>
                {parseInline(block)}
              </p>
            );
          });
        }
      })}
    </div>
  );
};

// --- Helper Components ---

const RatingStars = ({ rating, theme }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  return (
    <div className="flex gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} size={12} fill="currentColor" className={theme === 'sunset' ? 'text-orange-400' : 'text-slate-900 dark:text-white'} />
      ))}
      {hasHalfStar && <StarHalf size={12} fill="currentColor" className={theme === 'sunset' ? 'text-orange-400' : 'text-slate-900 dark:text-white'} />}
    </div>
  );
};

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
    for (let i = 0; i < 160; i++) {
      particles.push(type === 'rain' ? {
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        length: Math.random() * 22 + 12, speed: Math.random() * 10 + 8,
        opacity: Math.random() * 0.4 + 0.2, hue: Math.random() * 360
      } : {
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        radius: Math.random() * 3.5 + 1.5, speed: Math.random() * 1.2 + 0.6,
        wind: Math.random() * 1.2 - 0.6, opacity: Math.random() * 0.6 + 0.4
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        if (type === 'rain') {
          ctx.strokeStyle = theme === 'sunset' ? `hsla(${p.hue}, 70%, 75%, ${p.opacity})` : `rgba(${theme === 'dark' ? '255,255,255' : '0,0,0'}, ${p.opacity})`;
          ctx.lineWidth = 1.5; ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y + p.length); ctx.stroke();
          p.y += p.speed; if (p.y > canvas.height) p.y = -p.length;
        } else {
          ctx.fillStyle = `rgba(${theme === 'dark' ? '255,255,255' : theme === 'sunset' ? '139,92,246' : '0,0,0'}, ${p.opacity})`;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
          p.y += p.speed; p.x += p.wind + Math.sin(p.y / 50) * 0.5;
          if (p.y > canvas.height) p.y = -p.radius;
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, [theme, type]);
  return type === 'none' ? null : <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
};

const WritingItem = ({ id, date, title, readTime, description, theme }) => (
  <Link to={`/blog/${id}`} className="block group mb-10">
    <div className="flex items-baseline gap-x-4 mb-2">
      <span className={`text-[10px] uppercase tracking-widest font-mono font-medium ${theme === 'sunset' ? 'text-orange-400' : 'text-slate-400'}`}>{date}</span>
      {readTime && <span className={`text-[10px] uppercase tracking-widest font-mono ${theme === 'sunset' ? 'text-pink-300' : 'text-slate-300 dark:text-slate-600'}`}>{readTime}</span>}
    </div>
    <h3 className={`text-lg font-medium transition-colors mb-2 ${theme === 'sunset' ? 'text-[#4a3733] group-hover:text-orange-600' : 'text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>{title}</h3>
    <p className={`text-sm leading-relaxed max-w-xl ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-500 dark:text-slate-400'}`}>{description}</p>
  </Link>
);

const Navbar = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const wanderLinks = [
    { label: "current projects", path: "/wander" }, { label: "film log", path: "/films" },
    { label: "sports datasets", path: "/wander" }, { label: "tools i use", path: "/wander" },
    { label: "favorite quotes", path: "/wander" }, { label: "reading list", path: "/wander" }
  ];
  useEffect(() => {
    const click = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", click); return () => document.removeEventListener("mousedown", click);
  }, []);
  const navItems = [
    { label: 'aarush pathuri', path: '/', brand: true }, { label: 'about', path: '/about' },
    { label: 'blog', path: '/blog' }, { label: 'now', path: '/now' },
  ];
  return (
    <nav className="flex items-center relative z-50">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className={`text-sm tracking-tight transition-colors font-medium ${item.brand ? (theme === 'dark' ? 'text-white' : theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-900') : (location.pathname === item.path ? 'underline' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white')}`}>
            {item.label}
          </Link>
        ))}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsOpen(!isOpen)} className="text-sm tracking-tight font-medium flex items-center gap-1 text-slate-500 hover:text-slate-900">
            wander <ChevronDown size={14} className={isOpen ? 'rotate-180' : ''} />
          </button>
          {isOpen && (
            <div className={`absolute left-0 mt-2 w-48 rounded-xl shadow-xl border p-2 backdrop-blur-md ${theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
              {wanderLinks.map((l) => <Link key={l.label} to={l.path} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">{l.label}</Link>)}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const Home = ({ theme, posts }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 z-10 relative">
    <section className="mb-12">
      <h1 className={`text-4xl md:text-5xl font-semibold tracking-tighter mb-4 ${theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-900 dark:text-white'}`}>aarush pathuri</h1>
      <p className={`text-lg leading-relaxed max-w-2xl italic font-serif ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-600 dark:text-slate-300'}`}>exploring the intersection of data, competition, and storytelling.</p>
    </section>
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-2">
        <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400">writing</h2>
        <Link to="/blog" className="text-xs text-slate-400 hover:text-slate-900 flex items-center gap-1">view all <ArrowRight size={12}/></Link>
      </div>
      {posts?.slice(0, 3).map((p) => <WritingItem key={p.id} {...p} theme={theme} />)}
    </section>
  </div>
);

const Article = ({ theme, posts }) => {
  const { id } = useParams();
  const post = posts.find(p => p.id === id);
  if (!post) return <div className="py-20 text-center">Post not found.</div>;
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-2xl z-10 relative">
      <Link to="/blog" className="flex items-center gap-2 text-xs uppercase tracking-widest font-mono mb-8 text-slate-400"><ArrowLeft size={14} /> back</Link>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter mb-8">{post.title}</h1>
      <MarkdownRenderer content={post.content} theme={theme} />
    </div>
  );
};

const About = ({ theme }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-2xl relative z-10">
    <h2 className="text-2xl font-semibold mb-6">about</h2>
    <p className="leading-relaxed text-slate-600 dark:text-slate-400">I’m Aarush. I find myself at the crossroads of competition and calculation.</p>
  </div>
);

const Now = ({ theme }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-2xl relative z-10">
    <h2 className="text-2xl font-semibold mb-6">what i'm doing now</h2>
    <p className="text-slate-600 dark:text-slate-400">Developing custom dashboards and catching up on movies.</p>
  </div>
);

export default function App() {
  const [theme, setTheme] = useState('light');
  const [weather, setWeather] = useState('none');
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    root.style.backgroundColor = theme === 'dark' ? '#0a0a0a' : theme === 'sunset' ? '#fffcf0' : '#fcfaf2';
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  }, [theme]);

  useEffect(() => window.scrollTo(0, 0), [location.pathname]);

  const cycleTheme = () => setTheme(['light', 'sunset', 'dark'][(['light', 'sunset', 'dark'].indexOf(theme) + 1) % 3]);
  const cycleWeather = () => setWeather(['none', 'rain', 'snow'][(['none', 'rain', 'snow'].indexOf(weather) + 1) % 3]);

  return (
    <div className={`min-h-screen transition-all duration-700 ${theme === 'dark' ? 'bg-[#0a0a0a] text-slate-300' : theme === 'sunset' ? 'bg-[#fffcf0] text-[#4a3733]' : 'bg-[#fcfaf2] text-slate-700'}`}>
      <WeatherEffect theme={theme} type={weather} />
      <div className="max-w-3xl mx-auto px-6 py-10 relative z-10">
        <header className="flex items-center justify-between mb-12">
          <Navbar theme={theme} />
          <div className="flex gap-2">
            <button onClick={cycleWeather} className="p-2 text-slate-400 hover:text-slate-900">{weather === 'none' ? <Cloud size={18}/> : weather === 'rain' ? <CloudRain size={18}/> : <CloudSnow size={18}/>}</button>
            <button onClick={cycleTheme} className="p-2 text-slate-400 hover:text-slate-900">{theme === 'light' ? <Sun size={18}/> : theme === 'sunset' ? <Sunrise size={18}/> : <Moon size={18}/>}</button>
          </div>
        </header>
        <main><Routes>
          <Route path="/" element={<Home theme={theme} posts={posts} />} />
          <Route path="/about" element={<About theme={theme} />} />
          <Route path="/blog" element={<div className="animate-in fade-in slide-in-from-bottom-2 duration-700 z-10 relative"><h2 className="text-2xl font-semibold mb-10">writing</h2>{posts?.map(p => <WritingItem key={p.id} {...p} theme={theme} />)}</div>} />
          <Route path="/blog/:id" element={<Article theme={theme} posts={posts} />} />
          <Route path="/now" element={<Now theme={theme} />} />
          <Route path="/films" element={<div className="animate-in fade-in slide-in-from-bottom-2 duration-700 z-10 relative"><h2 className="text-2xl font-semibold mb-10">film log</h2>{films.map(f => (
            <div key={f.id} className="flex gap-6 mb-12 group">
              <img src={f.image} alt={f.title} className="w-24 h-36 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div><div className="flex items-center gap-3 mb-2"><h3 className="font-medium">{f.title}</h3><span className="text-xs text-slate-400">{f.year}</span><RatingStars rating={f.rating} theme={theme} /></div><p className="text-sm text-slate-500 leading-relaxed">{f.review}</p></div>
            </div>
          ))}</div>} />
          <Route path="/wander" element={<div className="flex h-[30vh] items-center justify-center italic">idk i havent made it this far yet</div>} />
        </Routes></main>
        <footer className="mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[11px] uppercase tracking-widest font-mono text-slate-400">
          <div className="flex gap-6"><span>colophon</span><span className="opacity-50">rss</span></div>
          <span className="flex items-center gap-1"><MapPin size={10} /> bloomington, 2026</span>
        </footer>
      </div>
    </div>
  );
}

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
            <div key={index} className="relative group rounded-lg overflow-hidden my-6 text-sm">
              <div className={`flex items-center justify-between px-4 py-2 text-xs font-mono uppercase tracking-wider ${
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
                <pre style={{ margin: 0 }}>
                  {code}
                </pre>
              </div>
            </div>
          );
        } else {
          return part.split('\n\n').map((block, i) => {
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
              const segments = text.split(regex);
              return segments.map((segment, j) => {
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
              <p key={`${index}-${i}`} className={`leading-relaxed mb-4 text-base font-normal ${
                theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-600 dark:text-slate-300'
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

    const resize = () => { 
      canvas.width = window.innerWidth; 
      canvas.height = window.innerHeight; 
    };
    
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const count = 160;

    const createParticle = () => {
      if (type === 'rain') {
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          length: Math.random() * 22 + 12,
          speed: Math.random() * 10 + 8,
          opacity: Math.random() * 0.4 + 0.2,
          hue: Math.random() * 360
        };
      } else if (type === 'snow') {
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3.5 + 1.5,
          speed: Math.random() * 1.2 + 0.6,
          wind: Math.random() * 1.2 - 0.6,
          opacity: Math.random() * 0.6 + 0.4
        };
      }
      return null;
    };

    for (let i = 0; i < count; i++) {
      const p = createParticle();
      if (p) particles.push(p);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.beginPath();
        if (type === 'rain') {
          if (theme === 'sunset') {
            ctx.strokeStyle = `hsla(${p.hue}, 70%, 75%, ${p.opacity})`;
          } else {
            const color = theme === 'dark' ? '255, 255, 255' : '0, 0, 0';
            ctx.strokeStyle = `rgba(${color}, ${p.opacity})`;
          }
          ctx.lineWidth = 1.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + p.length);
          ctx.stroke();
          p.y += p.speed;
          if (p.y > canvas.height) p.y = -p.length;
        } else if (type === 'snow') {
          const color = theme === 'dark' ? '255, 255, 255' : theme === 'sunset' ? '139, 92, 246' : '0, 0, 0';
          ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          p.y += p.speed;
          p.x += p.wind + Math.sin(p.y / 50) * 0.5;
          if (p.y > canvas.height) p.y = -p.radius;
          if (p.x > canvas.width) p.x = 0;
          if (p.x < 0) p.x = canvas.width;
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => { 
      window.removeEventListener('resize', resize); 
      cancelAnimationFrame(animationFrameId); 
    };
  }, [theme, type]);

  if (type === 'none') return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-65" />;
};

const WritingItem = ({ id, date, title, readTime, description, theme }) => (
  <Link to={`/blog/${id}`} className="block group mb-10">
    <div className="flex items-baseline gap-x-4 mb-2">
      <span className={`text-[10px] uppercase tracking-widest font-medium font-mono ${theme === 'sunset' ? 'text-orange-400' : 'text-slate-400'}`}>
        {date}
      </span>
      {readTime && (
        <span className={`text-[10px] uppercase tracking-widest font-mono ${theme === 'sunset' ? 'text-pink-300' : 'text-slate-300 dark:text-slate-600'}`}>
          {readTime}
        </span>
      )}
    </div>
    <h3 className={`text-lg font-medium transition-colors mb-2 ${theme === 'sunset' ? 'text-[#4a3733] group-hover:text-orange-600' : 'text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
      {title}
    </h3>
    <p className={`text-sm leading-relaxed max-w-xl ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-500 dark:text-slate-400'}`}>
      {description}
    </p>
  </Link>
);

const Navbar = ({ theme }) => {
  const [isWanderOpen, setIsWanderOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const wanderLinks = [
    { label: "current projects", path: "/wander" },
    { label: "film log", path: "/films" },
    { label: "sports datasets", path: "/wander" },
    { label: "tools i use", path: "/wander" },
    { label: "favorite quotes", path: "/wander" },
    { label: "reading list", path: "/wander" },
    { label: "encrypted contact", path: "/wander" }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsWanderOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'aarush pathuri', path: '/', brand: true },
    { id: 'about', label: 'about', path: '/about' },
    { id: 'blog', label: 'blog', path: '/blog' },
    { id: 'now', label: 'now', path: '/now' },
  ];

  return (
    <nav className="flex items-center relative z-50">
      <div className="flex flex-wrap items-center gap-x-5 md:gap-x-6 gap-y-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`text-sm tracking-tight transition-colors duration-200 font-medium underline-offset-4 ${
              item.brand 
                ? theme === 'dark' ? 'text-white' : theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-900'
                : location.pathname === item.path 
                  ? (theme === 'dark' ? 'text-white underline' : theme === 'sunset' ? 'text-[#4a3733] underline' : 'text-slate-900 underline')
                  : theme === 'sunset' ? 'text-[#8c746f] hover:text-[#4a3733]' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsWanderOpen(!isWanderOpen)} className={`text-sm tracking-tight transition-colors duration-200 font-medium flex items-center gap-1 ${theme === 'sunset' ? 'text-[#8c746f] hover:text-[#4a3733]' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
            wander <ChevronDown size={14} className={`transition-transform duration-200 ${isWanderOpen ? 'rotate-180' : ''}`} />
          </button>
          {isWanderOpen && (
            <div className={`absolute left-0 mt-2 w-48 rounded-xl shadow-xl border p-2 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : theme === 'sunset' ? 'bg-[#fffcf0]/90 border-orange-100' : 'bg-white/90 border-slate-200'}`}>
              {wanderLinks.map((item, idx) => (
                <Link key={idx} to={item.path} onClick={() => setIsWanderOpen(false)} className={`block px-3 py-2 text-xs rounded-lg transition-colors ${theme === 'sunset' ? 'text-[#8c746f] hover:bg-orange-50 hover:text-[#4a3733]' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white'}`}>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// --- Pages ---

const Colophon = ({ theme }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 relative z-10 max-w-2xl">
    <h2 className={`text-2xl font-semibold mb-6 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>colophon</h2>
    <div className={`space-y-8 leading-relaxed ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-600 dark:text-slate-400'}`}>
      <section>
        <h3 className={`text-sm uppercase tracking-widest font-bold mb-3 ${theme === 'sunset' ? 'text-orange-400' : 'text-slate-400'}`}>tech stack</h3>
        <p className="text-sm">This project is built using React for the user interface and Tailwind CSS for styling. I chose React for its component-based architecture, which allows for clean state management across the different themes and weather effects.</p>
      </section>
      <section>
        <h3 className={`text-sm uppercase tracking-widest font-bold mb-3 ${theme === 'sunset' ? 'text-orange-400' : 'text-slate-400'}`}>deployment</h3>
        <p className="text-sm">The site is hosted on Vercel. It is continuously deployed from a GitHub repository, ensuring that every push to the main branch is instantly live. This setup provides a fast, edge-cached experience worldwide.</p>
        <a href="[https://github.com/aarush2807/aarushpathuri-dev](https://github.com/aarush2807/aarushpathuri-dev)" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-xs font-mono hover:underline">
          <Github size={14} /> View on GitHub <ExternalLink size={10} className="opacity-50" />
        </a>
      </section>
      <section>
        <h3 className={`text-sm uppercase tracking-widest font-bold mb-3 ${theme === 'sunset' ? 'text-orange-400' : 'text-slate-400'}`}>privacy</h3>
        <p className="text-sm">No tracking. No cookies. No analytics. This website is a strictly static experience. I don't collect your data, I don't know who you are, and I prefer it that way. The "no tracking" badge in the corner isn't just for show—it's a fundamental principle of how I build for the web.</p>
      </section>
      <section>
        <h3 className={`text-sm uppercase tracking-widest font-bold mb-3 ${theme === 'sunset' ? 'text-orange-400' : 'text-slate-400'}`}>features</h3>
        <p className="text-sm">Themes: The site features three modes—Light, Dark, and Sunset—designed to adapt to different environments and moods. Weather: The rain and snow effects are rendered on a custom HTML5 Canvas element. It's a lightweight particle system that runs in the background without affecting performance.</p>
      </section>
      <section>
        <h3 className={`text-sm uppercase tracking-widest font-bold mb-3 ${theme === 'sunset' ? 'text-orange-400' : 'text-slate-400'}`}>future goals</h3>
        <p className="text-sm">I plan to expand the "Wander" section with interactive sports datasets and specialized dashboards for NBA and NFL analysis. I also intend to integrate a more robust film archive as my log grows.</p>
      </section>
    </div>
  </div>
);

const Home = ({ theme, posts }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 relative z-10">
    <section className="mb-12">
      <h1 className={`text-4xl md:text-5xl font-semibold tracking-tighter mb-4 ${theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-900 dark:text-white'}`}>aarush pathuri</h1>
      <p className={`text-lg leading-relaxed max-w-2xl mb-3 italic font-serif ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-600 dark:text-slate-300'}`}>exploring the intersection of data, competition, and storytelling.</p>
    </section>
    <section className="mb-12">
      <div className={`flex items-center justify-between mb-8 border-b pb-2 ${theme === 'sunset' ? 'border-orange-100' : 'border-slate-200 dark:border-slate-800'}`}>
        <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400">writing</h2>
        <Link to="/blog" className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1">view all <ArrowRight className="w-3 h-3" /></Link>
      </div>
      <div>{posts?.slice(0, 3).map((post, idx) => <WritingItem key={idx} {...post} theme={theme} />)}</div>
    </section>
    <section className="mb-12">
      <h2 className={`text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-8 border-b pb-2 ${theme === 'sunset' ? 'border-orange-100' : 'border-slate-200 dark:border-slate-800'}`}>elsewhere</h2>
      <div className="flex flex-wrap gap-6">
        <Link to="/email" className={`flex items-center gap-2 text-sm transition-colors ${theme === 'sunset' ? 'text-[#8c746f] hover:text-orange-500' : 'text-slate-400 hover:text-blue-500'}`}><Mail className="w-4 h-4" /> email</Link>
        <a href="[https://github.com/aarush2807](https://github.com/aarush2807)" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm transition-colors ${theme === 'sunset' ? 'text-[#8c746f] hover:text-[#4a3733]' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}><Github className="w-4 h-4" /> github</a>
        <a href="[https://www.linkedin.com/in/aarush-pathuri-b943b0265/](https://www.linkedin.com/in/aarush-pathuri-b943b0265/)" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm transition-colors ${theme === 'sunset' ? 'text-[#8c746f] hover:text-blue-700' : 'text-slate-400 hover:text-blue-700'}`}><Linkedin className="w-4 h-4" /> linkedin</a>
      </div>
    </section>
  </div>
);

const Blog = ({ theme, posts }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 relative z-10">
    <h2 className="text-2xl font-semibold mb-10 tracking-tight">all writing</h2>
    <div className="space-y-4">{posts?.map((post, idx) => <WritingItem key={idx} {...post} theme={theme} />)}</div>
  </div>
);

const Article = ({ theme, posts }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find(p => p.id === id);
  if (!post) return <div className="py-20 text-center">Post not found.</div>;
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 relative z-10 max-w-2xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs uppercase tracking-widest font-mono mb-8 hover:gap-3 transition-all text-slate-400"><ArrowLeft size={14} /> back</button>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter mb-4">{post.title}</h1>
      </div>
      <div className="prose prose-slate dark:prose-invert max-w-none font-normal">
        <MarkdownRenderer content={post.content} theme={theme} />
      </div>
    </div>
  );
};

const FilmLog = ({ theme }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 relative z-10">
    <div className="mb-12">
      <h2 className={`text-2xl font-semibold mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>film log</h2>
      <p className={`text-sm font-serif italic ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-500'}`}>recent viewings and reflections.</p>
    </div>
    <div className="space-y-12">
      {films.map((film) => (
        <div key={film.id} className="flex flex-col md:flex-row gap-6 group">
          <div className="w-full md:w-32 aspect-[2/3] overflow-hidden rounded-lg bg-slate-200 relative shrink-0">
            <img src={film.image} alt={film.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" onError={(e) => { e.target.src = '[https://via.placeholder.com/200x300?text=No+Poster](https://via.placeholder.com/200x300?text=No+Poster)'; }} />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-x-3 mb-2">
              <h3 className={`text-lg font-medium ${theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-900 dark:text-white'}`}>{film.title}</h3>
              <span className="text-xs font-mono text-slate-400">{film.year}</span>
              <RatingStars rating={film.rating} theme={theme} />
            </div>
            <p className={`text-sm leading-relaxed max-w-xl ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-600 dark:text-slate-400'}`}>{film.review}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const About = ({ theme }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-2xl relative z-10">
    <h2 className="text-2xl font-semibold mb-6">about</h2>
    <p className="leading-relaxed text-slate-600 dark:text-slate-400">I’m Aarush. I find myself at the crossroads of competition and calculation. For me, sports aren't just a pastime: they're a puzzle.</p>
  </div>
);

const Now = ({ theme }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-2xl relative z-10">
    <h2 className="text-2xl font-semibold mb-6">what i'm doing now</h2>
    <p className="text-slate-600 dark:text-slate-400">Developing custom dashboards and catching up on movies.</p>
  </div>
);

const EmailPage = ({ theme }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-2xl relative z-10">
    <h2 className="text-2xl font-semibold mb-6 tracking-tight">contact</h2>
    <div className={`space-y-4 ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-600 dark:text-slate-400'}`}>
      <p className="leading-relaxed">
        For any questions or anything, just email:
      </p>
      <a 
        href="mailto:aarushvpathuri2807@gmail.com" 
        className={`text-lg font-medium underline underline-offset-4 transition-colors ${theme === 'sunset' ? 'text-orange-600 hover:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`}
      >
        aarushvpathuri2807@gmail.com
      </a>
    </div>
  </div>
);

const WanderPlaceholder = ({ theme }) => (
  <div className="flex flex-col items-center justify-center min-h-[30vh] text-center relative z-10">
    <p className="text-lg italic font-serif">idk i havent made it this far yet</p>
  </div>
);

export default function App() {
  const [theme, setTheme] = useState('light'); 
  const [weatherType, setWeatherType] = useState('none');
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.background = '#0a0a0a'; 
      body.style.background = '#0a0a0a';
      metaThemeColor.setAttribute('content', '#0a0a0a');
    } else if (theme === 'sunset') {
      root.classList.remove('dark');
      root.style.backgroundColor = '#fffcf0';
      root.style.backgroundImage = 'linear-gradient(to bottom, #fffcf0, #fdf2f0, #fce4ec)';
      body.style.background = 'transparent';
      metaThemeColor.setAttribute('content', '#fffcf0');
    } else {
      root.classList.remove('dark');
      root.style.background = '#fcfaf2';
      body.style.background = '#fcfaf2';
      metaThemeColor.setAttribute('content', '#fcfaf2');
    }
  }, [theme]);

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  const cycleTheme = () => {
    const themes = ['light', 'sunset', 'dark'];
    setTheme(themes[(themes.indexOf(theme) + 1) % themes.length]);
  };

  const cycleWeather = () => {
    const types = ['none', 'rain', 'snow'];
    setWeatherType(types[(types.indexOf(weatherType) + 1) % types.length]);
  };

  const getThemeStyles = () => {
    if (theme === 'dark') return 'bg-[#0a0a0a] text-slate-300';
    if (theme === 'sunset') return 'bg-gradient-to-b from-[#fffcf0] via-[#fdf2f0] to-[#fce4ec] text-[#4a3733]';
    return 'bg-[#fcfaf2] text-slate-700';
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${getThemeStyles()}`}>
      <WeatherEffect theme={theme} type={weatherType} />
      <div className="max-w-3xl mx-auto px-6 py-10 relative z-10">
        <header className="flex items-center justify-between mb-12">
          <Navbar theme={theme} />
          <div className="flex items-center gap-2">
            <button onClick={cycleWeather} className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-400">{weatherType === 'rain' ? <CloudRain size={18} /> : weatherType === 'snow' ? <CloudSnow size={18} /> : <Cloud size={18} />}</button>
            <button onClick={cycleTheme} className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-400">{theme === 'light' ? <Sun size={18} /> : theme === 'sunset' ? <Sunrise size={18} /> : <Moon size={18} />}</button>
          </div>
        </header>
        <main className="min-h-[50vh]">
          <Routes>
            <Route path="/" element={<Home theme={theme} posts={posts} />} />
            <Route path="/about" element={<About theme={theme} />} />
            <Route path="/blog" element={<Blog theme={theme} posts={posts} />} />
            <Route path="/blog/:id" element={<Article theme={theme} posts={posts} />} />
            <Route path="/now" element={<Now theme={theme} />} />
            <Route path="/films" element={<FilmLog theme={theme} />} />
            <Route path="/colophon" element={<Colophon theme={theme} />} />
            <Route path="/wander" element={<WanderPlaceholder theme={theme} />} />
            <Route path="/email" element={<EmailPage theme={theme} />} />
          </Routes>
        </main>
        <footer className={`mt-20 pt-8 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 ${theme === 'sunset' ? 'border-orange-100' : 'border-slate-200 dark:border-slate-800'}`}>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-widest font-mono text-slate-400">
            <Link to="/colophon" className="hover:text-slate-900 dark:hover:text-white transition-colors">colophon</Link>
            <span className="opacity-50">changelog</span>
            <span className="opacity-50">rss</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest font-mono text-slate-400">
            <span className="flex items-center gap-1"><MapPin size={10} /> bloomington, 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

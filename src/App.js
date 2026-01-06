import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Mail, 
  Github, 
  Twitter, 
  Linkedin, 
  Rss, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Sunrise,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';

// --- Components ---

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
    const count = 120;

    const createParticle = () => {
      if (type === 'rain') {
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          length: Math.random() * 20 + 10,
          speed: Math.random() * 10 + 7,
          opacity: Math.random() * 0.3 + 0.1
        };
      } else if (type === 'snow') {
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          speed: Math.random() * 1 + 0.5,
          wind: Math.random() * 1 - 0.5,
          opacity: Math.random() * 0.5 + 0.2
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
      
      let color = '0, 0, 0';
      if (theme === 'dark') color = '255, 255, 255';
      if (theme === 'sunset') color = '139, 92, 246';

      particles.forEach(p => {
        ctx.beginPath();
        if (type === 'rain') {
          ctx.strokeStyle = `rgba(${color}, ${p.opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + p.length);
          ctx.stroke();
          p.y += p.speed;
          if (p.y > canvas.height) p.y = -p.length;
        } else if (type === 'snow') {
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

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  );
};

const Navbar = ({ activePage, setActivePage, theme }) => {
  const [isWanderOpen, setIsWanderOpen] = useState(false);
  const dropdownRef = useRef(null);

  const wanderLinks = [
    "current projects", "film log", "sports datasets", "tools i use", 
    "favorite quotes", "things i believe", "reading list", "good media",
    "encrypted contact", "how this is built"
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsWanderOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'aarush pathuri', brand: true },
    { id: 'about', label: 'about' },
    { id: 'blog', label: 'blog' },
    { id: 'now', label: 'now' },
  ];

  const getTextColor = (itemId) => {
    if (activePage === itemId) {
       if (theme === 'dark') return 'text-white underline decoration-slate-300';
       if (theme === 'sunset') return 'text-[#4a3733] underline decoration-orange-300';
       return 'text-slate-900 underline decoration-slate-300';
    }
    return theme === 'sunset' ? 'text-[#8c746f] hover:text-[#4a3733]' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white';
  };

  return (
    <nav className="flex flex-wrap items-center justify-between mb-16 md:mb-24 relative z-50">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActivePage(item.id);
              setIsWanderOpen(false);
            }}
            className={`text-sm tracking-tight transition-colors duration-200 font-medium underline-offset-4 ${
              item.brand 
                ? theme === 'dark' ? 'text-white' : theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-900'
                : getTextColor(item.id)
            }`}
          >
            {item.label}
          </button>
        ))}
        
        {/* Wander Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsWanderOpen(!isWanderOpen)}
            className={`text-sm tracking-tight transition-colors duration-200 font-medium flex items-center gap-1 ${
              activePage === 'wander-placeholder' 
              ? (theme === 'dark' ? 'text-white underline' : theme === 'sunset' ? 'text-[#4a3733] underline' : 'text-slate-900 underline') 
              : (theme === 'sunset' ? 'text-[#8c746f] hover:text-[#4a3733]' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white')
            }`}
          >
            wander <ChevronDown size={14} className={`transition-transform duration-200 ${isWanderOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isWanderOpen && (
            <div className={`absolute left-0 mt-2 w-48 rounded-xl shadow-xl border p-2 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 ${
              theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : theme === 'sunset' ? 'bg-[#fffcf0]/90 border-orange-100' : 'bg-white/90 border-slate-200'
            }`}>
              {wanderLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActivePage('wander-placeholder');
                    setIsWanderOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                    theme === 'sunset' ? 'text-[#8c746f] hover:bg-orange-50 hover:text-[#4a3733]' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {link}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="hidden md:flex gap-x-6 text-sm text-slate-400">
        <span className="hover:text-slate-600 cursor-default transition-colors">life +</span>
        <span className="hover:text-slate-600 cursor-default transition-colors">stats +</span>
      </div>
    </nav>
  );
};

const WritingItem = ({ date, title, readTime, description, theme }) => (
  <div className="group mb-10 cursor-pointer">
    <div className="flex items-baseline gap-x-4 mb-1">
      <span className={`text-[10px] uppercase tracking-widest font-medium font-mono ${theme === 'sunset' ? 'text-orange-400' : 'text-slate-400'}`}>
        {date}
      </span>
      <span className={`text-[10px] uppercase tracking-widest font-mono ${theme === 'sunset' ? 'text-pink-300' : 'text-slate-300 dark:text-slate-600'}`}>
        {readTime}
      </span>
    </div>
    <h3 className={`text-lg font-medium transition-colors ${theme === 'sunset' ? 'text-[#4a3733] group-hover:text-orange-600' : 'text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
      {title}
    </h3>
    <p className={`text-sm leading-relaxed mt-1 max-w-xl ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-500 dark:text-slate-400'}`}>
      {description}
    </p>
  </div>
);

// --- Pages ---

const Home = ({ setActivePage, theme }) => {
  const writings = [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10">
      <section className="mb-20">
        <h1 className={`text-4xl md:text-5xl font-semibold tracking-tighter mb-6 ${theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-900 dark:text-white'}`}>
          aarush pathuri
        </h1>
        <p className={`text-lg leading-relaxed max-w-2xl mb-4 italic font-serif ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-600 dark:text-slate-300'}`}>
          exploring the intersection of data, competition, and storytelling.
        </p>
        <p className={`leading-relaxed max-w-xl ${theme === 'sunset' ? 'text-[#8c746f]' : 'text-slate-500 dark:text-slate-400'}`}>
          obsessed with sports analytics and the mechanics of a perfect game. 
          usually digging through a dataset or enjoying some good media.
        </p>
      </section>

      <section className="mb-20">
        <div className={`flex items-center justify-between mb-10 border-b pb-4 ${theme === 'sunset' ? 'border-orange-100' : 'border-slate-200 dark:border-slate-800'}`}>
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400">writing</h2>
          <button 
            onClick={() => setActivePage('blog')}
            className={`text-xs transition-colors flex items-center gap-1 ${theme === 'sunset' ? 'text-[#8c746f] hover:text-orange-600' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            view all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div>
          {writings.length > 0 ? (
            writings.map((w, idx) => <WritingItem key={idx} {...w} theme={theme} />)
          ) : (
            <p className="text-sm text-slate-400 italic">No posts yet. Check back soon.</p>
          )}
        </div>
      </section>

      <section className="mb-20">
        <h2 className={`text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-10 border-b pb-4 ${theme === 'sunset' ? 'border-orange-100' : 'border-slate-200 dark:border-slate-800'}`}>elsewhere</h2>
        <div className="flex flex-wrap gap-6">
          <a href="#" className={`flex items-center gap-2 text-sm transition-colors ${theme === 'sunset' ? 'text-[#8c746f] hover:text-orange-500' : 'text-slate-400 hover:text-blue-500'}`}>
            <Mail className="w-4 h-4" /> email
          </a>
          <a href="#" className={`flex items-center gap-2 text-sm transition-colors ${theme === 'sunset' ? 'text-[#8c746f] hover:text-[#4a3733]' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
            <Github className="w-4 h-4" /> github
          </a>
          <a href="#" className={`flex items-center gap-2 text-sm transition-colors ${theme === 'sunset' ? 'text-[#8c746f] hover:text-blue-400' : 'text-slate-400 hover:text-blue-400'}`}>
            <Twitter className="w-4 h-4" /> twitter
          </a>
          <a href="#" className={`flex items-center gap-2 text-sm transition-colors ${theme === 'sunset' ? 'text-[#8c746f] hover:text-blue-700' : 'text-slate-400 hover:text-blue-700'}`}>
            <Linkedin className="w-4 h-4" /> linkedin
          </a>
        </div>
      </section>
    </div>
  );
};

const About = ({ theme }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl relative z-10">
    <h2 className={`text-2xl font-semibold mb-8 ${theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-900 dark:text-white'}`}>about</h2>
    <div className={`space-y-6 leading-relaxed ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-600 dark:text-slate-300'}`}>
      <p>
        I’m Aarush. I find myself at the crossroads of competition and calculation. 
        For me, sports aren't just a pastime: they're a puzzle.
      </p>
      <p>
        My fascination lies in <strong>sports analytics</strong>. I love digging into the "why" 
        behind the game: analyzing player efficiency, game-day strategies, and the statistical 
        outliers that redefine the sport. Whether it's baseball, basketball, or football, 
        I'm usually looking for the narrative hidden in the data.
      </p>
      <p>
        When I’m not focused on the field, I enjoy <strong>good media</strong>. 
        I appreciate well-crafted stories and engaging visual experiences, whatever the format. 
        I like content that stands on its own and gives you something to think about once it's over.
      </p>
    </div>
  </div>
);

const Blog = () => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
    <h2 className="text-2xl font-semibold mb-12 text-slate-900 dark:text-white tracking-tight">all writing</h2>
    <div className="space-y-12">
      <p className="text-slate-500 dark:text-slate-400 italic">There are no archived posts yet.</p>
    </div>
  </div>
);

const Now = ({ theme }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl relative z-10">
    <h2 className={`text-2xl font-semibold mb-8 ${theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-900 dark:text-white'}`}>what i'm doing now</h2>
    <div className={`p-6 border rounded-2xl mb-10 backdrop-blur-sm ${theme === 'sunset' ? 'border-orange-100 bg-white/30' : 'border-slate-200 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-900/50'}`}>
      <p className="text-sm text-slate-500 italic mb-1">Last updated: Jan 6, 2026</p>
      <p className="text-sm text-slate-400">From Bloomington, IL</p>
    </div>
    <ul className={`space-y-4 list-disc pl-5 ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-600 dark:text-slate-300'}`}>
      <li>Developing a custom dashboard for NBA shot-tracking analysis.</li>
      <li>Catching up on some highly-rated new releases.</li>
      <li>Refining my predictive models for the upcoming season.</li>
      <li>Observing the changing patterns in the weather.</li>
    </ul>
  </div>
);

const WanderPlaceholder = ({ theme, onBack }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10 py-12">
    <button 
      onClick={onBack}
      className={`flex items-center gap-2 text-xs uppercase tracking-widest font-mono mb-12 hover:gap-3 transition-all ${theme === 'sunset' ? 'text-orange-400' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
    >
      <ArrowLeft size={14} /> back home
    </button>
    <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
      <p className={`text-lg italic font-serif ${theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-600 dark:text-slate-300'}`}>
        idk i havent made it this far yet
      </p>
      <div className={`mt-6 w-12 h-px ${theme === 'sunset' ? 'bg-orange-200' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [theme, setTheme] = useState('light'); // 'light', 'sunset', 'dark'
  const [weatherType, setWeatherType] = useState('none');

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const cycleTheme = () => {
    const themes = ['light', 'sunset', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={18} />;
    if (theme === 'sunset') return <Sunrise size={18} />;
    return <Moon size={18} />;
  };

  const cycleWeather = () => {
    const types = ['none', 'rain', 'snow'];
    const currentIndex = types.indexOf(weatherType);
    const nextIndex = (currentIndex + 1) % types.length;
    setWeatherType(types[nextIndex]);
  };

  const getWeatherIcon = () => {
    switch (weatherType) {
      case 'rain': return <CloudRain size={18} />;
      case 'snow': return <CloudSnow size={18} />;
      default: return <Cloud size={18} />;
    }
  };

  const renderPage = () => {
    switch(activePage) {
      case 'about': return <About theme={theme} />;
      case 'blog': return <Blog />;
      case 'now': return <Now theme={theme} />;
      case 'wander-placeholder': return <WanderPlaceholder theme={theme} onBack={() => setActivePage('home')} />;
      default: return <Home setActivePage={setActivePage} theme={theme} />;
    }
  };

  const getThemeStyles = () => {
    if (theme === 'dark') return 'bg-[#0a0a0a] text-slate-300';
    if (theme === 'sunset') return 'bg-gradient-to-b from-[#fffcf0] via-[#fdf2f0] to-[#fce4ec] text-[#4a3733]';
    return 'bg-[#fcfaf2] text-slate-700';
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${getThemeStyles()}`}>
      <WeatherEffect theme={theme} type={weatherType} />
      
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-24 selection:bg-orange-100 selection:text-orange-900 relative z-10">
        
        <header>
          <div className="flex justify-end mb-8 gap-2">
            <button 
              onClick={cycleWeather}
              className={`p-2 rounded-full transition-all duration-300 ${weatherType !== 'none' ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'}`}
              title={`Weather: ${weatherType}`}
            >
              {getWeatherIcon()}
            </button>
             <button 
              onClick={cycleTheme}
              className={`p-2 rounded-full transition-colors ${theme === 'sunset' ? 'text-orange-600 bg-orange-100' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'}`}
              title={`Current Theme: ${theme}`}
            >
              {getThemeIcon()}
            </button>
          </div>
          <Navbar activePage={activePage} setActivePage={setActivePage} theme={theme} />
        </header>

        <main className="min-h-[60vh]">
          {renderPage()}
        </main>

        <footer className={`mt-32 pt-12 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 ${theme === 'sunset' ? 'border-orange-100' : 'border-slate-200 dark:border-slate-800'}`}>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-widest font-mono text-slate-400">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">colophon</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">changelog</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">rss</a>
          </div>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest font-mono text-slate-400">
            <span className="flex items-center gap-1"><MapPin size={10} /> bloomington, 2026</span>
            <span>updated jan 2026</span>
          </div>
        </footer>

        <div className="fixed bottom-6 right-6 pointer-events-none opacity-20 md:opacity-30 z-20">
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono font-bold rotate-90 origin-right">no tracking</span>
        </div>
      </div>
    </div>
  );
}

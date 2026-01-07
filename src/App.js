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
  ChevronDown
} from 'lucide-react';

const INITIAL_POSTS = [
  {
    "id": "nba-analytics-2026",
    "date": "Jan 6, 2026",
    "title": "The Impact of Analytics: Beyond the Box Score",
    "readTime": "4 min read",
    "description": "An exploration of why raw scoring isn't everything in the NBA. Comparing the offensive gravity of stars like Zach LaVine to the 'glue' impact of role players like Alex Caruso and Jrue Holiday.",
    "content": `Imagine you are an NBA general manager and you have to choose between two players. Player A is an offensive flamethrower. He is averaging 20 points, 5 rebounds, and 5 assists. He has the highlights, the athleticism, and the star label. Player B looks like a bench warmer on paper. He averages 10 points and 3 assists. If you look at the box score after a game, Player A is the one getting the headlines.\n\nBut if you look at the win column, everything flips. In the 2023 season, Zach LaVine (Player A) often saw the Chicago Bulls play better while he was on the bench. He had a staggering negative 18.8 On/Off rating at one point. This means the team was nearly 19 points better per 100 possessions when their star sat down. Meanwhile, Alex Caruso (Player B) was the heartbeat of the team. Caruso did not just have a positive net rating; he had a positive net rating with almost every single teammate he shared the floor with.\n\nThis is the fundamental shift in how we perceive basketball. Analytics has taught us that a star who scores 20 but is a cone on defense is often less valuable than a role player who shuts down the other team's best scorer. A player who stands still while opponents blow past him is a liability regardless of his scoring average.\n\nThe internet often debates who is the better hooper, but the better question is how does this player scale. The 2021 Brooklyn Nets are the ultimate cautionary tale of the engine problem. On paper, having Kevin Durant, James Harden, and Kyrie Irving was a cheat code. They had three of the greatest offensive engines in history.\n\nThe problem is that a basketball game only has one ball and 100 possessions. When you have three players who all need a 30 percent usage rate to be effective, you reach a point of diminishing returns. Analytics showed that while their offensive rating was historic, their defensive infrastructure was non-existent. They were all engines and no grease.\n\nBecause they lacked glue guys like Caruso, the team was fragile. These are players who are happy to have a 10 percent usage rate but provide 100 percent effort on the margins. When one engine stalled due to injury, the whole machine collapsed. They had not built a system that valued efficiency and defense over raw point totals.\n\nCompare the Nets to the 2021 Milwaukee Bucks, the very same that eliminated them. Before they traded for Jrue Holiday, the Bucks were a regular season powerhouse that struggled in the playoffs. They replaced Eric Bledsoe with Holiday. While Holiday's raw scoring numbers were not always massive, his impact was astronomical.\n\nIn the 2021 NBA Finals, Jrue Holiday had games where he shot 4 for 20. In the old days, fans would have called for his head. But the analytics told a different story. Even when his shot was not falling, his defensive presence was so suffocating that he was a plus 15 on the floor. He won possession after possession on the margins. He produced screen assists and forced deflections. He stayed attached to the opponent's best player like glue.\n\nThe Bucks won that championship because they realized that surrounding a superstar like Giannis with hyper-efficient connectors is more valuable than adding a second high-volume, low-defense scorer. They traded for a guy who could score 27 in a Game 5 but was just as happy to score 12 if it meant getting the win.\n\nWe used to live in a world of what ifs and eye tests. We used to argue that a guy was good just because he looked like a star. Analytics has killed that era. We now know that a player can average 20 points and 10 rebounds while being the reason their team loses. If those 20 points come on 45 percent true shooting and those 10 rebounds are uncontested, that player is a ghost in the machine.\n\nThe box score is a skeleton, but analytics is the flesh and blood of the game. It tells us that basketball is not about who can put the ball in the hoop the most. It is about who can maximize the value of every single second they spend on the floor.`
  },
  {
    "id": "setting-up-2026",
    "date": "Jan 6, 2026",
    "title": "The First Post: Setting Up the Site",
    "readTime": "2 min read",
    "description": "A quick look at the process of building this minimalist, weather-reactive portfolio using React and Tailwind.",
    "content": "Welcome to my new personal site. This project was born out of a desire for a clean, typography-focused space to share thoughts on sports, data, and media. Built with React and Tailwind CSS, it features a dynamic weather system and three distinct themes (Light, Dark, and Sunset). I'll be using this space to document my projects and share my findings in the world of sports analytics."
  }
];

// --- Sub-components ---

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
      let color = theme === 'dark' ? '255, 255, 255' : theme === 'sunset' ? '139, 92, 246' : '0, 0, 0';

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
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
};

const Navbar = ({ theme }) => {
  const [isWanderOpen, setIsWanderOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

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
    { id: 'home', label: 'aarush pathuri', path: '/', brand: true },
    { id: 'about', label: 'about', path: '/about' },
    { id: 'blog', label: 'blog', path: '/blog' },
    { id: 'now', label: 'now', path: '/now' },
  ];

  const getTextColor = (itemPath) => {
    const isActive = location.pathname === itemPath;
    if (isActive) {
       if (theme === 'dark') return 'text-white underline decoration-slate-300';
       if (theme === 'sunset') return 'text-[#4a3733] underline decoration-orange-300';
       return 'text-slate-900 underline decoration-slate-300';
    }
    return theme === 'sunset' ? 'text-[#8c746f] hover:text-[#4a3733]' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white';
  };

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
                : getTextColor(item.path)
            }`}
          >
            {item.label}
          </Link>
        ))}
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsWanderOpen(!isWanderOpen)}
            className={`text-sm tracking-tight transition-colors duration-200 font-medium flex items-center gap-1 ${
              location.pathname === '/wander' 
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
                <Link
                  key={idx}
                  to="/wander"
                  onClick={() => setIsWanderOpen(false)}
                  className={`block w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                    theme === 'sunset' ? 'text-[#8c746f] hover:bg-orange-50 hover:text-[#4a3733]' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {link}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const WritingItem = ({ id, date, title, readTime, description, theme }) => (
  <Link to={`/blog/${id}`} className="block group mb-8">
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
  </Link>
);

// --- Pages ---

const Home = ({ theme, posts }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 relative z-10">
    <section className="mb-12">
      <h1 className={`text-4xl md:text-5xl font-semibold tracking-tighter mb-4 ${theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-900 dark:text-white'}`}>
        aarush pathuri
      </h1>
      <p className={`text-lg leading-relaxed max-w-2xl mb-3 italic font-serif ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-600 dark:text-slate-300'}`}>
        exploring the intersection of data, competition, and storytelling.
      </p>
      <p className={`leading-relaxed max-w-xl ${theme === 'sunset' ? 'text-[#8c746f]' : 'text-slate-500 dark:text-slate-400'}`}>
       a student with an interest in sports analytics and finance. 
        occasionally watching through a good movie and usually doomscrolling.
      </p>
    </section>

    <section className="mb-12">
      <div className={`flex items-center justify-between mb-8 border-b pb-2 ${theme === 'sunset' ? 'border-orange-100' : 'border-slate-200 dark:border-slate-800'}`}>
        <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400">writing</h2>
        <Link 
          to="/blog"
          className={`text-xs transition-colors flex items-center gap-1 ${theme === 'sunset' ? 'text-[#8c746f] hover:text-orange-600' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          view all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div>
        {posts?.slice(0, 3).map((post, idx) => (
          <WritingItem key={idx} {...post} theme={theme} />
        ))}
      </div>
    </section>

    <section className="mb-12">
      <h2 className={`text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-8 border-b pb-2 ${theme === 'sunset' ? 'border-orange-100' : 'border-slate-200 dark:border-slate-800'}`}>elsewhere</h2>
      <div className="flex flex-wrap gap-6">
        <a href="mailto:aarushvpathuri2807@gmail.com" className={`flex items-center gap-2 text-sm transition-colors ${theme === 'sunset' ? 'text-[#8c746f] hover:text-orange-500' : 'text-slate-400 hover:text-blue-500'}`}><Mail className="w-4 h-4" /> email</a>
        <a href="https://github.com/aarush2807" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm transition-colors ${theme === 'sunset' ? 'text-[#8c746f] hover:text-[#4a3733]' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}><Github className="w-4 h-4" /> github</a>
        <a href="https://www.linkedin.com/in/aarush-pathuri-b943b0265/" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm transition-colors ${theme === 'sunset' ? 'text-[#8c746f] hover:text-blue-700' : 'text-slate-400 hover:text-blue-700'}`}><Linkedin className="w-4 h-4" /> linkedin</a>
      </div>
    </section>
  </div>
);

const Blog = ({ theme, posts }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 relative z-10">
    <h2 className={`text-2xl font-semibold mb-10 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>all writing</h2>
    <div className="space-y-10">
      {posts?.map((post, idx) => <WritingItem key={idx} {...post} theme={theme} />)}
    </div>
  </div>
);

const Article = ({ theme, posts }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find(p => p.id === id);

  if (!post) return <div className="py-20 text-center">Post not found.</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 relative z-10 max-w-2xl">
      <button 
        onClick={() => navigate(-1)}
        className={`flex items-center gap-2 text-xs uppercase tracking-widest font-mono mb-8 hover:gap-3 transition-all ${theme === 'sunset' ? 'text-orange-400' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
      >
        <ArrowLeft size={14} /> back
      </button>
      <div className="mb-8">
        <div className="flex items-baseline gap-x-4 mb-1">
          <span className={`text-xs uppercase tracking-widest font-medium font-mono ${theme === 'sunset' ? 'text-orange-400' : 'text-slate-400'}`}>{post.date}</span>
          <span className={`text-xs uppercase tracking-widest font-mono ${theme === 'sunset' ? 'text-pink-300' : 'text-slate-300 dark:text-slate-600'}`}>{post.readTime}</span>
        </div>
        <h1 className={`text-3xl md:text-4xl font-semibold tracking-tighter mb-4 ${theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-900 dark:text-white'}`}>{post.title}</h1>
      </div>
      <div className={`prose prose-slate dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-600 dark:text-slate-300'}`}>{post.content}</div>
    </div>
  );
};

const About = ({ theme }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-2xl relative z-10">
    <h2 className={`text-2xl font-semibold mb-6 ${theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-900 dark:text-white'}`}>about</h2>
    <div className={`space-y-4 leading-relaxed ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-600 dark:text-slate-300'}`}>
      <p>I’m Aarush. I find myself at the crossroads of competition and calculation. For me, sports aren't just a pastime: they're a puzzle.</p>
      <p>My fascination lies in <strong>sports analytics</strong>. I love digging into the "why" behind the game: analyzing player efficiency, game-day strategies, and the statistical outliers that redefine the sport.</p>
    </div>
  </div>
);

const Now = ({ theme }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-2xl relative z-10">
    <h2 className={`text-2xl font-semibold mb-6 ${theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-900 dark:text-white'}`}>what i'm doing now</h2>
    <div className={`p-5 border rounded-2xl mb-8 backdrop-blur-sm ${theme === 'sunset' ? 'border-orange-100 bg-white/30' : 'border-slate-200 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-900/50'}`}>
      <p className="text-sm text-slate-500 italic mb-1">Last updated: Jan 6, 2026</p>
      <p className="text-sm text-slate-400">From Bloomington, IL</p>
    </div>
    <ul className={`space-y-3 list-disc pl-5 ${theme === 'sunset' ? 'text-[#6d5a56]' : 'text-slate-600 dark:text-slate-300'}`}>
      <li>Developing a custom dashboard for NBA shot-tracking analysis.</li>
      <li>Catching up on some highly-rated new releases.</li>
    </ul>
  </div>
);

const WanderPlaceholder = ({ theme }) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 relative z-10 py-8">
    <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
      <p className={`text-lg italic font-serif ${theme === 'sunset' ? 'text-[#4a3733]' : 'text-slate-600 dark:text-slate-300'}`}>idk i havent made it this far yet</p>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [theme, setTheme] = useState('light'); 
  const [weatherType, setWeatherType] = useState('none');
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
      
      <div className="max-w-3xl mx-auto px-6 py-6 md:py-10 relative z-10">
        <header className="flex items-center justify-between mb-8 md:mb-12">
          <Navbar theme={theme} />
          
          <div className="flex items-center gap-1 md:gap-2">
            <button onClick={cycleWeather} className={`p-2 rounded-full transition-all ${weatherType !== 'none' ? 'text-orange-500 bg-orange-50' : 'text-slate-400 hover:text-slate-900'}`}>{weatherType === 'rain' ? <CloudRain size={18} /> : weatherType === 'snow' ? <CloudSnow size={18} /> : <Cloud size={18} />}</button>
             <button onClick={cycleTheme} className={`p-2 rounded-full transition-colors ${theme === 'sunset' ? 'text-orange-600 bg-orange-100' : 'text-slate-400 hover:text-slate-900'}`}>{theme === 'light' ? <Sun size={18} /> : theme === 'sunset' ? <Sunrise size={18} /> : <Moon size={18} />}</button>
          </div>
        </header>

        <main className="min-h-[50vh]">
          <Routes>
            <Route path="/" element={<Home theme={theme} posts={INITIAL_POSTS} />} />
            <Route path="/about" element={<About theme={theme} />} />
            <Route path="/blog" element={<Blog theme={theme} posts={INITIAL_POSTS} />} />
            <Route path="/blog/:id" element={<Article theme={theme} posts={INITIAL_POSTS} />} />
            <Route path="/now" element={<Now theme={theme} />} />
            <Route path="/wander" element={<WanderPlaceholder theme={theme} />} />
          </Routes>
        </main>

        <footer className={`mt-20 pt-8 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${theme === 'sunset' ? 'border-orange-100' : 'border-slate-200 dark:border-slate-800'}`}>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-widest font-mono text-slate-400">
            <a href="#" className="hover:text-slate-900">colophon</a>
            <a href="#" className="hover:text-slate-900">changelog</a>
            <a href="#" className="hover:text-slate-900">rss</a>
          </div>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest font-mono text-slate-400">
            <span className="flex items-center gap-1"><MapPin size={10} /> bloomington, 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

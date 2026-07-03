import { useEffect, useState, useRef } from "react";
import { categoriesApi, productsApi } from "@/lib/api";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  Shirt,
  Truck,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Headphones,
  Eye,
  Heart,
  Star,
  ChevronDown,
  Play,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Floating Particle Component ───
const FloatingParticle = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-blue-moon/20"
    style={{ left: x, top: y, width: size, height: size }}
    animate={{
      y: [0, -30, 0, 20, 0],
      x: [0, 15, -10, 5, 0],
      opacity: [0.2, 0.5, 0.3, 0.6, 0.2],
      scale: [1, 1.2, 0.9, 1.1, 1],
    }}
    transition={{
      duration: 8 + Math.random() * 4,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

// ─── Glowing Orb Component ───
const GlowingOrb = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full blur-3xl opacity-30 ${className}`} />
);

// ─── Stats Counter ───
const AnimatedCounter = ({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-extrabold text-white">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs uppercase tracking-widest text-gray-400 mt-1">{label}</div>
    </div>
  );
};

// ─── Magnetic Button Wrapper ───
const MagneticButton = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };

  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Reveal on Scroll ───
const RevealSection = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── Cursor Glow (follows mouse in hero) ───
const CursorGlow = () => {
  const glowX = useMotionValue(-200);
  const glowY = useMotionValue(-200);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      glowX.set(e.clientX - 200);
      glowY.set(e.clientY - 200);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [glowX, glowY]);

  return (
    <motion.div
      className="pointer-events-none fixed z-0 w-[400px] h-[400px] rounded-full opacity-[0.07]"
      style={{
        x: glowX,
        y: glowY,
        background: "radial-gradient(circle, #6B8DB5 0%, transparent 70%)",
      }}
    />
  );
};

// ─── Main Page ───
const HomePage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    Promise.all([categoriesApi.getAll(), productsApi.getAll()])
      .then(([cats, prods]) => {
        setCategories(Array.isArray(cats) ? cats : []);
        const arr = Array.isArray(prods) ? prods : [];
        const shuffleArray = (array: any[]) => {
          const newArray = [...array];
          for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
          }
          return newArray;
        };
        const shuffledProducts = shuffleArray(arr);
        const featuredItems = shuffledProducts.filter((p: any) => p.featured);
        setFeatured(featuredItems.length > 0 ? featuredItems.slice(0, 8) : shuffledProducts.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <CursorGlow />

      {/* ═══════════════════════════════════════════
          HERO SECTION — Dark, cinematic, interactive
      ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen bg-[#0B0D11] text-white overflow-hidden">
        {/* Background layers */}
        <GlowingOrb className="w-[600px] h-[600px] bg-[#4A6FA5] top-[-200px] right-[-100px] opacity-20" />
        <GlowingOrb className="w-[400px] h-[400px] bg-[#3B5998] bottom-[-100px] left-[-100px] opacity-15" />
        <GlowingOrb className="w-[300px] h-[300px] bg-[#6B8DB5] top-[40%] left-[30%] opacity-10" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(107,141,181,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(107,141,181,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating particles */}
        <FloatingParticle delay={0} x="10%" y="20%" size={6} />
        <FloatingParticle delay={1.5} x="80%" y="15%" size={4} />
        <FloatingParticle delay={3} x="60%" y="70%" size={8} />
        <FloatingParticle delay={0.8} x="25%" y="80%" size={5} />
        <FloatingParticle delay={2.2} x="90%" y="50%" size={3} />
        <FloatingParticle delay={4} x="45%" y="30%" size={7} />
        <FloatingParticle delay={1} x="70%" y="85%" size={4} />
        <FloatingParticle delay={3.5} x="15%" y="55%" size={6} />

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0B0D11_80%)]" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
          <div className="container flex flex-col lg:flex-row items-center min-h-screen py-20 gap-12 lg:gap-8">
            {/* Left — Content */}
            <div className="flex-1 max-w-2xl space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-md text-blue-moon text-xs font-semibold px-5 py-2 rounded-full border border-white/[0.08] mb-6">
                  <Zap className="w-3.5 h-3.5" /> New Arrivals Just Dropped
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight"
              >
                <span className="text-white">Fresh</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B8DB5] via-[#8BABD4] to-[#A4C4E8]">
                  Styles.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed"
              >
                Augustine's Collections — premium t-shirts, jeans, hoodies & more.
                Shop online and pay seamlessly with <span className="text-blue-moon font-medium">M-Pesa</span>.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="flex gap-4 flex-wrap pt-2"
              >
                <MagneticButton>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#4A6FA5] to-[#6B8DB5] hover:from-[#5A7FB5] hover:to-[#7B9DC5] text-white font-bold shadow-lg shadow-blue-moon/20 border-0 h-13 px-8 text-base"
                    asChild
                  >
                    <Link to="/products">
                      Shop Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </MagneticButton>

                <MagneticButton>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="border border-white/15 text-white font-semibold hover:bg-white/[0.06] hover:text-white h-13 px-8 text-base"
                    asChild
                  >
                    <Link to="/categories">Browse Categories</Link>
                  </Button>
                </MagneticButton>
              </motion.div>

              {/* Mini stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="flex gap-10 pt-6 border-t border-white/[0.06]"
              >
                <AnimatedCounter target={2500} suffix="+" label="Happy Customers" />
                <AnimatedCounter target={500} suffix="+" label="Products" />
                <AnimatedCounter target={4} suffix=".9" label="Star Rating" />
              </motion.div>
            </div>

            {/* Right — Hero Product Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 60 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 relative max-w-lg w-full"
            >
              {/* Main showcase card */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#4A6FA5]/20 to-[#6B8DB5]/20 rounded-3xl blur-2xl" />
                <div className="relative bg-[#14171E] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
                  {!loading && featured.length > 0 ? (
                    <div className="relative aspect-[3/4]">
                      <img
                        src={featured[0]?.images?.[0] || "/placeholder.svg"}
                        alt={featured[0]?.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="text-xs text-blue-moon font-semibold uppercase tracking-wider">Featured</span>
                        <h3 className="text-xl font-bold mt-1">{featured[0]?.name}</h3>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-2xl font-extrabold text-blue-moon">KES {featured[0]?.price?.toLocaleString()}</span>
                          {featured[0]?.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">KES {featured[0]?.originalPrice?.toLocaleString()}</span>
                          )}
                        </div>
                        <div className="flex gap-3 mt-4">
                          <Button size="sm" className="bg-blue-moon hover:bg-blue-moon/90 text-white font-semibold" asChild>
                            <Link to={`/products/${featured[0]?._id}`}>View Product</Link>
                          </Button>
                          <Button size="sm" variant="ghost" className="border border-white/15 text-white hover:bg-white/5">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[3/4] bg-[#1A1D27] animate-pulse" />
                  )}
                </div>
              </div>

              {/* Floating mini cards */}
              {!loading && featured.length > 2 && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="absolute -left-8 top-1/4 w-20 h-20 rounded-xl overflow-hidden border-2 border-[#14171E] shadow-xl hidden md:block"
                  >
                    <img src={featured[1]?.images?.[0]} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="absolute -right-4 top-16 w-16 h-16 rounded-xl overflow-hidden border-2 border-[#14171E] shadow-xl hidden md:block"
                  >
                    <img src={featured[2]?.images?.[0]} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="absolute -left-4 bottom-20 w-14 h-14 rounded-xl overflow-hidden border-2 border-[#14171E] shadow-xl hidden md:block"
                  >
                    <img src={featured[3]?.images?.[0]} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          MARQUEE — Dark themed
      ═══════════════════════════════════════════ */}
      {!loading && featured.length > 0 && (
        <section className="py-5 bg-[#0F1117] border-y border-white/[0.05] overflow-hidden">
          <style>{`
            @keyframes scrollDark {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-dark {
              animation: scrollDark 35s linear infinite;
            }
            .marquee-dark:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="flex overflow-hidden">
            <div className="marquee-dark flex gap-4 shrink-0 pr-4">
              {[...featured, ...featured].map((p, idx) => (
                <Link
                  to={`/products/${p._id}`}
                  key={`m-${p._id}-${idx}`}
                  className="relative w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden shrink-0 group border border-white/[0.06] bg-[#14171E]"
                >
                  <img
                    src={p.images?.[0] || "/placeholder.svg"}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                    <div>
                      <span className="text-blue-moon text-xs font-semibold">KES {p.price?.toLocaleString()}</span>
                      <p className="text-white text-sm font-semibold truncate">{p.name}</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FEATURES — Dark cards
      ═══════════════════════════════════════════ */}
      <section className="bg-[#0B0D11] py-20">
        <div className="container">
          <RevealSection>
            <div className="text-center mb-14">
              <span className="text-blue-moon text-xs font-bold uppercase tracking-[0.2em]">Why Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">The Augustine Difference</h2>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shirt,
                title: "Premium Clothing",
                desc: "Hand-picked t-shirts, jeans, and hoodies built for comfort and lasting style.",
                gradient: "from-[#4A6FA5] to-[#6B8DB5]",
              },
              {
                icon: Truck,
                title: "Fast Nairobi Delivery",
                desc: "Same-day delivery within Nairobi so you can look good, fast.",
                gradient: "from-[#3B5998] to-[#5B79B8]",
              },
              {
                icon: Sparkles,
                title: "Weekly Drops",
                desc: "Collections update weekly so your wardrobe never goes stale.",
                gradient: "from-[#6B8DB5] to-[#8BABD4]",
              },
            ].map((f, i) => (
              <RevealSection key={f.title} delay={i * 0.12}>
                <div className="group relative p-8 rounded-2xl bg-[#14171E] border border-white/[0.06] hover:border-blue-moon/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-moon/5 overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${f.gradient} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-500`} />
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-6 shadow-lg shadow-blue-moon/20`}>
                      <f.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-white mb-3">{f.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
                    <div className="mt-6 flex items-center gap-2 text-blue-moon text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CATEGORIES — Dark with hover glow
      ═══════════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="bg-[#0F1117] py-20">
          <div className="container">
            <RevealSection>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="text-blue-moon text-xs font-bold uppercase tracking-[0.2em]">Explore</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">Shop by Category</h2>
                  <p className="text-gray-500 mt-2">Find exactly what you're looking for</p>
                </div>
                <Link
                  to="/categories"
                  className="hidden sm:flex text-sm text-blue-moon hover:text-blue-moon/80 items-center gap-1.5 font-semibold transition-colors"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </RevealSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {categories.slice(0, 8).map((cat: any, i: number) => (
                <RevealSection key={cat._id} delay={i * 0.06}>
                  <Link
                    to={`/categories/${cat._id}`}
                    className="group relative block bg-[#14171E] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-blue-moon/20 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-moon/5"
                  >
                    <div className="aspect-[4/5] overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-[#0B0D11]/20 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="font-bold text-white text-sm">{cat.name}</h3>
                      <div className="flex items-center gap-1.5 text-blue-moon text-xs font-semibold mt-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Shop Now <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FEATURED PRODUCTS — Subtle dark bg
      ═══════════════════════════════════════════ */}
      {loading ? (
        <div className="bg-[#0B0D11] py-20">
          <LoadingSpinner />
        </div>
      ) : (
        featured.length > 0 && (
          <section className="bg-[#0B0D11] py-20">
            <div className="container">
              <RevealSection>
                <div className="flex items-end justify-between mb-10">
                  <div>
                    <span className="text-blue-moon text-xs font-bold uppercase tracking-[0.2em]">Curated</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">Featured Styles</h2>
                    <p className="text-gray-500 mt-2">Hand-picked favorites from our collection</p>
                  </div>
                  <Link
                    to="/products"
                    className="hidden sm:flex text-sm text-blue-moon hover:text-blue-moon/80 items-center gap-1.5 font-semibold transition-colors"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </RevealSection>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {featured.map((p: any, i: number) => (
                  <RevealSection key={p._id} delay={i * 0.07}>
                    <div
                      className="relative"
                      onMouseEnter={() => setHoveredProduct(p._id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      {/* Hover glow behind card */}
                      <motion.div
                        className="absolute -inset-2 rounded-2xl bg-blue-moon/10 blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredProduct === p._id ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="relative">
                        <ProductCard product={p} />
                      </div>
                    </div>
                  </RevealSection>
                ))}
              </div>
            </div>
          </section>
        )
      )}

      {/* ═══════════════════════════════════════════
          TRUST BADGES — Dark minimal
      ═══════════════════════════════════════════ */}
      <section className="bg-[#0F1117] py-20 border-t border-white/[0.04]">
        <div className="container">
          <RevealSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14">
              Why Shop With Us?
            </h2>
          </RevealSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: ShieldCheck, title: "Quality Guaranteed", desc: "Premium fabrics only" },
              { icon: CreditCard, title: "Secure M-Pesa", desc: "Safe & fast payments" },
              { icon: Truck, title: "Swift Delivery", desc: "Across Kenya" },
              { icon: Headphones, title: "Support 24/7", desc: "We're here to help" },
            ].map((item, i) => (
              <RevealSection key={item.title} delay={i * 0.08}>
                <div className="group text-center p-8 rounded-2xl bg-[#14171E] border border-white/[0.06] hover:border-blue-moon/20 transition-all duration-500 hover:-translate-y-1">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#4A6FA5]/20 to-[#6B8DB5]/20 border border-blue-moon/10 flex items-center justify-center mb-5 group-hover:from-[#4A6FA5]/30 group-hover:to-[#6B8DB5]/30 transition-colors duration-500">
                    <item.icon className="w-7 h-7 text-blue-moon" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIAL / SOCIAL PROOF — New section
      ═══════════════════════════════════════════ */}
      <section className="bg-[#0B0D11] py-20">
        <div className="container">
          <RevealSection>
            <div className="text-center mb-14">
              <span className="text-blue-moon text-xs font-bold uppercase tracking-[0.2em]">Reviews</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">Loved by Thousands</h2>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Brian K.", text: "Best hoodies I've ever owned. The quality is insane and delivery was same day!", rating: 5 },
              { name: "Sarah M.", text: "Finally found a store with actual premium tees. The M-Pesa checkout was so smooth.", rating: 5 },
              { name: "Dennis O.", text: "Ordered 3 pairs of jeans. All fit perfectly. Augustine's is now my go-to.", rating: 5 },
            ].map((review, i) => (
              <RevealSection key={review.name} delay={i * 0.1}>
                <div className="p-8 rounded-2xl bg-[#14171E] border border-white/[0.06] hover:border-blue-moon/15 transition-all duration-500">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed text-sm mb-6">"{review.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A6FA5] to-[#6B8DB5] flex items-center justify-center text-white font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{review.name}</p>
                      <p className="text-gray-500 text-xs">Verified Buyer</p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BOTTOM CTA — Gradient blue moon
      ═══════════════════════════════════════════ */}
      <section className="relative bg-[#0B0D11] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A4A7A]/30 via-[#3B5998]/30 to-[#4A6FA5]/30" />
        <GlowingOrb className="w-[500px] h-[500px] bg-[#6B8DB5] top-[-200px] left-[-100px] opacity-20" />
        <GlowingOrb className="w-[400px] h-[400px] bg-[#4A6FA5] bottom-[-200px] right-[-100px] opacity-15" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "30px 30px",
          }}
        />

        <div className="container relative z-10 py-24 text-center">
          <RevealSection>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#4A6FA5] to-[#6B8DB5] flex items-center justify-center mb-8 shadow-lg shadow-blue-moon/30"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5">
              Ready to Upgrade<br className="hidden sm:block" /> Your Wardrobe?
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-10 text-lg">
              Join the Augustine's Collections family and discover clothing that makes you look and feel incredible.
            </p>
            <MagneticButton>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#4A6FA5] to-[#6B8DB5] hover:from-[#5A7FB5] hover:to-[#7B9DC5] text-white font-bold shadow-xl shadow-blue-moon/25 border-0 h-14 px-10 text-lg"
                asChild
              >
                <Link to="/products">Shop The Latest Drop</Link>
              </Button>
            </MagneticButton>
            <div className="flex justify-center gap-8 mt-12 text-sm text-gray-500">
              <Link to="/terms" className="hover:text-blue-moon transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="hover:text-blue-moon transition-colors">
                Privacy Policy
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
import { useEffect, useState } from "react";
import { categoriesApi, productsApi } from "@/lib/api";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shirt,
  Truck,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([categoriesApi.getAll(), productsApi.getAll()])
      .then(([cats, prods]) => {
        setCategories(Array.isArray(cats) ? cats : []);
        const arr = Array.isArray(prods) ? prods : [];
        setFeatured(arr.filter((p: any) => p.featured).slice(0, 8));
        if (arr.filter((p: any) => p.featured).length === 0)
          setFeatured(arr.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      {/* Hero Section - Upgraded with subtle grid pattern */}
      <section className="relative bg-blue-600 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="container relative py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl space-y-6"
          >
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/30">
              ✨ New Arrivals Just Dropped
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
              Fresh Styles,
              <br />
              Delivered Fast.
            </h1>
            <p className="text-lg text-blue-100 max-w-lg">
              Augustine's Collections — your go-to store for premium t-shirts,
              jeans, hoodies, and more. Shop online and pay seamlessly with
              M-Pesa.
            </p>
            <div className="flex gap-4 flex-wrap pt-2">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg"
                asChild
              >
                <Link to="/products">
                  Shop Now <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="border border-white/70 text-white font-semibold hover:bg-white/15 hover:text-white"
                asChild
              >
                <Link to="/categories">Browse Categories</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Infinite Marquee - Trending Images */}
      {!loading && featured.length > 0 && (
        <section className="py-6 bg-white border-b border-blue-100 overflow-hidden">
          <style>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-track {
              animation: scroll 30s linear infinite;
            }
            .marquee-track:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="flex overflow-hidden">
            <div className="marquee-track flex gap-4 shrink-0 pr-4">
              {[...featured, ...featured].map((p, idx) => (
                <Link
                  to={`/products/${p._id}`}
                  key={`${p._id}-${idx}`}
                  className="relative w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden shrink-0 group shadow-sm border border-blue-50"
                >
                  <img
                    src={p.images?.[0] || "/placeholder.svg"}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-sm font-semibold truncate">
                      {p.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Grid - Better Hover Effects */}
      <section className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Shirt,
              title: "Premium Clothing",
              desc: "Hand-picked t-shirts, jeans, and hoodies built for comfort and style.",
            },
            {
              icon: Truck,
              title: "Fast Nairobi Delivery",
              desc: "Same-day delivery within Nairobi. Look good, fast.",
            },
            {
              icon: Sparkles,
              title: "Weekly Drops",
              desc: "Our collections update weekly so your wardrobe stays fresh.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex items-start gap-4 p-6 rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
                <f.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Shop by Category</h2>
              <p className="text-muted-foreground mt-1">
                Find exactly what you're looking for
              </p>
            </div>
            <Link
              to="/categories"
              className="hidden sm:flex text-sm text-blue-600 hover:underline items-center gap-1 font-semibold"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((cat: any) => (
              <Link
                key={cat._id}
                to={`/categories/${cat._id}`}
                className="group bg-white border border-blue-100 rounded-2xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-square overflow-hidden rounded-xl mb-4 bg-blue-50">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-display font-bold text-sm">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products - Upgraded Title */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        featured.length > 0 && (
          <section className="bg-blue-50/40 py-16 mt-8">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold">Featured Styles</h2>
                  <p className="text-muted-foreground mt-1">
                    Hand-picked favorites from Augustine's Collections
                  </p>
                </div>
                <Link
                  to="/products"
                  className="hidden sm:flex text-sm text-blue-600 hover:underline items-center gap-1 font-semibold"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {featured.map((p: any) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )
      )}

      {/* Why Choose Us - Trust Badges */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Shop With Us?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: "Quality Guaranteed",
              desc: "Premium fabrics only",
            },
            {
              icon: CreditCard,
              title: "Secure M-Pesa",
              desc: "Safe & fast payments",
            },
            { icon: Truck, title: "Swift Delivery", desc: "Across Kenya" },
            {
              icon: Headphones,
              title: "Support 24/7",
              desc: "We're here to help",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="text-center p-6 rounded-2xl bg-white border border-blue-50 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <item.icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-blue-600 text-white">
        <div className="container py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Upgrade Your Wardrobe?
          </h2>
          <p className="text-blue-100 max-w-md mx-auto mb-8">
            Join the Augustine's Collections family today and discover clothing
            that makes you look and feel incredible.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-xl text-lg px-8"
            asChild
          >
            <Link to="/products">Shop The Latest Drop</Link>
          </Button>
          <div className="flex justify-center gap-8 mt-10 text-sm text-blue-200">
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;

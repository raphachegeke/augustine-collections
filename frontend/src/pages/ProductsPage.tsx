import { useEffect, useState } from "react";
import { productsApi } from "@/lib/api";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    productsApi.getAll()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout>
      <div className="container py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">Shop All Clothing</h1>
            <p className="text-sm text-muted-foreground mt-1">Browse the latest from Augustine's Collections</p>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
            <Input placeholder="Search t-shirts, jeans, hoodies..." className="pl-9 border-blue-200 focus:border-blue-500" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No clothing items found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductsPage;
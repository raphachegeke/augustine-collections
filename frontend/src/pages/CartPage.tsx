import { useCart } from "@/context/CartContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { items, removeItem, updateQty, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-20 text-center animate-fade-in">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Looks like you haven't added any clothing yet. Let's fix that!</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white"><Link to="/products">Shop Clothing</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8 text-blue-600">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 bg-white border border-blue-100 rounded-lg p-4 shadow-sm">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover bg-blue-50" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                  <p className="text-blue-600 font-bold">KSh {item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" size="icon" className="h-7 w-7 border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => updateQty(item.productId, item.quantity - 1)}><Minus className="w-3 h-3" /></Button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7 border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => updateQty(item.productId, item.quantity + 1)}><Plus className="w-3 h-3" /></Button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeItem(item.productId)}><Trash2 className="w-4 h-4" /></Button>
                  <span className="text-sm font-bold">KSh {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-blue-100 rounded-lg p-6 h-fit space-y-4 shadow-sm">
            <h2 className="font-display font-bold text-lg">Order Summary</h2>
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-bold text-blue-600">KSh {total.toLocaleString()}</span></div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg" asChild><Link to="/checkout">Proceed to Checkout</Link></Button>
            <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50" onClick={clearCart}>Clear Cart</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
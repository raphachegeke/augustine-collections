import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <Layout>
      <div className="container max-w-3xl py-16 animate-fade-in">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="prose prose-sm max-w-none bg-white border border-blue-100 rounded-2xl p-8 shadow-sm space-y-6 text-muted-foreground">
          
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">1. Agreement to Terms</h2>
            <p>By accessing and using Augustine's Collections ("the Site"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">2. Use of the Site</h2>
            <p>You agree to use the Site only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Site. Prohibited behavior includes harassing or causing distress or inconvenience to any other user.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">3. Products & Pricing</h2>
            <p>We strive to display our clothing items (t-shirts, jeans, hoodies, etc.) as accurately as possible. However, the actual colors you see depend on your monitor. We reserve the right to change prices at any time without prior notice. Prices are listed in Kenyan Shillings (KSh).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">4. Payments (M-Pesa)</h2>
            <p>All payments are processed securely via M-Pesa STK Push. An order is only confirmed once payment is fully verified by our system. Augustine's Collections is not liable for failed transactions caused by insufficient funds, wrong PIN entry, or network timeouts.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">5. Delivery & Shipping</h2>
            <p>We offer same-day or next-day delivery within Nairobi. For orders outside Nairobi, delivery times may vary. Delivery addresses must be accurate. Augustine's Collections will not be held responsible for delays caused by incorrect addresses or failed contact attempts.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">6. Returns & Exchanges</h2>
            <p>To be eligible for a return, items must be unworn, unwashed, and in their original packaging with all tags attached. Requests must be made within 7 days of delivery. Exchanges are subject to stock availability.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">7. Intellectual Property</h2>
            <p>All content on this website, including logos, text, graphics, and images, is the property of Augustine's Collections and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
          </section>

          <div className="pt-4 border-t border-blue-100 text-center">
            <p className="text-sm">For any questions regarding these terms, please <Link to="/products" className="text-blue-600 font-medium hover:underline">contact us</Link>.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;
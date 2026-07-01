import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const PrivacyPage = () => {
  return (
    <Layout>
      <div className="container max-w-3xl py-16 animate-fade-in">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="prose prose-sm max-w-none bg-white border border-blue-100 rounded-2xl p-8 shadow-sm space-y-6 text-muted-foreground">
          
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">1. Information We Collect</h2>
            <p>To provide you with clothing and process your orders, we collect the following data:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Personal Info:</strong> Name, Email Address, and Phone Number (required for M-Pesa and delivery).</li>
              <li><strong>Delivery Info:</strong> Physical address where your clothes will be delivered.</li>
              <li><strong>Payment Data:</strong> M-Pesa phone number and transaction receipts. <em>Note: We do not store your M-Pesa PIN.</em></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">2. How We Use Your Information</h2>
            <p>We use your data strictly to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Process and fulfill your clothing orders.</li>
              <li>Send M-Pesa STK push payment requests.</li>
              <li>Arrange delivery via our logistics partners.</li>
              <li>Communicate order updates (e.g., "Out for delivery").</li>
              <li>Improve our website and shopping experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">3. Data Sharing</h2>
            <p>Augustine's Collections will never sell your personal data. We only share necessary details (Name and Phone Number) with courier partners strictly for the purpose of delivering your order. We do not share financial data.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">4. Cookies & Tracking</h2>
            <p>We use essential cookies to keep your cart active and keep you logged in. We may also use analytics cookies to understand how visitors interact with our site so we can keep improving it.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">5. Data Security</h2>
            <p>We implement industry-standard security protocols to protect your information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">6. Your Rights</h2>
            <p>You have the right to request access to, correction of, or deletion of your personal data at any time. If you wish to delete your account and data, please contact us, and we will process your request promptly.</p>
          </section>

          <div className="pt-4 border-t border-blue-100 text-center">
            <p className="text-sm">For privacy-related inquiries, please <Link to="/products" className="text-blue-600 font-medium hover:underline">reach out to us</Link>.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
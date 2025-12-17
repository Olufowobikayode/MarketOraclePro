
import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-stone-300">
      <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
      
      <div className="space-y-4 text-sm leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Market Oracle Telegram Mini App (the "Service") operated by <strong>Kayode Olufowobi</strong> ("us", "we", or "our").</p>
        
        <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service within Telegram or via web browsers.</p>
        
        <h2 className="text-xl font-bold text-white pt-4">Accounts & Telegram Integration</h2>
        <p>By accessing this Service via Telegram, you agree that your basic public Telegram profile information (Name, Username, ID) may be used to authenticate your session and personalize your experience. We do not store sensitive personal data outside of what is required for the app's functionality.</p>
        
        <h2 className="text-xl font-bold text-white pt-4">Intellectual Property</h2>
        <p>The Service, including its original content, features, logic, and functionality, are and will remain the exclusive property of <strong>Kayode Olufowobi</strong>. The Service is protected by copyright, trademark, and other laws.</p>

        <h2 className="text-xl font-bold text-white pt-4">AI-Generated Content</h2>
        <p>This Service utilizes artificial intelligence to generate reports and insights. While we strive for accuracy, the information provided is for educational and strategic planning purposes only. It does not constitute financial, legal, or professional advice. You bear full responsibility for any decisions made based on the Service's output.</p>

        <h2 className="text-xl font-bold text-white pt-4">Termination</h2>
        <p>We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
        
        <h2 className="text-xl font-bold text-white pt-4">Governing Law</h2>
        <p>These Terms shall be governed and construed in accordance with the laws applicable to the developer's jurisdiction, without regard to its conflict of law provisions.</p>
        
        <h2 className="text-xl font-bold text-white pt-4">Changes</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
        
        <h2 className="text-xl font-bold text-white pt-4">Contact Us</h2>
        <p>If you have any questions about these Terms, please contact Kayode Olufowobi via the Contact page.</p>
      </div>
    </div>
  );
};

export default TermsPage;

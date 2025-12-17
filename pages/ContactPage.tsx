
import React from 'react';

const ContactPage: React.FC = () => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would dispatch an action or call an API.
    alert("Thank you for your message! Your inquiry has been queued for Kayode Olufowobi.");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">Contact Developer</h1>
        <p className="text-lg text-stone-400 mt-2">Reach out to Kayode Olufowobi for support, feedback, or collaboration.</p>
      </div>

      <div className="bg-stone-800 p-8 rounded-xl shadow-2xl border border-stone-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-300 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full bg-stone-700 text-white border-2 border-stone-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full bg-stone-700 text-white border-2 border-stone-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-stone-300 mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full bg-stone-700 text-white border-2 border-stone-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Describe your issue or proposal..."
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center border-t border-stone-700 pt-6">
            <p className="text-stone-500 text-sm">
                Social channels coming soon.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

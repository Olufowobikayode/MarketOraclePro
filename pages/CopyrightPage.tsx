
import React from 'react';

const CopyrightPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-stone-300">
      <h1 className="text-3xl font-bold text-white mb-6">Copyright Policy</h1>
      
      <div className="space-y-4 text-sm leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>This Copyright Policy outlines the policy of <strong>Kayode Olufowobi</strong> ("we", "us", or "our") regarding the intellectual property rights associated with the Market Oracle Telegram Mini App (the "Service").</p>
        
        <h2 className="text-xl font-bold text-white pt-4">Ownership of Content</h2>
        <p>All source code, design elements, graphics, logos, and software architecture present in this Service are the exclusive property of <strong>Kayode Olufowobi</strong> and are protected by international copyright laws. Unauthorized reproduction, distribution, or reverse engineering of the Service is strictly prohibited.</p>

        <h2 className="text-xl font-bold text-white pt-4">Output Ownership</h2>
        <p>You retain the rights to the specific reports, strategies, and content generated for you by the Service based on your unique inputs. You are free to use these generated outputs for your personal or commercial business purposes.</p>
        
        <h2 className="text-xl font-bold text-white pt-4">Copyright Infringement Claims</h2>
        <p>If you believe that any content appearing on the Service infringes on your copyright, please contact us immediately. We take intellectual property rights seriously and will investigate all claims.</p>

        <h2 className="text-xl font-bold text-white pt-4">Contacting Us</h2>
        <p>For any copyright-related inquiries, please use the Contact form within the application.</p>
        
        <div className="mt-8 pt-8 border-t border-stone-800 text-center text-xs text-stone-500">
            &copy; {new Date().getFullYear()} Kayode Olufowobi. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default CopyrightPage;

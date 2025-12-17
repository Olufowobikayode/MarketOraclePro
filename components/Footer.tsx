import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 border-t border-stone-800">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="text-lg font-bold text-white">Market Oracle</span>
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="/about" className="text-stone-400 hover:text-white">About</Link>
            <Link to="/contact" className="text-stone-400 hover:text-white">Contact</Link>
            <Link to="/terms" className="text-stone-400 hover:text-white">Terms</Link>
            <Link to="/copyright" className="text-stone-400 hover:text-white">Copyright</Link>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-stone-500">
          <p>&copy; {new Date().getFullYear()} Kayode Olufowobi. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
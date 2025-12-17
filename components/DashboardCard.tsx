import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  to: string;
  icon: string;
  title: string;
  description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ to, icon, title, description }) => {
  return (
    <Link 
        to={to} 
        className="block bg-stone-900 border-2 border-stone-800 rounded-xl p-6 hover:border-amber-500 hover:bg-stone-800/50 transition-all duration-300 shadow-lg hover:shadow-amber-500/10 h-full transform hover:scale-105"
    >
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-lg font-bold text-amber-400">{title}</h3>
        <p className="text-sm text-stone-400 mt-1">{description}</p>
    </Link>
  );
};

export default DashboardCard;
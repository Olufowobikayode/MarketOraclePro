
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert, removeAlert } from '../features/alerts/alertsSlice';
import type { RootState } from '../types';

interface CreateAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateAlertModal: React.FC<CreateAlertModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const activeAlerts = useSelector((state: RootState) => state.alerts.activeAlerts);
    const [keyword, setKeyword] = useState('');
    const [minVelocity, setMinVelocity] = useState('High');

    if (!isOpen) return null;

    const handleSave = () => {
        dispatch(addAlert({ keyword, minVelocity }));
        setKeyword('');
    };

    const handleDelete = (id: string) => {
        dispatch(removeAlert(id));
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-stone-900 border border-stone-700 rounded-xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-amber-400">Trend Watchlist</h2>
                    <button onClick={onClose} className="text-stone-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-stone-400 mb-1">Keyword (Optional)</label>
                        <input 
                            type="text" 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="e.g., AI, Crypto, Sustainable"
                            className="w-full bg-stone-800 text-white border border-stone-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-400 mb-1">Min. Velocity</label>
                        <select 
                            value={minVelocity} 
                            onChange={(e) => setMinVelocity(e.target.value)} 
                            className="w-full bg-stone-800 text-white border border-stone-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                        >
                            <option value="Any">Any</option>
                            <option value="Explosive">Explosive Only</option>
                            <option value="High">High & Above</option>
                            <option value="Steady">Steady & Above</option>
                        </select>
                    </div>
                    <button 
                        onClick={handleSave}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-lg text-sm transition-colors"
                    >
                        Set Alert
                    </button>
                </div>

                {activeAlerts.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-stone-300 mb-3 border-b border-stone-800 pb-1">Active Alerts</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {activeAlerts.map(alert => (
                                <div key={alert.id} className="flex justify-between items-center bg-stone-800 p-2 rounded border border-stone-700">
                                    <div className="text-xs">
                                        <span className="text-white font-semibold">{alert.keyword || 'All Topics'}</span>
                                        <span className="text-stone-500 mx-2">|</span>
                                        <span className={`text-${alert.minVelocity === 'Explosive' ? 'red' : 'yellow'}-400`}>{alert.minVelocity}</span>
                                    </div>
                                    <button onClick={() => handleDelete(alert.id)} className="text-red-500 hover:text-red-400 text-xs font-bold">Del</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateAlertModal;

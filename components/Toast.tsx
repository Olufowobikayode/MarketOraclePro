
import React, { useEffect } from 'react';
import { useToastContext } from '../context/ToastContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../types';
import { clearTriggeredAlert } from '../features/alerts/alertsSlice';

const Toast: React.FC = () => {
  const { toast, showToast } = useToastContext();
  const dispatch = useDispatch();
  const triggeredAlertMessage = useSelector((state: RootState) => state.alerts.triggeredAlertMessage);

  useEffect(() => {
      if (triggeredAlertMessage) {
          showToast(triggeredAlertMessage, 'success');
          // Clear it immediately so it doesn't persist or re-trigger on re-renders
          setTimeout(() => dispatch(clearTriggeredAlert()), 500); 
      }
  }, [triggeredAlertMessage, showToast, dispatch]);

  if (!toast) return null;

  const styleClasses = toast.type === 'error' 
    ? 'bg-red-800 border-red-600' 
    : 'bg-stone-800 border-amber-600';

  return (
    <div 
        className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md text-white text-sm font-semibold shadow-lg z-50 transition-all duration-300 animate-fade-in-out border ${styleClasses}`}
    >
      {toast.message}
    </div>
  );
};

export default Toast;


import { useContext } from 'react';
import { useToastContext } from '../context/ToastContext';

export const useToast = () => {
  const context = useToastContext();
  return context.showToast;
};

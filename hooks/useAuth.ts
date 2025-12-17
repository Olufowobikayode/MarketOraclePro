
import { useSelector } from 'react-redux';
import type { RootState } from '../types';

const useAuth = () => {
  const { isAuthenticated, user, loading, error } = useSelector((state: RootState) => state.auth);
  return { isAuthenticated, user, loading, error };
};

export default useAuth;

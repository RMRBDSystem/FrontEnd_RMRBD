import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const AnimatedLayout = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  );
}; 
import { useEffect, useState, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('animate-page-enter');
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      // Exit animation
      setTransitionStage('opacity-0');
      const timeout = setTimeout(() => {
        prevPath.current = location.pathname;
        setDisplayChildren(children);
        setTransitionStage('animate-page-enter');
      }, 150);
      return () => clearTimeout(timeout);
    } else {
      setDisplayChildren(children);
    }
  }, [children, location.pathname]);

  return (
    <div className={`transition-all duration-150 ${transitionStage}`}>
      {displayChildren}
    </div>
  );
}
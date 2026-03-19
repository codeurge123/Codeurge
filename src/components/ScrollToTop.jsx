import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NB } from '../constants/theme.js';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: '50%',
        background: NB.yellow,
        border: `2px solid ${NB.black}`,
        color: NB.black,
        fontSize: 20,
        fontWeight: 'bold',
        cursor: 'pointer',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 4px 8px rgba(0,0,0,0.2)`,
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
    >
      ↑
    </button>
  );
}
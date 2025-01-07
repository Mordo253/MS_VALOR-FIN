import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const AdvancedTooltip = ({
  content,
  children,
  title,
  image,
  link,
  linkP,
  position = 'top',
  theme = 'dark',
  trigger = 'hover',
  width = 'auto',
  showArrow = true,
  delay = 200, // Añadido un delay por defecto para mejor UX
  onOpen,
  onClose,
  onClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  let timeoutId = null;

  // Temas mejorados para mejor integración visual
  const themes = {
    dark: {
      bg: 'bg-gray-900/95',
      text: 'text-gray-100',
      border: 'border-gray-700',
      shadow: 'shadow-lg shadow-black/20'
    },
    light: {
      bg: 'bg-white/95',
      text: 'text-gray-800',
      border: 'border-gray-200',
      shadow: 'shadow-xl shadow-black/10'
    },
    blue: {
      bg: 'bg-blue-900/95',
      text: 'text-white',
      border: 'border-blue-700',
      shadow: 'shadow-lg shadow-blue-900/30'
    },
    gold: { // Nuevo tema que coincide con tu diseño
      bg: 'bg-[#1a1a1a]/95',
      text: 'text-[#C5A572]',
      border: 'border-[#C5A572]',
      shadow: 'shadow-lg shadow-black/40'
    }
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const spacing = 12; // Aumentado el espaciado
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let top = 0;
    let left = 0;

    // Cálculo básico inicial
    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - spacing;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + spacing;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - spacing;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + spacing;
        break;
    }

    // Ajustes para mantener el tooltip dentro de la ventana
    const margin = 8;
    
    // Ajuste horizontal
    if (left < margin) {
      left = margin;
    } else if (left + tooltipRect.width > viewport.width - margin) {
      left = viewport.width - tooltipRect.width - margin;
    }

    // Ajuste vertical
    if (top < margin) {
      top = margin;
    } else if (top + tooltipRect.height > viewport.height - margin) {
      top = viewport.height - tooltipRect.height - margin;
    }

    setCoords({ top, left });
  };

  const handleShow = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setIsVisible(true);
      onOpen?.();
    }, delay);
  };

  const handleHide = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
    onClose?.();
  };

  const handleClick = (e) => {
    onClick?.(e);
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isVisible]);

  const arrowPosition = {
    top: 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-t-6 border-x-transparent',
    bottom: 'top-[-6px] left-1/2 transform -translate-x-1/2 border-b-6 border-x-transparent',
    left: 'right-[-6px] top-1/2 transform -translate-y-1/2 border-l-6 border-y-transparent',
    right: 'left-[-6px] top-1/2 transform -translate-y-1/2 border-r-6 border-y-transparent'
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onClick={handleClick}
        onMouseEnter={trigger === 'hover' ? handleShow : undefined}
        onMouseLeave={trigger === 'hover' ? handleHide : undefined}
        className="inline-block cursor-pointer"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: width
          }}
          className={`
            ${themes.gold.bg}
            ${themes.gold.text}
            ${themes.gold.shadow}
            p-4 rounded-lg
            backdrop-blur-sm
            border border-[#C5A572]/20
            transition-opacity duration-200
            z-50
            ${width === 'auto' ? 'max-w-xs' : ''}
          `}
        >
          {showArrow && (
            <div 
              className={`
                absolute w-0 h-0 border-solid
                ${themes.gold.border}
                ${arrowPosition[position]}
              `}
            />
          )}

          <div className="space-y-3">
            {title && (
              <div className="font-bold text-base border-b border-[#C5A572]/30 pb-2">
                {title}
              </div>
            )}

            {image && (
              <img
                src={image}
                alt={title || 'Tooltip image'}
                className="w-full h-auto rounded-md"
              />
            )}

            {content && (
              <div className="text-sm leading-relaxed text-gray-300">
                {content}
              </div>
            )}

            {(link || linkP) && (
              <div className="pt-2">
                {link && (
                  <a
                    href={link}
                    className="inline-flex items-center text-sm text-[#C5A572] hover:text-[#D4B483] transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver más →
                  </a>
                )}
                {linkP && (
                  <Link
                    to={linkP}
                    className="inline-flex items-center text-sm text-[#C5A572] hover:text-[#D4B483] transition-colors duration-200"
                  >
                    Ver más →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedTooltip;
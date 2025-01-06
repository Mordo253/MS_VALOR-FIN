import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const AdvancedTooltip = ({
  // Contenido
  content,
  children,
  title,
  image,
  link,
  linkP,
  
  // Configuración
  position = 'top',
  theme = 'dark',
  trigger = 'hover', // 'hover' | 'click'
  width = 'auto',
  showArrow = true,
  delay = 0,
  
  // Eventos
  onOpen,
  onClose,
  onClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  let timeoutId = null;

  const themes = {
    dark: {
      bg: 'bg-gray-800',
      text: 'text-white',
      border: 'border-gray-700'
    },
    light: {
      bg: 'bg-white',
      text: 'text-gray-800',
      border: 'border-gray-200'
    },
    blue: {
      bg: 'bg-blue-600',
      text: 'text-white',
      border: 'border-blue-500'
    }
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const spacing = 8;

    let top = 0;
    let left = 0;

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

    setCoords({ top, left });
  };

  const handleShow = () => {
    if (delay) {
      timeoutId = setTimeout(() => {
        setIsVisible(true);
        onOpen?.();
      }, delay);
    } else {
      setIsVisible(true);
      onOpen?.();
    }
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
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isVisible]);

  const arrowPosition = {
    top: 'bottom-[-8px] left-1/2 transform -translate-x-1/2 border-t-8 border-x-transparent',
    bottom: 'top-[-8px] left-1/2 transform -translate-x-1/2 border-b-8 border-x-transparent',
    left: 'right-[-8px] top-1/2 transform -translate-y-1/2 border-l-8 border-y-transparent',
    right: 'left-[-8px] top-1/2 transform -translate-y-1/2 border-r-8 border-y-transparent'
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onClick={handleClick}
        onMouseEnter={trigger === 'hover' ? handleShow : undefined}
        onMouseLeave={trigger === 'hover' ? handleHide : undefined}
        className="inline-block"
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
            ${themes[theme].bg}
            ${themes[theme].text}
            p-3 rounded-lg shadow-lg z-50
            ${width === 'auto' ? 'whitespace-nowrap' : ''}
          `}
        >
          {showArrow && (
            <div 
              className={`
                absolute w-0 h-0 border-solid
                ${themes[theme].border}
                ${arrowPosition[position]}
              `}
            />
          )}

          {/* Contenido del Tooltip */}
          <div className="space-y-2">
            {title && (
              <div className="font-semibold border-b border-current pb-1">
                {title}
              </div>
            )}

            {image && (
              <img
                src={image}
                alt={title || 'Tooltip image'}
                className="w-full h-auto rounded"
              />
            )}

            {/* Aquí es donde hemos modificado para que el texto sea un párrafo */}
            {content && (
              <div className="whitespace-pre-line text-sm leading-relaxed">
                {content}
              </div>
            )}

            {link && (
              <a
                href={link}
                className="block text-sm hover:underline mt-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver más →
              </a>
            )}
            {linkP && (
              <Link
                to={linkP}
                className="block text-sm hover:underline mt-1"
                rel="noopener noreferrer"
              >
                Ver más →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedTooltip;

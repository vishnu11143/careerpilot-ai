/* ============================================
   CareerPilot AI — Dropdown Component
   Trigger + popup menu with click-outside close
   ============================================ */

import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.trigger — the clickable trigger element
 * @param {'left'|'right'} [props.align='right'] — menu alignment
 * @param {React.ReactNode} props.children — menu content
 */
export function Dropdown({
  trigger,
  align = 'right',
  children,
  className,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <div className={cn('dropdown', className)} ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'dropdown-menu',
            `dropdown-${align}`,
            'animate-fade-in'
          )}
        >
          {typeof children === 'function'
            ? children({ close: () => setOpen(false) })
            : children}
        </div>
      )}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.icon] — optional left icon
 * @param {boolean} [props.danger] — danger variant
 */
export function DropdownItem({
  icon,
  danger = false,
  children,
  className,
  onClick,
  ...props
}) {
  return (
    <button
      className={cn(
        'dropdown-item',
        danger && 'dropdown-item-danger',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="dropdown-item-icon">{icon}</span>}
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="dropdown-divider" />;
}

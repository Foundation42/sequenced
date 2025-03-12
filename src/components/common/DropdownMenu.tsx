import React, { useState, useRef, useEffect } from 'react';

interface DropdownMenuItem {
  id: string;
  label: string;
  action?: () => void;
  divider?: boolean;
  disabled?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  className?: string;
  position?: 'left' | 'right';
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  className = '',
  position = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (item: DropdownMenuItem) => {
    if (!item.disabled && item.action) {
      item.action();
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={toggleMenu}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`dropdown-menu dropdown-${position}`}>
          <ul className="dropdown-list">
            {items.map((item) => (
              <li
                key={item.id}
                className={`dropdown-item ${item.divider ? 'dropdown-divider' : ''} ${
                  item.disabled ? 'dropdown-item-disabled' : ''
                }`}
                onClick={() => handleMenuItemClick(item)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
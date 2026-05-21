import { useEffect, useRef, useState } from 'react';
import { ChevronDown, KeyRound, LogOut, Mail } from 'lucide-react';

export default function UserMenu({ email, initial, onPassword, onLogout }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 shadow-sm transition-all hover:border-[var(--color-accent-gold)] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-gold)]"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-secondary-blue)] to-[var(--color-primary-navy)] text-sm font-bold text-white shadow-inner">
          {initial}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
        >
          <div className="border-b border-gray-100 bg-[var(--color-surface-soft)] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Signed in as
            </p>
            <p className="mt-1.5 flex items-start gap-2 text-sm font-semibold text-[var(--color-primary-navy)]">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-gold)]" />
              <span className="break-all">{email}</span>
            </p>
          </div>

          <div className="p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onPassword();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <KeyRound className="h-4 w-4 text-[var(--color-secondary-blue)]" />
              Change password
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="mt-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

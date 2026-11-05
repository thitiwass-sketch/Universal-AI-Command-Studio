import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  LogIn,
  LogOut,
  User as UserIcon,
  Bookmark,
  History,
  Shield,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { loginWithGoogle, loginAsGuest, logoutUser } from '../lib/firebase';

interface AuthUserMenuProps {
  user: User | null;
  onOpenHistory: () => void;
  favoritesCount: number;
  language: 'th' | 'en';
}

export const AuthUserMenu: React.FC<AuthUserMenuProps> = ({
  user,
  onOpenHistory,
  favoritesCount,
  language
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      setIsOpen(false);
    } catch (err) {
      console.error('Google login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await loginAsGuest();
      setIsOpen(false);
    } catch (err) {
      console.error('Guest login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsOpen(false);
  };

  if (!user) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-500/60 hover:bg-cyan-900/80 hover:border-cyan-400 text-cyan-200 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
          aria-expanded={isOpen}
          aria-label="Sign In or Connect Firebase Account"
        >
          <LogIn className="w-3.5 h-3.5 text-cyan-400" />
          <span>{language === 'th' ? 'เข้าสู่ระบบ (Sign In)' : 'Sign In'}</span>
          <ChevronDown className="w-3 h-3 text-cyan-400" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 animate-fadeIn text-xs">
            <div className="font-bold text-white mb-1">
              {language === 'th' ? 'เชื่อมต่อบัญชี Firebase' : 'Connect Firebase Account'}
            </div>
            <p className="text-slate-400 text-[11px] mb-3">
              {language === 'th'
                ? 'บันทึกประวัติการรันคำสั่ง และจัดการคำสั่งโปรดบนคลาวด์'
                : 'Sync your prompt executions and bookmark favorite commands on Firestore.'}
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer mb-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
            </button>

            <button
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[11px]"
            >
              <span>{language === 'th' ? 'เข้าใช้แบบ Scholar Guest' : 'Continue as Guest'}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 text-xs text-slate-200 transition-all cursor-pointer"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-5 h-5 rounded-full object-cover border border-cyan-400/50"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold text-[10px]">
            {user.displayName?.charAt(0) || 'U'}
          </div>
        )}
        <span className="font-medium max-w-[100px] truncate hidden sm:inline">
          {user.displayName || (user.isAnonymous ? 'Guest Scholar' : user.email)}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 animate-fadeIn text-xs">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800 mb-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-8 h-8 rounded-full border border-cyan-400"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold">
                {user.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="overflow-hidden">
              <div className="font-bold text-white truncate">
                {user.displayName || 'Scholar User'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {user.email || 'Anonymous Session'}
              </div>
            </div>
          </div>

          <div className="space-y-1 mb-2">
            <button
              onClick={() => {
                onOpenHistory();
                setIsOpen(false);
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'th' ? 'ประวัติคำสั่งบน Firestore' : 'Execution History'}</span>
              </span>
              <span className="text-[10px] px-1.5 rounded bg-slate-800 text-slate-400 font-mono">
                Cloud
              </span>
            </button>

            <div className="px-2.5 py-1.5 rounded-lg text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'th' ? 'คำสั่งที่บันทึกไว้' : 'Saved Favorites'}</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-amber-300">
                {favoritesCount}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-950/40 text-rose-300 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'ออกจากระบบ (Sign Out)' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

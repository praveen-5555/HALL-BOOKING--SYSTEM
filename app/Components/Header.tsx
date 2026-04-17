"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("role");
    if (name && role) {
      Promise.resolve().then(() => {
        setUser((prev) => 
          prev?.name === name && prev?.role === role ? prev : { name, role }
        );
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/");
    window.location.reload(); // Force refresh to update all components
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/Home?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/Home');
    }
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-white hover:opacity-80 transition-opacity flex-shrink-0">
          Luxe<span className="text-primary-red">Halls</span>
        </Link>
        
        <div className="flex-1 max-w-md hidden lg:block">
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              placeholder="Search for premium halls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-red/50 focus:border-primary-red/50 transition-all group-hover:bg-white/10"
            />
            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-primary-red transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </form>
        </div>

        <nav className="hidden md:flex gap-8 items-center flex-shrink-0">
          <Link href="/Home" className="text-[13px] font-semibold tracking-wide uppercase text-zinc-400 hover:text-primary-red transition-colors">Home</Link>
          <Link href="/About" className="text-[13px] font-semibold tracking-wide uppercase text-zinc-400 hover:text-primary-red transition-colors">About</Link>
          
          {user ? (
            <Link href="/User" className="text-[13px] font-semibold tracking-wide uppercase text-zinc-400 hover:text-primary-red transition-colors">My Bookings</Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-6 flex-shrink-0">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-[13px] font-bold text-white uppercase tracking-wider leading-none">{user.name}</span>
                <span className="text-[10px] font-medium text-primary-red uppercase tracking-widest mt-1 opacity-80">{user.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-[13px] font-semibold tracking-wide uppercase bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-full hover:bg-white/10 transition-all hover:border-white/20"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/Login" className="text-[13px] font-semibold tracking-wide uppercase text-zinc-400 hover:text-white transition-colors">Log in</Link>
              <Link href="/Signup" className="text-[13px] font-semibold tracking-wide uppercase bg-primary-red text-white px-6 py-2.5 rounded-full hover:brightness-110 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
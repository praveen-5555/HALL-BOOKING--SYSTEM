import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-20 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-white mb-6 block">
              Luxe<span className="text-primary-red">Halls</span>
            </Link>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed mb-8">
              SDHalls is the premier destination for discovering and booking the most exquisite event spaces. We bridge the gap between vision and reality with curated excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-4">
              <li><Link href="/Home" className="text-zinc-400 hover:text-primary-red transition-colors text-sm font-medium">Home</Link></li>
              <li><Link href="/Home" className="text-zinc-400 hover:text-primary-red transition-colors text-sm font-medium">Browse Halls</Link></li>
              <li><Link href="/About" className="text-zinc-400 hover:text-primary-red transition-colors text-sm font-medium">About Us</Link></li>
            </ul>
          </div>

          {/* CTA Section */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Get Started</h4>
            <Link href="/Home">
              <button className="w-full bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-red hover:border-primary-red transition-all duration-300 text-sm">
                Explore All Halls
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs">
            &copy; {new Date().getFullYear()} SDHalls. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors text-xs">Privacy Policy</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors text-xs">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
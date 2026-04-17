import fs from 'fs/promises';

const dirs = [
  'app/Admin/Booking',
  'app/Admin/Dashboard',
  'app/Admin/Halls',
  'app/Admin/Payment',
  'app/Admin/Users Management',
  'app/Components',
  'app/dashboard',
  'app/Home',
  'app/Login',
  'app/Signup',
  'app/User'
];

const files = {
  'app/Admin/page.tsx': `export default function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-6">Admin Panel</h1>
      <p className="text-gray-300">Welcome to the Admin Portal. Please select an option from the sidebar.</p>
    </div>
  );
}`,
  'app/Admin/Booking/page.tsx': `export default function AdminBooking() {
  return <div className="p-8"><h1 className="text-2xl font-bold text-white mb-4">Bookings Management</h1></div>;
}`,
  'app/Admin/Dashboard/page.tsx': `export default function AdminDashboard() {
  return <div className="p-8"><h1 className="text-2xl font-bold text-white mb-4">Admin Dashboard</h1></div>;
}`,
  'app/Admin/Halls/page.tsx': `export default function AdminHalls() {
  return <div className="p-8"><h1 className="text-2xl font-bold text-white mb-4">Halls Management</h1></div>;
}`,
  'app/Admin/Payment/page.tsx': `export default function AdminPayment() {
  return <div className="p-8"><h1 className="text-2xl font-bold text-white mb-4">Payment Management</h1></div>;
}`,
  'app/Admin/Users Management/page.tsx': `export default function AdminUsersManagement() {
  return <div className="p-8"><h1 className="text-2xl font-bold text-white mb-4">Users Management</h1></div>;
}`,
  'app/Components/Header.tsx': `import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed w-full top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 hover:opacity-80 transition-opacity">
          SDHalls
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/Home" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Home</Link>
          <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Dashboard</Link>
          <Link href="/Admin" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Admin</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/Login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log in</Link>
          <Link href="/Signup" className="text-sm font-medium bg-white text-black px-5 py-2.5 rounded-full hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]">Sign up</Link>
        </div>
      </div>
    </header>
  );
}`,
  'app/Components/Footer.tsx': `export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-white/10 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-xl font-bold text-white mb-4">SDHalls Booking</h2>
        <p className="text-gray-500 text-sm">© {(new Date().getFullYear())} SDHalls. All rights reserved. Premium venues for your perfect events.</p>
      </div>
    </footer>
  );
}`,
  'app/Components/HallCard.tsx': `import Image from 'next/image';

interface HallCardProps {
  name: string;
  price: string;
  capacity: string;
  image: string;
}

export default function HallCard({ name, price, capacity, image }: HallCardProps) {
  return (
    <div className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
      <div className="w-full h-64 relative bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent z-10" />
        <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10">
          Superhost
        </div>
      </div>
      <div className="p-6 relative z-20">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-blue-500 transition-all">{name}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
          <span className="flex items-center gap-1"><span className="w-4 h-4 bg-gray-600 rounded-full inline-block"></span> {capacity}</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-lg font-bold text-white">{price} <span className="text-sm font-normal text-gray-500">/ day</span></p>
          <button className="bg-white/10 hover:bg-white text-white hover:text-black px-4 py-2 rounded-full text-sm font-medium transition-all duration-300">Book Now</button>
        </div>
      </div>
    </div>
  );
}`,
  'app/dashboard/page.tsx': `export default function Dashboard() {
  return <div className="p-8 pt-24 min-h-screen bg-[#050505]"><h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-4">User Dashboard</h1><p className="text-gray-400">Manage your bookings here.</p></div>;
}`,
  'app/Home/page.tsx': `export default function HomePage() {
  return <div className="p-8 pt-24 min-h-screen bg-[#050505]"><h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-4">Welcome to Home</h1><p className="text-gray-400">Discover premium halls in your area.</p></div>;
}`,
  'app/Login/page.tsx': `export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -top-[200px] -left-[100px] animate-pulse"></div>
      <div className="z-10 w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-white text-center mb-8">Welcome Back</h2>
        <form className="flex flex-col gap-5">
          <input className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600" placeholder="Email" type="email" />
          <input className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600" placeholder="Password" type="password" />
          <button className="bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold rounded-xl py-3 mt-2 hover:shadow-[0_10px_20px_-10px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 transition-all duration-300">Log In</button>
        </form>
      </div>
    </div>
  );
}`,
  'app/Signup/page.tsx': `export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -bottom-[200px] -right-[100px] animate-pulse"></div>
      <div className="z-10 w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-white text-center mb-8">Create an Account</h2>
        <form className="flex flex-col gap-5">
          <input className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-600" placeholder="Full Name" type="text" />
          <input className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-600" placeholder="Email address" type="email" />
          <input className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-600" placeholder="Password" type="password" />
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl py-3 mt-2 hover:shadow-[0_10px_20px_-10px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 transition-all duration-300">Sign Up</button>
        </form>
      </div>
    </div>
  );
}`,
  'app/User/page.tsx': `export default function UserProfile() {
  return <div className="p-8 pt-24 min-h-screen bg-[#050505]"><h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">User Profile</h1></div>;
}`
};

async function createProject() {
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
    console.log("Created directory: " + dir);
  }
  for (const [filePath, content] of Object.entries(files)) {
    await fs.writeFile(filePath, content);
    console.log("Created file: " + filePath);
  }
}

createProject().catch(console.error);

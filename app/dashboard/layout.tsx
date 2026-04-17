export default function AdminPage() {
  return (
    <div className="animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome to the Admin Portal. Here&apos;s what&apos;s happening today.</p>
        </div>
        <button className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-[#111] p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="text-gray-400 text-sm font-medium mb-2">Total Bookings</h3>
          <p className="text-4xl font-bold text-white mb-2">1,248</p>
          <p className="text-emerald-400 text-sm font-medium">from last month</p>
        </div>
        
        <div className="bg-[#111] p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group hover:border-purple-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="text-gray-400 text-sm font-medium mb-2">Total Revenue</h3>
          <p className="text-4xl font-bold text-white mb-2">₹84,300</p>
          <p className="text-emerald-400 text-sm font-medium"> from last month</p>
        </div>

        <div className="bg-[#111] p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group hover:border-teal-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="text-gray-400 text-sm font-medium mb-2">Active Users</h3>
          <p className="text-4xl font-bold text-white mb-2">8,590</p>
          <p className="text-emerald-400 text-sm font-medium"> from last month</p>
        </div>

        <div className="bg-[#111] p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group hover:border-orange-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="text-gray-400 text-sm font-medium mb-2">Available Halls</h3>
          <p className="text-4xl font-bold text-white mb-2">45</p>
          <p className="text-gray-500 text-sm font-medium">Out of 60 total</p>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
          <a href="/Admin/Booking" className="text-sm text-blue-400 hover:text-blue-300">View All →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1a1a1a]">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Hall</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-white">#BK-9840</td>
                <td className="px-6 py-4">
                  <p className="text-sm text-white">Sarah Jenkins</p>
                  <p className="text-xs text-gray-500">sarah.j@example.com</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">Grand Crystal Ballroom</td>
                <td className="px-6 py-4 text-sm font-medium text-white">₹1,200</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Confirmed</span>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-white">#BK-9839</td>
                <td className="px-6 py-4">
                  <p className="text-sm text-white">Michael Chen</p>
                  <p className="text-xs text-gray-500">m.chen@example.com</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">Oceanview Terrace</td>
                <td className="px-6 py-4 text-sm font-medium text-white">₹850</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Pending</span>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-white">#BK-9838</td>
                <td className="px-6 py-4">
                  <p className="text-sm text-white">Emma Thompson</p>
                  <p className="text-xs text-gray-500">emma.t@example.com</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">The Royal Banquet</td>
                <td className="px-6 py-4 text-sm font-medium text-white">₹2,000</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Confirmed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import { BoltIcon,ChatIcon,PillIcon,DoctorIcon } from "../../../components/Icons";

const Dashboard = () => {
  return (
    <div>
      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-sky-50 p-6 rounded-[15px] cursor-pointer hover:shadow-lg transition" style={{ backgroundColor: "rgb(198, 40, 40)" }}>
            <div className="text-3xl mb-3"><BoltIcon className="h-5 w-5" /></div>
            <h3 className="text-[22px]">Start Triage</h3>
            <p className="text-[16px] mt-2">Check your symptoms with smart health AI</p>
          </div>
          <div className="bg-yellow-500 text-sky-50 p-6 rounded-[15px] cursor-pointer hover:shadow-lg transition">
            <div className="text-3xl mb-3"><DoctorIcon className="h-5 w-5" /></div>
            <h3 className="text-[22px]">Book Doctor</h3>
            <p className="text-[16px] mt-2">Find and book top specialists instantly</p>
          </div>
          <div className="bg-blue-400 text-sky-50 p-6 rounded-[15px] cursor-pointer hover:shadow-lg transition">
            <div className="text-3xl mb-3"> <ChatIcon className="h-5 w-5" /></div>
            <h3 className="text-[22px]">Messages</h3>
            <p className="text-[16px] mt-2">Chat securely with your doctor</p>
          </div>
          <div className="bg-green-500 text-sky-50 p-6 rounded-[15px] cursor-pointer hover:shadow-lg transition">
            <div className="text-3xl mb-3"><PillIcon className="h-5 w-5" /></div>
            <h3 className="text-[22px]">Prescriptions</h3>
            <p className="text-[16px] mt-2">Access your doctor's prescriptions in one place.</p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-4">AI triage limit</h3>
          <p className="text-gray-600 text-sm mb-4">LIMIT: 3 EMERGENCY CHECKS PER PERIOD</p>
          <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
            {/* Placeholder for chart */}
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-500">3</div>
              <div className="text-sm text-gray-600">LIMIT</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-4">Appointments</h3>
          <p className="text-gray-600 text-sm mb-4">
            Period: {new Date().toISOString().split("T")[0]} – {
              new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
            }
          </p>
          <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
            {/* Placeholder for chart */}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">0</div>
              <div className="text-sm text-gray-600">TOTAL</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

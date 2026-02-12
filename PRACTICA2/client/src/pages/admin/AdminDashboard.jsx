const AdminDashboard = () => (
  <div className="p-8 bg-slate-900 min-h-screen text-white">
    <h1 className="text-3xl font-black">Panel de Administración</h1>
    <div className="grid grid-cols-3 gap-6 mt-8">
      <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
        <p className="text-slate-400">Total Ventas</p>
        <h2 className="text-4xl font-bold">$12,450</h2>
      </div>
      {/* Más stats de admin aquí */}
    </div>
  </div>
);

export default AdminDashboard;
import React, { useState } from 'react';
import { Truck, User, Mail, Phone, Lock } from 'lucide-react';
import { registerDelivery } from '../../services/admin.service';

const RegisterDelivery = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerDelivery(formData);
      setStatus({ type: 'success', msg: 'Repartidor registrado exitosamente' });
      setFormData({ name: '', email: '', phone: '', password: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
        <Truck className="text-indigo-600" /> Nuevo Repartidor
      </h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-sm border space-y-4">
        {status.msg && (
          <div className={`p-4 rounded-xl text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status.msg}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-bold mb-1">Nombre del Repartidor</label>
          <input type="text" required className="w-full p-3 bg-slate-50 border rounded-xl" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} value={formData.name} />
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-1">Email</label>
          <input type="email" required className="w-full p-3 bg-slate-50 border rounded-xl"
            onChange={(e) => setFormData({...formData, email: e.target.value})} value={formData.email} />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Teléfono</label>
          <input type="tel" required className="w-full p-3 bg-slate-50 border rounded-xl"
            onChange={(e) => setFormData({...formData, phone: e.target.value})} value={formData.phone} />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Contraseña Temporal</label>
          <input type="password" required className="w-full p-3 bg-slate-50 border rounded-xl"
            onChange={(e) => setFormData({...formData, password: e.target.value})} value={formData.password} />
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
          Dar de Alta Repartidor
        </button>
      </form>
    </div>
  );
};

export default RegisterDelivery;
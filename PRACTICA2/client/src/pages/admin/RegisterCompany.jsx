import React, { useState } from 'react';
import { Building2, Mail, Phone, Lock, MapPin } from 'lucide-react';
import { registerCompany } from '../../services/admin.service';

const RegisterCompany = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerCompany(formData);
      setStatus({ type: 'success', msg: 'Empresa vinculada correctamente' });
      setFormData({ name: '', email: '', phone: '', password: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
        <Building2 className="text-indigo-600" /> Nueva Empresa / Restaurante
      </h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-sm border space-y-4">
        {status.msg && (
          <div className={`p-4 rounded-xl text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status.msg}
          </div>
        )}
        
        <input placeholder="Nombre de la Empresa" type="text" required className="w-full p-3 bg-slate-50 border rounded-xl" 
          onChange={(e) => setFormData({...formData, name: e.target.value})} value={formData.name} />
        
        <input placeholder="Email Corporativo" type="email" required className="w-full p-3 bg-slate-50 border rounded-xl"
          onChange={(e) => setFormData({...formData, email: e.target.value})} value={formData.email} />

        <input placeholder="Teléfono de contacto" type="tel" required className="w-full p-3 bg-slate-50 border rounded-xl"
          onChange={(e) => setFormData({...formData, phone: e.target.value})} value={formData.phone} />

        <input placeholder="Contraseña para el portal" type="password" required className="w-full p-3 bg-slate-50 border rounded-xl"
          onChange={(e) => setFormData({...formData, password: e.target.value})} value={formData.password} />

        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
          Registrar Empresa
        </button>
      </form>
    </div>
  );
};

export default RegisterCompany;
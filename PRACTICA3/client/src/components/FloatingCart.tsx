import { ShoppingCart, Trash2, Send, MapPin, NotebookText } from 'lucide-react';
import { useState } from 'react';
import { createOrder } from '../services/users-service';

const FloatingCart = ({ cart, restaurantId, total, clearCart }: any) => {
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!address) return alert("Por favor ingresa una dirección");

        setLoading(true);
        const dto = {
            restaurantId,
            deliveryAddress: address,
            notes,
            items: cart.map((i: any) => ({ menuItemId: i.menuItemId, quantity: i.quantity }))
        };

        try {
            const res = await createOrder(dto);
            alert(`¡Pedido Creado! ID: ${res.orderId}`);
            clearCart();
        } catch (error) {
            alert("Error al procesar el pedido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-[60] p-8 flex flex-col border-l border-slate-100">
            <div className="flex items-center gap-3 mb-8 border-b pb-4">
                <ShoppingCart className="text-brand-primary" />
                <h2 className="text-xl font-black italic uppercase tracking-tighter">Tu Carrito</h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
                {cart.map((item: any) => (
                    <div key={item.menuItemId} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                        <div>
                            <p className="font-black text-sm text-slate-800 uppercase">{item.name}</p>
                            <p className="text-xs font-bold text-slate-400">Cant: {item.quantity} x Q{item.price}</p>
                        </div>
                        <p className="font-black text-slate-900">Q{item.price * item.quantity}</p>
                    </div>
                ))}
            </div>

            <div className="mt-auto space-y-6 pt-6 border-t">
                {/* Input de Dirección */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                        <MapPin size={12} /> Dirección de Entrega
                    </label>
                    <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold"
                        placeholder="Ej. 10 Calle 5-44 Zona 10..."
                    />
                </div>

                {/* Input de Notas */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                        <NotebookText size={12} /> Notas (Opcional)
                    </label>
                    <input
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold"
                        placeholder="Sin cebolla, puerta roja..."
                    />
                </div>

                <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-slate-400 uppercase">Total a pagar:</span>
                    <span className="text-3xl font-black italic text-brand-primary">Q{total.toFixed(2)}</span>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={loading || cart.length === 0}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-primary transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                    {loading ? "Procesando..." : <><Send size={18} /> Confirmar Pedido</>}
                </button>
            </div>
        </div>
    );
};
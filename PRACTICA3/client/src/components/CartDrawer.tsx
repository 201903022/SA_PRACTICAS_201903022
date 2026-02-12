import { useState } from 'react';
import {
    ShoppingBasket, X, Trash2, MapPin,
    NotebookText, Send, Loader2, CheckCircle, AlertCircle,
    CloudCog
} from 'lucide-react';
import { useCart } from '../context/CarteContext';
import { createOrder } from '../services/users-service';

export const CartDrawer = () => {
    const {
        cartItems,
        total,
        restaurantId,
        restaurantName,
        clearCart,
        removeFromCart
    } = useCart();

    const [isOpen, setIsOpen] = useState(false);
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>("");

    if (cartItems.length === 0 && orderStatus === 'idle') return null;

    const handleCheckout = async () => {
        if (!address.trim()) return;

        setLoading(true);
        setErrorMessage("");

        const orderData = {
            restaurantId: restaurantId!,
            deliveryAddress: address,
            notes: notes || undefined,
            items: cartItems.map(item => ({
                menuItemId: item.menuItemId,
                quantity: Number(item.quantity),
                expectedPrice: Number(item.price)
            }))
        };

        try {
            await createOrder(orderData);

            setOrderStatus('success');
            setTimeout(() => {
                clearCart();
                setOrderStatus('idle');
                setIsOpen(false);
                setAddress("");
                setNotes("");
            }, 3500);

        } catch (error: any) {
            setOrderStatus('error');

            let rawMessage = error.response?.data?.message || "Error inesperado";
            if (Array.isArray(rawMessage)) rawMessage = rawMessage[0];

            // La limpieza que ya confirmamos que funciona en tu consola
            const cleanMessage = rawMessage.replace(/^[\d\s]+[A-Z_]+:\s*/, '').trim();

            // IMPORTANTE: Guardar el mensaje LIMPIO en el estado
            setErrorMessage(cleanMessage);

            setTimeout(() => {
                setOrderStatus('idle');
                setErrorMessage("");
            }, 8000);

            setTimeout(() => {
                setOrderStatus('idle');
                setErrorMessage("");
            }, 8000); // 8 segundos para que el usuario pueda leer el error de precio
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-brand-primary text-white p-6 rounded-full shadow-2xl z-50 animate-bounce flex items-center gap-3 hover:scale-105 transition-transform"
            >
                <ShoppingBasket />
                <span className="font-black italic text-lg text-white">Q{total.toFixed(2)}</span>
                <span className="bg-white text-brand-primary w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[60] flex justify-end">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">

                        {/* BANNER DE ERROR LIMPIO */}
                        {orderStatus === 'error' && (
                            <div className="absolute top-6 left-6 right-6 bg-red-50 border-2 border-red-200 p-4 rounded-2xl flex items-start gap-3 text-red-700 animate-in slide-in-from-top duration-300 z-[80] shadow-xl">
                                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-red-500">Error de Validación</p>
                                    <p className="text-xs font-bold leading-tight italic">{errorMessage}</p>
                                </div>
                            </div>
                        )}

                        {/* PANTALLA DE ÉXITO */}
                        {orderStatus === 'success' && (
                            <div className="absolute inset-0 bg-white z-[90] flex flex-col items-center justify-center p-10 text-center animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <CheckCircle size={40} />
                                </div>
                                <h2 className="text-2xl font-black italic uppercase text-slate-900">¡Orden Creada!</h2>
                                <p className="text-slate-500 text-sm font-bold mt-2 leading-relaxed italic">
                                    Tu pedido para <span className="text-brand-primary">{restaurantName}</span> está en proceso.
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 -left-14 bg-white p-3 rounded-full shadow-xl text-slate-400 hover:text-brand-primary"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Tu Pedido</h2>
                            <p className="text-brand-primary font-bold text-[10px] uppercase mt-1 tracking-widest">
                                Comprando en: <span className="text-slate-600">{restaurantName}</span>
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                            {cartItems.map((item) => (
                                <div key={item.menuItemId} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="flex-1">
                                        <p className="font-black text-sm text-slate-800 uppercase leading-tight">{item.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 italic">
                                            {item.quantity} x Q{item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="font-black text-slate-900 italic text-sm">Q{(item.price * item.quantity).toFixed(2)}</p>
                                        <button
                                            onClick={() => removeFromCart(item.menuItemId)}
                                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-6 space-y-4">
                            <div className="space-y-3">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Dirección de Entrega</label>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-slate-300" />
                                        <input
                                            className="bg-transparent border-none w-full text-xs font-bold outline-none text-slate-700 italic"
                                            placeholder="¿A dónde lo llevamos?"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Notas (Opcional)</label>
                                    <div className="flex items-center gap-2">
                                        <NotebookText size={16} className="text-slate-300" />
                                        <input
                                            className="bg-transparent border-none w-full text-xs font-bold outline-none text-slate-700 italic"
                                            placeholder="Ej. Tocar el timbre fuerte"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-4 pt-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Total del Pedido</span>
                                <span className="text-3xl font-black italic text-slate-900 leading-none">
                                    <span className="text-brand-primary text-sm not-italic mr-1">Q</span>
                                    {total.toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading || cartItems.length === 0 || !address.trim()}
                                className="w-full bg-brand-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <><Send size={18} /> Confirmar Pedido</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
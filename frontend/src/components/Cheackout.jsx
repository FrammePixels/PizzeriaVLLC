import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Trash2, ChevronRight, Zap, Lock, AlertCircle, CreditCard, MapPin, User, Mail, Phone, Package } from 'lucide-react';

export default function NeonCart() {
  const { cartShop, removeItem, deleteCart, PriceFinal, priceAfterDiscount, applyDiscount } = useAuth();

  const [activeCode, setActiveCode] = useState(null);
  const [glowIndex, setGlowIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    DireccionEntrega: ''
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIndex(prev => (prev + 1) % (cartShop.length || 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [cartShop.length]);

  const handleChangeCustomer = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleChangePayment = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const numbersOnly = value.replace(/\D/g, '');
      const formatted = numbersOnly.replace(/(\d{4})/g, '$1 ').trim();
      if (numbersOnly.length <= 16) {
        setPaymentData({ ...paymentData, [name]: formatted });
      }
    } else if (name === 'expiryDate') {
      const numbersOnly = value.replace(/\D/g, '');
      let formatted = numbersOnly;
      if (numbersOnly.length >= 2) {
        formatted = numbersOnly.slice(0, 2) + '/' + numbersOnly.slice(2, 4);
      }
      if (numbersOnly.length <= 4) {
        setPaymentData({ ...paymentData, [name]: formatted });
      }
    } else if (name === 'cvv') {
      const numbersOnly = value.replace(/\D/g, '');
      if (numbersOnly.length <= 4) {
        setPaymentData({ ...paymentData, [name]: numbersOnly });
      }
    } else if (name === 'cardName') {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
      setPaymentData({ ...paymentData, [name]: lettersOnly.toUpperCase() });
    } else {
      setPaymentData({ ...paymentData, [name]: value });
    }
  };

  const handleCheckout = async () => {
    if (!cartShop.length) {
      setMessage('❌ Cart is empty');
      return;
    }

    if (!customer.name || !customer.email || !customer.address || !customer.phone) {
      setMessage('❌ Please fill in all customer details');
      return;
    }

    if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv || !paymentData.DireccionEntrega) {
      setMessage('❌ Please fill in all payment and delivery information');
      return;
    }

    // Validar número de tarjeta (debe tener 16 dígitos)
    const cardNumberClean = paymentData.cardNumber.replace(/\s/g, '');
    if (cardNumberClean.length !== 16) {
      setMessage('❌ Card number must be 16 digits');
      return;
    }

    // Validar fecha de expiración
    const expiryClean = paymentData.expiryDate.replace(/\//g, '');
    if (expiryClean.length !== 4) {
      setMessage('❌ Invalid expiry date');
      return;
    }

    // Validar CVV
    if (paymentData.cvv.length < 3 || paymentData.cvv.length > 4) {
      setMessage('❌ CVV must be 3 or 4 digits');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const subtotal = PriceFinal();
      const total = priceAfterDiscount();
      const discountAmount = activeCode ? subtotal - total : 0;

      const orderData = {
        customer,
        products: cartShop.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: subtotal,
        total: total,
        discount: discountAmount,
        discountCode: activeCode || null,
        date: new Date().toISOString(),
        CardNumber: paymentData.cardNumber.replace(/\s/g, ''),
        CardName: paymentData.cardName,
        ExpiryDate: paymentData.expiryDate,
        CVV: paymentData.cvv,
        DireccionEntrega: paymentData.DireccionEntrega
      };

      console.log('Datos enviados al backend:', orderData);

      const response = await fetch('http://localhost:4019/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(`Server response error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        console.error('Error del servidor:', data);
        throw new Error(data.message || data.error || `HTTP Error ${response.status}`);
      }

      setMessage('✅ Order created successfully!');
      deleteCart();
      setCustomer({ name: '', email: '', address: '', phone: '' });
      setPaymentData({ cardNumber: '', cardName: '', expiryDate: '', cvv: '', DireccionEntrega: '' });
      setActiveCode(null);
    } catch (err) {
      console.error('Error completo:', err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const currentSubtotal = PriceFinal();
  const currentTotal = priceAfterDiscount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 relative overflow-hidden">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-700" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
              <p className="text-gray-400 text-sm">{cartShop.length} items in your cart</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-12 grid lg:grid-cols-12 gap-6">
        {/* Productos en el carrito */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-400" />
              Your Items
            </h2>
            
            {cartShop.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartShop.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`p-4 rounded-lg bg-gray-800/50 border border-gray-700 flex justify-between items-center transition-all hover:border-cyan-500/50 ${glowIndex === index ? 'shadow-lg shadow-cyan-500/30 border-cyan-500/50' : ''}`}
                  >
                    <div className="flex-1">
                      <p className="text-white font-semibold">{item.name}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors group"
                    >
                      <Trash2 className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Formulario de checkout */}
        <div className="lg:col-span-5 space-y-4">
          {/* Información del cliente */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                Customer Information
              </h3>

              <div className="space-y-3">
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={customer.name}
                    onChange={handleChangeCustomer}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={customer.email}
                    onChange={handleChangeCustomer}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Billing Address"
                    value={customer.address}
                    onChange={handleChangeCustomer}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={customer.phone}
                    onChange={handleChangeCustomer}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Información de pago y entrega */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500" />
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-pink-400" />
                Payment & Delivery
              </h3>

              <div className="space-y-3">
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={paymentData.cardNumber}
                    onChange={handleChangePayment}
                    maxLength="19"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all font-mono text-lg tracking-wider"
                  />
                  <span className="absolute right-3 top-3 text-xs text-gray-500">
                    {paymentData.cardNumber.replace(/\s/g, '').length}/16
                  </span>
                </div>

                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="cardName"
                    placeholder="Cardholder Name"
                    value={paymentData.cardName}
                    onChange={handleChangePayment}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={handleChangePayment}
                      maxLength="5"
                      className="w-full px-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all font-mono text-center"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      name="cvv"
                      placeholder="CVV"
                      value={paymentData.cvv}
                      onChange={handleChangePayment}
                      maxLength="4"
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all font-mono text-center"
                    />
                  </div>
                </div>

                <div className="relative mt-4 pt-4 border-t border-gray-700">
                  <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-7" />
                  <label className="text-xs text-gray-400 mb-1 block">Delivery Address</label>
                  <input
                    type="text"
                    name="DireccionEntrega"
                    placeholder="Street, City, Postal Code"
                    value={paymentData.DireccionEntrega}
                    onChange={handleChangePayment}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de orden */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500" />
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold">${currentSubtotal.toFixed(2)}</span>
                </div>
                
                {activeCode && (
                  <div className="flex justify-between text-purple-400">
                    <span className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Discount
                    </span>
                    <span className="font-semibold">-${(currentSubtotal - currentTotal).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold text-3xl">
                    ${currentTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || !cartShop.length}
                className={`w-full py-4 rounded-lg font-bold text-white transition-all relative overflow-hidden group mt-4
                  ${loading
                    ? 'bg-gray-700 cursor-wait'
                    : 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02]'
                  } flex items-center justify-center gap-2`}
              >
                <span className="relative z-10">
                  {loading ? 'Processing Order...' : 'Complete Purchase'}
                </span>
                {!loading && (
                  <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                )}
                {!loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>

              {message && (
                <div className={`text-center p-3 rounded-lg ${message.includes('✅') ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                  <p className="text-sm font-medium text-white">{message}</p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-800">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Secure 256-bit encrypted payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
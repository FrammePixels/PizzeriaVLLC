import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Trash2, ChevronRight, Zap, Lock, AlertCircle, CreditCard, MapPin, User, Mail, Phone, Package } from 'lucide-react';
import Confetti from 'react-confetti';
import Swal from 'sweetalert2';

export default function Cheackout() {
  const { cartShop, removeProduct, deleteCart, PriceFinal, priceAfterDiscount, applyDiscount } = useAuth();

  const [activeCode, setActiveCode] = useState(null);
  const [glowIndex, setGlowIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  const [customer, setCustomer] = useState({ name: '', email: '', address: '', phone: '' });
  const [paymentData, setPaymentData] = useState({ cardNumber: '', cardName: '', expiryDate: '', cvv: '', DireccionEntrega: '' });

  // Animación glow
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIndex(prev => (prev + 1) % (cartShop.length || 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [cartShop.length]);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChangeCustomer = (e) => setCustomer({ ...customer, [e.target.name]: e.target.value });

  const handleChangePayment = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const numbersOnly = value.replace(/\D/g, '');
      const formatted = numbersOnly.replace(/(\d{4})/g, '$1 ').trim();
      if (numbersOnly.length <= 16) setPaymentData({ ...paymentData, [name]: formatted });
    } else if (name === 'expiryDate') {
      const numbersOnly = value.replace(/\D/g, '');
      let formatted = numbersOnly.length > 2 ? numbersOnly.slice(0, 2) + '/' + numbersOnly.slice(2, 4) : numbersOnly;
      if (numbersOnly.length <= 4) setPaymentData({ ...paymentData, [name]: formatted });
    } else if (name === 'cvv') {
      const numbersOnly = value.replace(/\D/g, '');
      if (numbersOnly.length <= 4) setPaymentData({ ...paymentData, [name]: numbersOnly });
    } else if (name === 'cardName') {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
      setPaymentData({ ...paymentData, [name]: lettersOnly.toUpperCase() });
    } else {
      setPaymentData({ ...paymentData, [name]: value });
    }
  };

  const handleCheckout = async () => {
    if (!cartShop.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'Agrega productos al carrito antes de finalizar la compra',
        confirmButtonColor: '#06b6d4',
        background: '#1f2937',
        color: '#f9fafb'
      });
      return;
    }
    
    if (!customer.name || !customer.email || !customer.address || !customer.phone) {
      Swal.fire({
        icon: 'warning',
        title: 'Información incompleta',
        text: 'Por favor completa todos los datos del cliente',
        confirmButtonColor: '#06b6d4',
        background: '#1f2937',
        color: '#f9fafb'
      });
      return;
    }
    
    if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv || !paymentData.DireccionEntrega) {
      Swal.fire({
        icon: 'warning',
        title: 'Información de pago incompleta',
        text: 'Por favor completa todos los datos de pago y entrega',
        confirmButtonColor: '#06b6d4',
        background: '#1f2937',
        color: '#f9fafb'
      });
      return;
    }

    const cardNumberClean = paymentData.cardNumber.replace(/\s/g, '');
    if (cardNumberClean.length !== 16) {
      Swal.fire({
        icon: 'error',
        title: 'Número de tarjeta inválido',
        text: 'El número de tarjeta debe tener 16 dígitos',
        confirmButtonColor: '#ef4444',
        background: '#1f2937',
        color: '#f9fafb'
      });
      return;
    }

    const expiryClean = paymentData.expiryDate.replace(/\//g, '');
    if (expiryClean.length !== 4) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha de expiración inválida',
        text: 'La fecha de expiración debe tener el formato MM/YY',
        confirmButtonColor: '#ef4444',
        background: '#1f2937',
        color: '#f9fafb'
      });
      return;
    }

    if (paymentData.cvv.length < 3 || paymentData.cvv.length > 4) {
      Swal.fire({
        icon: 'error',
        title: 'CVV inválido',
        text: 'El CVV debe tener 3 o 4 dígitos',
        confirmButtonColor: '#ef4444',
        background: '#1f2937',
        color: '#f9fafb'
      });
      return;
    }

    // Confirmación final antes de procesar
    Swal.fire({
      title: '¿Confirmar compra?',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Total:</strong> $${currentTotal.toFixed(2)}</p>
          <p class="mb-2"><strong>Productos:</strong> ${cartShop.length} items</p>
          <p class="mb-2"><strong>Entrega:</strong> ${paymentData.DireccionEntrega}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: '¡Sí, confirmar compra!',
      cancelButtonText: 'Cancelar',
      background: '#1f2937',
      color: '#f9fafb',
      customClass: {
        popup: 'rounded-lg border border-gray-700'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await processOrder();
      }
    });
  };

  const processOrder = async () => {
    setLoading(true);
    setMessage('');

    try {
      const subtotal = PriceFinal();
      const total = priceAfterDiscount();
      const discountAmount = activeCode ? subtotal - total : 0;

      const orderData = {
        customer,
        products: cartShop.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
        subtotal,
        total,
        discount: discountAmount,
        discountCode: activeCode || null,
        date: new Date().toISOString(),
        CardNumber: paymentData.cardNumber.replace(/\s/g, ''),
        CardName: paymentData.cardName,
        ExpiryDate: paymentData.expiryDate,
        CVV: paymentData.cvv,
        DireccionEntrega: paymentData.DireccionEntrega
      };

      const response = await fetch('http://localhost:4019/api/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json().catch(() => { throw new Error(`Server response error: ${response.status}`); });

      if (!response.ok) throw new Error(data.message || data.error || `HTTP Error ${response.status}`);

      // Mostrar confetti y alerta de éxito
      setShowConfetti(true);
      
      Swal.fire({
        title: '¡Compra Exitosa! 🎉',
        html: `
          <div class="text-center">
            <p class="mb-3">Tu orden ha sido procesada correctamente</p>
            <div class="bg-gray-800 rounded-lg p-4 mt-3">
              <p><strong>Total:</strong> $${total.toFixed(2)}</p>
              <p><strong>Productos:</strong> ${cartShop.length} items</p>
              <p><strong>Orden ID:</strong> ${data.orderId || '#' + Date.now()}</p>
            </div>
            <p class="text-sm text-gray-400 mt-4">Recibirás un email de confirmación shortly</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#10b981',
        background: '#1f2937',
        color: '#f9fafb',
        customClass: {
          popup: 'rounded-lg border border-gray-700'
        },
        timer: 8000,
        timerProgressBar: true,
        willClose: () => {
          setShowConfetti(false);
        }
      });

      // Limpiar datos después de compra exitosa
      deleteCart();
      setCustomer({ name: '', email: '', address: '', phone: '' });
      setPaymentData({ cardNumber: '', cardName: '', expiryDate: '', cvv: '', DireccionEntrega: '' });
      setActiveCode(null);

      // Ocultar confetti después de 8 segundos
      setTimeout(() => {
        setShowConfetti(false);
      }, 8000);

    } catch (err) {
      console.error(err);
      
      Swal.fire({
        title: 'Error en la compra',
        text: `No se pudo procesar la orden: ${err.message}`,
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: '#1f2937',
        color: '#f9fafb',
        customClass: {
          popup: 'rounded-lg border border-gray-700'
        }
      });
      
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = (productId, productName) => {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: `¿Estás seguro de eliminar "${productName}" del carrito?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1f2937',
      color: '#f9fafb'
    }).then((result) => {
      if (result.isConfirmed) {
        removeProduct(productId);
        Swal.fire({
          title: '¡Eliminado!',
          text: 'Producto removido del carrito',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#f9fafb'
        });
      }
    });
  };

  const currentSubtotal = PriceFinal();
  const currentTotal = priceAfterDiscount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          numberOfPieces={200}
          recycle={false}
          gravity={0.3}
          colors={['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']}
        />
      )}

      {/* Fondo animado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-700" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
            <p className="text-gray-400 text-sm">{cartShop.length} items in your cart</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-12 grid lg:grid-cols-12 gap-6">
        {/* Productos */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-400" /> Your Items
            </h2>
            {cartShop.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartShop.map((item, index) => (
                  <div key={item.id} className={`p-4 rounded-lg bg-gray-800/50 border border-gray-700 flex justify-between items-center transition-all hover:border-cyan-500/50 ${glowIndex === index ? 'shadow-lg shadow-cyan-500/30 border-cyan-500/50' : ''}`}>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{item.name}</p>
                      <p className="text-gray-400 text-sm mt-1">${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveProduct(item.id, item.name)}
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

        {/* Checkout Form */}
        <div className="lg:col-span-5 space-y-4">
          {/* Customer Info */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" /> Customer Information
              </h3>
              <div className="space-y-3">
                {['name','email','address','phone'].map(field => (
                  <div className="relative" key={field}>
                    {field==='name' && <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />}
                    {field==='email' && <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />}
                    {field==='address' && <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-3" />}
                    {field==='phone' && <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3" />}
                    <input
                      type={field==='email'?'email':'text'}
                      name={field}
                      placeholder={field==='name'?'Full Name':field==='email'?'Email Address':field==='address'?'Billing Address':'Phone Number'}
                      value={customer[field]}
                      onChange={handleChangeCustomer}
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment & Delivery Form */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500" />
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-pink-400" /> Payment & Delivery
              </h3>
              {/* Card Inputs */}
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
                  <span className="absolute right-3 top-3 text-xs text-gray-500">{paymentData.cardNumber.replace(/\s/g,'').length}/16</span>
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
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={handleChangePayment}
                    maxLength="5"
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all font-mono text-center"
                  />
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

          {/* Order Summary */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500" />
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" /> Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold">${currentSubtotal.toFixed(2)}</span>
                </div>
                {activeCode && (
                  <div className="flex justify-between text-purple-400">
                    <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> Discount</span>
                    <span className="font-semibold">-${(currentSubtotal-currentTotal).toFixed(2)}</span>
                  </div>
                )}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold text-3xl">${currentTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || !cartShop.length}
                className={`w-full py-4 rounded-lg font-bold text-white transition-all relative overflow-hidden group mt-4
                  ${loading?'bg-gray-700 cursor-wait':'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02]'} flex items-center justify-center gap-2`}
              >
                <span className="relative z-10">{loading ? 'Processing Order...' : 'Complete Purchase'}</span>
                {!loading && <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />}
                {!loading && <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
              </button>

              {message && (
                <div className={`text-center p-3 rounded-lg ${message.includes('✅')?'bg-green-500/10 border border-green-500/30':'bg-red-500/10 border border-red-500/30'}`}>
                  <p className="text-sm font-medium text-white">{message}</p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-800">
                <Zap className="w-3 h-3 text-cyan-400" /> <span>Secure 256-bit encrypted payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
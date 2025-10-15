import React, { useState } from "react";
import { FaShoppingCart, FaCreditCard, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Checkout() {
  const { cartShop, PriceFinal, priceAfterDiscount, deleteItemCart, user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const orderData = {
        ...formData,
        items: cartShop,
        subtotal: PriceFinal(),
        total: priceAfterDiscount(),
        userId: user?.id,
      };

      const { data } = await axios.post("/orders/create", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (data.success) {
        alert("¡Orden procesada exitosamente!");
        deleteItemCart();
        window.location.href = "/order-confirmation";
      }
    } catch (err) {
      console.error("Error processing order:", err);
      setError(err.response?.data?.message || "Error al procesar la orden. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaShoppingCart /> Checkout
      </h2>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2">
            <FaUser />
            <input
              type="text"
              name="firstName"
              placeholder="Nombre"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className="flex items-center gap-2">
            <FaUser />
            <input
              type="text"
              name="lastName"
              placeholder="Apellido"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>

        <label className="flex items-center gap-2">
          <FaEnvelope />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>

        <label className="flex items-center gap-2">
          <FaPhone />
          <input
            type="text"
            name="phone"
            placeholder="Teléfono"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </label>

        <label className="flex items-center gap-2">
          <FaMapMarkerAlt />
          <input
            type="text"
            name="address"
            placeholder="Dirección"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </label>

        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            name="city"
            placeholder="Ciudad"
            className="p-2 rounded bg-gray-800 border border-gray-700"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="Provincia"
            className="p-2 rounded bg-gray-800 border border-gray-700"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="zipCode"
            placeholder="Código Postal"
            className="p-2 rounded bg-gray-800 border border-gray-700"
            value={formData.zipCode}
            onChange={handleInputChange}
            required
          />
        </div>

        <h3 className="text-lg font-semibold mt-6 flex items-center gap-2">
          <FaCreditCard /> Información de pago
        </h3>

        <input
          type="text"
          name="cardNumber"
          placeholder="Número de tarjeta"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          value={formData.cardNumber}
          onChange={handleInputChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="cardName"
            placeholder="Nombre en la tarjeta"
            className="p-2 rounded bg-gray-800 border border-gray-700"
            value={formData.cardName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="expiryDate"
            placeholder="MM/AA"
            className="p-2 rounded bg-gray-800 border border-gray-700"
            value={formData.expiryDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <label className="flex items-center gap-2">
          <FaLock />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            value={formData.cvv}
            onChange={handleInputChange}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition"
        >
          {loading ? "Procesando..." : "Finalizar Compra"}
        </button>
      </form>
    </div>
  );
}

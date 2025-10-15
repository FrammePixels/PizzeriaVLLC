// OffersContext.jsx - VERSIÓN CORREGIDA
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const OffersContext = createContext();

 export const OffersProvider = ({ children }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOffers();
    } else {
      setOffers([]);
    }
  }, [user]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/offers');
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOffer = async (newOffer) => {
    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        body: JSON.stringify(newOffer),
        headers: { 'Content-Type': 'application/json' }
      });
      const savedOffer = await response.json();
      setOffers(prev => [...prev, savedOffer]);
      return savedOffer;
    } catch (error) {
      console.error('Error adding offer:', error);
    }
  };

  const value = {
    offers,
    loading,
    addOffer,
    refetchOffers: fetchOffers,
    updateOffer: (updatedOffer) => {
      setOffers(prev => prev.map(offer => 
        offer.id === updatedOffer.id ? updatedOffer : offer
      ));
    }
  };

  return (
    <OffersContext.Provider value={value}>
      {children}
    </OffersContext.Provider>
  );
};

export const useOffers = () => {
  const context = useContext(OffersContext);
  if (!context) {
    throw new Error('useOffers must be used within an OffersProvider');
  }
  return context;
};
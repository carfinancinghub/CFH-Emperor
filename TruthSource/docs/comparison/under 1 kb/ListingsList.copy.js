// File: ListingsList.js
// Path: frontend/src/components/ListingsList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListingsList = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get('/api/listings');
        setListings(res.data);
      } catch (err) {
        setError('❌ Failed to load listings');
      }
    };
    fetchListings();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const handle

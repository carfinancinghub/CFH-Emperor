import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const EscrowOfficerDashboard = () => {
const [transactions, setTransactions] = useState([]);

useEffect(() => {
axios.get('/api/payments/escrow').then(res => setTransactions(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Escrow Officer Dashboard</h1> <div className="grid gap-4"> {transactions.map(tx => ( <div key={tx._id} className="border p-4 rounded"> <h2 className="text-lg">Transaction ID: {tx._id}</h2> <p>Amount: ${tx.amount}</p> <p>Status: {tx.status}</p> <button className="bg-blue-500 text-white px-4 py-2 rounded">Release Funds</button> </div> ))} </div> </div> </div> ); };
export default EscrowOfficerDashboard;
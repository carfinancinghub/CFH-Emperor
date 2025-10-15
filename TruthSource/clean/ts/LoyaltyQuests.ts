// Converted from LoyaltyQuests.js — 2025-08-22T11:57:30.301284+00:00
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const LoyaltyQuests = () => {
const [quests, setQuests] = useState([]);

useEffect(() => {
axios.get('/api/loyalty/quests').then(res => setQuests(res.data));
}, []);

return (

<div> <Navbar /> <div className="p-4"> <h1 className="text-2xl font-bold mb-4">Loyalty Quests</h1> <div className="grid gap-4"> {quests.map(quest => ( <div key={quest._id} className="border p-4 rounded"> <h2 className="text-lg">{quest.title}</h2> <p>Reward: {quest.reward} points</p> <p>Status: {quest.status}</p> <button className="bg-blue-500 text-white px-4 py-2 rounded">Complete Quest</button> </div> ))} </div> </div> </div> ); };
export default LoyaltyQuests;
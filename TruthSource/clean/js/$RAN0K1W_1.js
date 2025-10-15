// File: InspectionForm.js
// Path: frontend/src/components/mechanic/InspectionForm.js

import React, { useState } from 'react';
import axios from 'axios';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const InspectionForm = ({ jobId }) => {
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState(null);
  const [voiceNote, setVoiceNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const token = localStorage.getItem('token');

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('notes', notes);
    formData.append('voiceNote', voiceNote);
    if (photo) formData.append('photo', photo);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/mechanic/jobs/${jobId}/inspect`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('✅ Inspection submitted successfully');
      setNotes('');
      setVoiceNote('');
      setPhoto(null);
    } catch (err) {
      console.error('Error submitting inspection:', err);
      setMessage('❌ Failed to submit inspection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">🔍 Complete Inspection Report</h2>
      {loading && <LoadingSpinner />}
      {message && <p className={theme.errorText}>{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Inspection Notes</label>
          <textarea
            className="w-full p-2 border rounded"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Voice Note (optional)</label>
          <textarea
            className="w-full p-2 border rounded"
            value={voiceNote}
            onChange={(e) => setVoiceNote(e.target.value)}
            rows={2}
            placeholder="Paste transcription or notes here"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Photo (optional)</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="block" />
        </div>

        <Button type="submit" variant="primary">
          🚗 Submit Inspection
        </Button>
      </form>
    </Card>
  );
};

export default InspectionForm;

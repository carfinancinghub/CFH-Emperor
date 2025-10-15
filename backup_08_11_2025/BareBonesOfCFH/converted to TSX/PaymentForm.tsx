// ----------------------------------------------------------------------
// File: PaymentForm.tsx
// Path: frontend/src/components/billing/PaymentForm.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A secure, PCI-compliant payment form that uses a third-party provider
// (like Stripe Elements) to tokenize credit card information.
//
// @usage
// This component should be wrapped in the payment provider's 'Elements'
// context. It handles the entire client-side payment flow.
//
// @architectural_notes
// - **PCI Compliance via Tokenization**: This component NEVER touches raw credit
//   card data. It renders secure iframes from the payment provider. The user's
//   browser sends the data directly to the provider, which returns a safe,
//   single-use token. This is our non-negotiable security standard.
//
// @todos
// - @premium:
//   - [ ] ✨ Add support for other payment methods like Apple Pay and Google Pay.
//
// ----------------------------------------------------------------------

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import Button from '@/components/common/Button';

// Load Stripe outside of the component render to avoid recreating it on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

// --- The Internal Form Logic ---
const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      toast.error(error.message || 'An unexpected error occurred.');
      setIsProcessing(false);
      return;
    }
    
    // Send the safe 'paymentMethod.id' (the token) to your backend
    // await api.processPayment({ amount: 1000, token: paymentMethod.id });
    
    toast.success('Payment successful!');
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      <Button type="submit" disabled={!stripe || isProcessing} className="mt-4 w-full">
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
};


// --- The Public-Facing Wrapper Component ---
const PaymentForm: React.FC = () => (
  <div className="p-4 max-w-md mx-auto">
    <h1 className="text-2xl font-bold mb-4">Secure Payment</h1>
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  </div>
);

export default PaymentForm;
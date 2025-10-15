// File: transport.ts
// Path: backend/routes/transport.ts
// Description: API routes for managing vehicle transport logistics.

// TODO:
// @free:
//   - [ ] Implement request body validation using a library like 'zod' or 'express-validator' to ensure all required fields are present and correctly typed.
//   - [ ] Refactor the database logic into a separate 'service layer' to better separate concerns from the route handlers.
// @premium:
//   - [ ] ✨ Integrate WebSockets to broadcast real-time location updates from the hauler to the client-facing tracking page.
//   - [ ] ✨ Implement API rate limiting on these endpoints to prevent abuse and ensure service stability.
// @wow:
//   - [ ] 🚀 Integrate with a mapping service (e.g., Google Maps API) to calculate real-time ETAs based on traffic and provide route optimization.
//   - [ ] 🚀 Create a new endpoint that allows a hauler to accept/reject a pending transport job offer.

import { Router, Request, Response } from 'express';
import { Document, model, Model, Schema } from 'mongoose';
import auth, { AuthenticatedRequest } from '../middleware/auth'; // Assuming auth middleware provides typed request

const router = Router();

// --- Mongoose Schema and Model ---
interface ITransport extends Document {
  carId: Schema.Types.ObjectId;
  haulerId: Schema.Types.ObjectId;
  pickupLocation: string;
  deliveryLocation: string;
  currentLocation?: string;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Delayed';
  createdAt: Date;
  updatedAt: Date;
}

const TransportSchema: Schema = new Schema({
  carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  haulerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  pickupLocation: { type: String, required: true },
  deliveryLocation: { type: String, required: true },
  currentLocation: { type: String },
  status: { type: String, enum: ['Pending', 'In Transit', 'Delivered', 'Delayed'], default: 'Pending' },
}, { timestamps: true });

const Transport: Model<ITransport> = model<ITransport>('Transport', TransportSchema);

// --- Route Handlers ---

// GET all transport jobs assigned to the logged-in hauler
router.get('/', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const transports = await Transport.find({ haulerId: req.user.id });
    res.json(transports);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// POST assign a hauler to a transport job
interface AssignBody {
  carId: string;
  pickupLocation: string;
  deliveryLocation: string;
}
router.post('/assign', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { carId, pickupLocation, deliveryLocation } = req.body as AssignBody;
    const newTransport = new Transport({
      carId,
      haulerId: req.user.id,
      pickupLocation,
      deliveryLocation,
      currentLocation: pickupLocation, // Default current location to pickup
    });
    await newTransport.save();
    res.status(201).json({ msg: 'Transport job assigned', transport: newTransport });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ msg: 'Assignment failed', error: error.message });
  }
});

// PATCH update delivery status or current location
// Note: Using PATCH is more semantically correct for partial updates.
interface UpdateBody {
  currentLocation?: string;
  status?: ITransport['status'];
}
router.patch('/:id/update', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentLocation, status } = req.body as UpdateBody;
    const updateData: Partial<ITransport> = {};

    if (status) updateData.status = status;
    if (currentLocation) updateData.currentLocation = currentLocation;

    const transport = await Transport.findOneAndUpdate(
      { _id: req.params.id, haulerId: req.user.id }, // Ensure hauler can only update their own jobs
      { $set: updateData },
      { new: true } // Return the updated document
    );

    if (!transport) {
      return res.status(404).json({ msg: 'Transport job not found or not authorized' });
    }

    res.json({ msg: 'Transport updated', transport });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ msg: 'Update failed', error: error.message });
  }
});

export default router;
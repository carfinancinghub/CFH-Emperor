To convert the given JavaScript file to TypeScript, we will define types for the schema fields and ensure that the code adheres to CFH code standards. Here's the refactored TypeScript code:

```typescript
// File: EscrowTransaction.ts
// Path: server/models/EscrowTransaction.ts

import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the possible steps as a TypeScript enum for better type safety
enum EscrowStep {
  DepositReceived = 'Deposit Received',
  BuyerInspectionScheduled = 'Buyer Inspection Scheduled',
  BuyerInspectionApproved = 'Buyer Inspection Approved',
  FundsReleasedToSeller = 'Funds Released to Seller',
  FundsReleasedToMechanic = 'Funds Released to Mechanic',
  FundsReleasedToHauler = 'Funds Released to Hauler',
  RefundedToBuyer = 'Refunded to Buyer',
  PlatformFeeProcessed = 'Platform Fee Processed'
}

// Define the interface for the EscrowTransaction document
interface IEscrowTransaction extends Document {
  contractId: mongoose.Types.ObjectId;
  step: EscrowStep;
  amount: number;
  currency: string;
  triggeredBy?: mongoose.Types.ObjectId;
  notes?: string;
  timestamp: Date;
}

// Define the schema for the EscrowTransaction model
const escrowTransactionSchema: Schema<IEscrowTransaction> = new Schema({
  contractId: {
    type: Schema.Types.ObjectId,
    ref: 'EscrowContract',
    required: true,
  },
  step: {
    type: String,
    enum: Object.values(EscrowStep),
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  triggeredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  notes: {
    type: String,
    maxlength: 2000,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Export the EscrowTransaction model
const EscrowTransaction: Model<IEscrowTransaction> = mongoose.model<IEscrowTransaction>('EscrowTransaction', escrowTransactionSchema);
export default EscrowTransaction;
```

### Key Changes and Additions:
1. **TypeScript Imports**: We import `Document`, `Schema`, and `Model` from `mongoose` to define types.
2. **Enum for Steps**: We use a TypeScript `enum` to define the possible values for `step`, ensuring type safety.
3. **Interface Definition**: We define an `IEscrowTransaction` interface that extends `Document` to represent the structure of the document.
4. **Schema Typing**: The schema is typed with `Schema<IEscrowTransaction>` to ensure type safety.
5. **Optional Fields**: Fields like `triggeredBy` and `notes` are marked as optional in the interface.
6. **Export**: The model is exported using `export default` for consistency with ES module standards.

This refactored code adheres to CFH code standards and ensures type safety across the model definition.

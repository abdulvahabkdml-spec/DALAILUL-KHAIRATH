import mongoose, { Schema, Document, model } from 'mongoose';

/**
 * Donation Settings Model
 * Stores global configuration for Bank Details and Donorbox integration.
 * Designed to act as a Singleton (only one document should ever exist).
 */

export interface IDonationSettings extends Document {
  isSingleton: boolean; // Used to enforce single document limit
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  ifscCode: string;
  whyDonateText: string;
  makeDifferenceHeading: string;
  makeDifferenceBody1: string;
  makeDifferenceBody2: string;
  qrCodeUrl: string;
  heroImageUrl: string;
  upiId: string;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSettingsSchema = new Schema<IDonationSettings>(
  {
    isSingleton: {
      type: Boolean,
      default: true,
      unique: true, // Guarantees this model can only ever have 1 row in the collection
    },
    bankName: {
      type: String,
      required: true,
      default: 'Islamic Bank Example',
    },
    accountTitle: {
      type: String,
      required: true,
      default: 'Dalailul Khairath Trust',
    },
    accountNumber: {
      type: String,
      required: true,
      default: '0000 0000 0000 0000',
    },
    iban: {
      type: String,
      required: true,
      default: 'PK00 ISBK 0000 0000 0000 00',
    },
    swiftCode: {
      type: String,
      required: true,
      default: 'ISBKPKKA',
    },
    ifscCode: {
      type: String,
      required: true,
      default: 'ISBK0001234',
    },
    whyDonateText: {
      type: String,
      default: 'Support the Dalailul Khairath project and help us sustain our heritage.',
    },
    makeDifferenceHeading: {
      type: String,
      default: 'Better lives through better giving.',
    },
    makeDifferenceBody1: {
      type: String,
      default: 'Charity and relief activities are among the most significant aspects of Dalailul Khairath\'s mission. Across under-privileged communities in Kerala and beyond, we have organised food distribution, medical camps, madrasa infrastructure, bore-well construction, and family welfare support.',
    },
    makeDifferenceBody2: {
      type: String,
      default: 'You can transfer directly to our bank account via internet banking, mobile banking, or any UPI-enabled app — 100% of your donation reaches the cause.',
    },
    qrCodeUrl: {
      type: String,
      default: '',
    },
    heroImageUrl: {
      type: String,
      default: '',
    },
    upiId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// In Next.js dev mode, hot reloads can cache the old schema without new fields.
// Deleting the cached model ensures the updated schema (with ifscCode) is always used.
delete mongoose.models['DonationSettings'];
export const DonationSettings = model<IDonationSettings>('DonationSettings', DonationSettingsSchema);

import { Schema, Document, models, model } from 'mongoose';

export interface IEvent extends Document {
  d: string;        // Day e.g., "12"
  m: string;        // Month e.g., "Dec"
  t: string;        // Title
  l: string;        // Location
  time: string;     // Time range
  active: boolean;  // Live status
  date: Date;       // Full date for sorting
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    d: { type: String, required: true },
    m: { type: String, required: true },
    t: { type: String, required: true },
    l: { type: String, required: true },
    time: { type: String, required: true },
    active: { type: Boolean, default: false },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export const Event = models.Event || model<IEvent>('Event', EventSchema);

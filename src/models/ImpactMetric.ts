/**
 * Impact Metric Model
 * Stores the 15+ institutional metrics displayed on the homepage.
 * Examples: # of PhDs, Doctors, Huffaz, Alumni, Ongoing Projects, etc.
 */
import { Schema, Document, models, model } from 'mongoose';

export interface IImpactMetric extends Document {
  key: string;       // Unique machine-readable key, e.g. "phd_count"
  label: string;     // Display label, e.g. "PhD Graduates"
  value: number;
  unit?: string;     // e.g. "+", "%", "K"
  icon?: string;     // Icon class or SVG identifier
  category: 'academic' | 'community' | 'spiritual' | 'global' | 'financial' | 'operational';
  isPublished: boolean;
  displayOrder: number;
  updatedAt: Date;
  createdAt: Date;
}

const ImpactMetricSchema = new Schema<IImpactMetric>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      maxlength: 10,
    },
    icon: {
      type: String,
      maxlength: 100,
    },
    category: {
      type: String,
      enum: ['academic', 'community', 'spiritual', 'global', 'financial', 'operational'],
      required: true,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true, strict: true }
);

// Optimized index for the public endpoint (published metrics in order)
ImpactMetricSchema.index({ isPublished: 1, displayOrder: 1 });

export const ImpactMetric =
  models.ImpactMetric || model<IImpactMetric>('ImpactMetric', ImpactMetricSchema);

import { Schema, Document, models, model } from 'mongoose';

/**
 * Media Model
 * Tracks assets uploaded to Cloudinary for internal library management.
 */
export interface IMedia extends Document {
  name: string;           // Original filename or title
  url: string;            // Cloudinary secure_url
  publicId: string;       // Cloudinary public_id (needed for deletion)
  type: string;           // 'image', 'video', 'document'
  format: string;         // 'jpg', 'png', 'pdf', etc.
  size: number;           // Size in bytes
  category: string;       // 'gallery', 'hall-of-fame', 'campus', 'academic'
  uploadedBy: string;     // User ID or username
  width?: number;         // For images
  height?: number;        // For images
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['image', 'video', 'document', 'other'],
      default: 'image',
    },
    format: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['gallery', 'hall-of-fame', 'campus', 'academic', 'general', 'media'],
      default: 'general',
      index: true,
    },
    uploadedBy: {
      type: String,
      required: true,
    },
    width: { type: Number },
    height: { type: Number },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Index for reverse chronological search
MediaSchema.index({ createdAt: -1 });
// Index for category-based filtering
MediaSchema.index({ category: 1, createdAt: -1 });

export const Media = models.Media || model<IMedia>('Media', MediaSchema);

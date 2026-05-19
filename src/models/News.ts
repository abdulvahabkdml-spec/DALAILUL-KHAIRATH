import { Schema, Document, models, model } from 'mongoose';

export interface INews extends Document {
  type: string;
  title: string;
  desc: string;
  img: string;
  slug: string;
  date?: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    type: {
      type: String,
      required: true,
      default: 'Campus News',
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const News = models.News || model<INews>('News', NewsSchema);

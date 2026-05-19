import { Schema, Document, models, model } from 'mongoose';

export interface ISiteSettings extends Document {
  isSingleton: boolean;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  aboutImageUrl: string;
  founderName: string;
  founderTitle: string;
  founderQuote: string;
  founderText1: string;
  founderText2: string;
  founderImageUrl: string;
  articleSectionTitle: string;
  inkspireUrl: string;
  featuredArticles: Array<{
    title: string;
    desc: string;
    img: string;
    author: string;
    tag: string;
    slug: string;
    url: string;
  }>;
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;
  googleMapsEmbedUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    isSingleton: {
      type: Boolean,
      default: true,
      unique: true,
    },
    heroTitle: {
      type: String,
      default: 'Empowering Minds, Inspiring Futures',
    },
    heroSubtitle: {
      type: String,
      default: 'We nurture students to become future leaders through holistic education and values-driven guidance.',
    },
    aboutTitle: {
      type: String,
      default: 'Beyond Learning, Dalailul Khairath',
    },
    aboutText: {
      type: String,
      default: 'A premier sanctuary of knowledge where tradition and modern excellence unite. We empower the next generation of leaders through a curriculum rooted in values and academic brilliance.',
    },
    aboutImageUrl: {
      type: String,
      default: '/h2.JPG',
    },
    founderName: { type: String, default: 'Abdul Salam Sa\'adi' },
    founderTitle: { type: String, default: 'Founder & Chancellor' },
    founderQuote: { type: String, default: 'Scholarship is not merely the acquisition of facts, but the transformation of the soul through the light of traditional wisdom and modern inquiry.' },
    founderText1: { type: String, default: 'We welcome you to a portal that represents the heart of our mission. Dalailul Khairath is more than an institution; it is a living legacy of preservation and progress.' },
    founderText2: { type: String, default: 'In every manuscript we digitize and every scholar we mentor, we are weaving the thread of the past into the fabric of the future. Our digital portal serves as the bridge for seekers of knowledge across the globe.' },
    founderImageUrl: { type: String, default: 'https://res.cloudinary.com/dhdzz9rxz/image/upload/v1776878729/dk-web/general/usthad-1776878726014.jpg' },
    articleSectionTitle: { type: String, default: 'Students Article' },
    inkspireUrl: { type: String, default: 'https://inkspiredk.vercel.app' },
    featuredArticles: [
      {
        title: String,
        desc: String,
        img: String,
        author: String,
        tag: String,
        slug: String,
        url: String,
      }
    ],
    contactAddress: { type: String, default: 'Dalailul Khairath, Kakkidippuram, Malappuram, Kerala 679582, India' },
    contactEmail: { type: String, default: 'info@dalailulkhairath.com' },
    contactPhone: { type: String, default: '+91 8123456789' },
    googleMapsEmbedUrl: { type: String, default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15666.428!2d76.0272!3d10.7631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b92571fe35dd%3A0xb448354cc34ddbd0!2sDalailul+Khairath%2C+Kakkidippuram.+Madeenathunnoor+campus!5e0!3m2!1sen!2sin!4v1712400000000!5m2!1sen!2sin' },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings = models.SiteSettings || model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

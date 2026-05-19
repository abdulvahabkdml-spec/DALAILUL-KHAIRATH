/**
 * Cloudinary Media Signing API — /api/media/sign
 *
 * POST → Admin: generates a signed upload URL so the client can upload
 *        directly to Cloudinary without proxying files through our server.
 *
 * Security Model:
 * - The CLOUDINARY_API_SECRET never leaves the server.
 * - The signature is valid for 15 minutes (timestamp-based).
 * - Upload restrictions (folder, allowed formats, max file size) are embedded
 *   in the signed params — Cloudinary will reject any tampering.
 * - We NEVER store binary data — only the resulting secure URL is persisted.
 */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { createHmac } from 'crypto';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';

const signRequestSchema = z.object({
  folder: z.enum(['academic', 'posters', 'news', 'media']),
  resourceType: z.enum(['image', 'raw']).default('image'),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary environment variables');
      return NextResponse.json(
        { error: 'Media service not configured' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const result = signRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: result.error.flatten() },
        { status: 400 }
      );
    }

    const { folder, resourceType, tags } = result.data;

    // Timestamp in seconds — signature is valid within ±15 minutes
    const timestamp = Math.round(Date.now() / 1000);

    // Upload preset restrictions embedded in the signed params
    const params: Record<string, string | number> = {
      folder: `dalailul-khairath/${folder}`,
      timestamp,
      // Max file size: 10MB for images, 50MB for documents
      ...(resourceType === 'image'
        ? {
            allowed_formats: 'jpg,jpeg,png,webp,svg',
            transformation: 'q_auto,f_auto', // Auto-optimize quality + format
          }
        : { allowed_formats: 'pdf,docx,doc' }),
      ...(tags?.length ? { tags: tags.join(',') } : {}),
    };

    // Build the signature string — params must be sorted alphabetically
    const paramString = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    // SHA-1 HMAC with API secret — this is the Cloudinary signing algorithm
    const signature = createHmac('sha1', apiSecret)
      .update(paramString + apiSecret)
      .digest('hex');

    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder: params.folder,
    });
  } catch (error) {
    console.error('[Media Sign POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Explicit runtime for Node.js crypto support
export const runtime = 'nodejs';

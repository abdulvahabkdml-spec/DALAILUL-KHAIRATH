import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDB } from '@/lib/db';
import cloudinary from '@/lib/cloudinary';
import { Media } from '@/models/Media';
import { AuditLog } from '@/models/AuditLog';

/**
 * Media Library GET API
 * Returns all media assets stored in MongoDB.
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    await connectToDB();

    const query = category ? { category } : {};
    const media = await Media.find(query).sort({ createdAt: -1 });

    return NextResponse.json(media);
  } catch (error) {
    console.error('[Media GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Media Library DELETE API
 * Removes asset from Cloudinary and record from MongoDB.
 */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await connectToDB();

    // 1. Find the media item
    const mediaItem = await Media.findById(id);
    if (!mediaItem) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // 2. Delete from Cloudinary
    await cloudinary.uploader.destroy(mediaItem.publicId);

    // 3. Delete from MongoDB
    await Media.findByIdAndDelete(id);

    // 4. Audit Log
    await AuditLog.create({
      actorId: (session.user as any)?.id || 'unknown',
      actorName: session.user?.name || 'Anonymous',
      actorRole: (session.user as any).role || 'Editor',
      action: 'DELETE_MEDIA',
      resource: 'media',
      resourceId: id,
      details: `Deleted ${mediaItem.name} (${mediaItem.publicId})`,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent'),
      statusCode: 200,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Media DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDB } from '@/lib/db';
import cloudinary from '@/lib/cloudinary';
import { Media } from '@/models/Media';
import { AuditLog } from '@/models/AuditLog';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;
    const category = (data.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 1. Connect to Database
    await connectToDB();

    // 2. Prepare File for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Upload to Cloudinary via promise
    const cloudinaryResponse = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `dk-web/${category}`,
          resource_type: 'auto',
          public_id: file.name.split('.')[0] + '-' + Date.now(),
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // 4. Create Media Record in MongoDB
    const mediaItem = await Media.create({
      name: file.name,
      url: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,
      type: cloudinaryResponse.resource_type,
      format: cloudinaryResponse.format || file.name.split('.').pop(),
      size: cloudinaryResponse.bytes,
      category: category,
      uploadedBy: session.user?.name || session.user?.email || 'unknown',
      width: cloudinaryResponse.width,
      height: cloudinaryResponse.height,
    });

    // 5. Log Action (PRD Req 12)
    await AuditLog.create({
      actorId: (session.user as any)?.id || 'unknown',
      actorName: session.user?.name || 'Anonymous',
      actorRole: (session.user as any).role || 'Editor',
      action: 'UPLOAD_MEDIA',
      resource: 'media',
      resourceId: mediaItem._id,
      details: `Uploaded ${file.name} to ${category} folder.`,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent'),
      statusCode: 200,
    });

    return NextResponse.json({
      success: true,
      data: mediaItem,
    });

  } catch (error: any) {
    console.error('[Media Upload POST]', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';

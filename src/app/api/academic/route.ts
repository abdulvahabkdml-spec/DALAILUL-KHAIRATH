import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import mongoose, { Types } from 'mongoose';
import { connectToDB } from '@/lib/db';
import { AcademicRecord } from '@/models/AcademicRecord';
import { AuditLog } from '@/models/AuditLog';
import { authOptions } from '@/lib/auth';


// ─── Validation ──────────────────────────────────────────────────────────────

const createRecordSchema = z.object({
  title: z.string().min(3).max(300),
  type: z.enum(['article', 'poster', 'thesis', 'research_paper']),
  authorName: z.string().min(2).max(200),
  authorBatch: z.string().max(50).optional(),
  abstract: z.string().max(2000).optional(),
  cloudinaryPublicId: z.string().max(255).optional(),
  imageUrl: z.string().url().optional(),
  documentUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),

  tags: z.array(z.string().max(50)).max(20).optional().default([]),
  status: z.enum(['draft', 'review', 'published', 'archived']).optional().default('draft'),
  isPublished: z.boolean().optional().default(false),
});

const updateRecordSchema = createRecordSchema.partial();

function getClientIP(req: Request): string {
  return (
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

async function logAction(
  session: any,
  action: string,
  details: string,
  ip: string,
  statusCode: number,
  resourceId?: string
) {
  try {
    const actorId = session?.user?.id || session?.user?.name || 'unknown';
    const actorName = session?.user?.name || 'Anonymous';
    const actorRole = session?.user?.role || 'User';

    await AuditLog.create({
      actorId,
      actorName,
      actorRole,
      action,
      resource: 'academic_records',
      resourceId,
      details,
      ipAddress: ip,
      statusCode,
      timestamp: new Date(),
    });
  } catch (e) {
    console.warn('Audit log failed:', e);
  }
}

// ─── GET /api/academic ───────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '12', 10), 50);
    const skip = (page - 1) * limit;
    const isAdmin = searchParams.get('admin') === 'true';

    const query: Record<string, any> = {};

    if (!isAdmin) {
      query.isPublished = true;
      query.status = 'published';
    } else {
      const session = await getServerSession(authOptions);
      if (!session || session.user.role !== 'Admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    if (type) query.type = type;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$text = { $search: search };
    }

    const [records, total] = await Promise.all([
      AcademicRecord.find(query)
        .sort(search ? { score: { $meta: 'textScore' } } : { publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AcademicRecord.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: records,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[Academic GET]', error);
    return NextResponse.json({ error: 'Failed to fetch academic records' }, { status: 500 });
  }
}

// ─── POST /api/academic ──────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = createRecordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: result.error.flatten() },
        { status: 400 }
      );
    }

    await connectToDB();

    const recordData = {
      ...result.data,
      ...(session.user.id ? { createdBy: new Types.ObjectId(session.user.id as string) } : {}),
      ...(result.data.isPublished && !result.data.status?.includes('publish')
        ? { publishedAt: new Date(), status: 'published' }
        : {}),
    };

    const record = await AcademicRecord.create(recordData);
    const ip = getClientIP(req);

    await logAction(
      session,
      'CREATE_ACADEMIC_RECORD',
      `Created "${record.title}"`,
      ip,
      201,
      String(record._id)
    );

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    console.error('[Academic POST]', error);
    return NextResponse.json({ error: 'Failed to create academic record' }, { status: 500 });
  }
}

// ─── PUT /api/academic?id= ───────────────────────────────────────────────────
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing academic record ID' }, { status: 400 });
    }

    const body = await req.json();
    const result = updateRecordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: result.error.flatten() },
        { status: 400 }
      );
    }

    await connectToDB();

    const updateData: Record<string, any> = { ...result.data };
    if (updateData.isPublished && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
      updateData.status = 'published';
    }

    const updated = await AcademicRecord.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    const ip = getClientIP(req);
    await logAction(
      session,
      'UPDATE_ACADEMIC_RECORD',
      `Updated record "${updated.title}"`,
      ip,
      200,
      id
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Academic PUT]', error);
    return NextResponse.json({ error: 'Failed to update academic record' }, { status: 500 });
  }
}

// ─── DELETE /api/academic?id= ────────────────────────────────────────────────
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden: Admin role required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing academic record ID' }, { status: 400 });
    }

    await connectToDB();
    const deleted = await AcademicRecord.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    const ip = getClientIP(req);
    await logAction(
      session,
      'DELETE_ACADEMIC_RECORD',
      `Permanently deleted record "${deleted.title}"`,
      ip,
      200,
      id
    );

    return NextResponse.json({ success: true, message: 'Record deleted' });
  } catch (error) {
    console.error('[Academic DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete academic record' }, { status: 500 });
  }
}

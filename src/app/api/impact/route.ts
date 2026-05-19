/**
 * Impact Metrics API — /api/impact
 *
 * GET  /api/impact          → Public: fetch all published metrics (cached)
 * POST /api/impact          → Admin: create a new metric
 * PUT  /api/impact/[id]     → Admin: update a metric value
 * DELETE /api/impact/[id]   → Admin: soft-delete (unpublish) a metric
 */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { connectToDB } from '@/lib/db';
import { ImpactMetric } from '@/models/ImpactMetric';
import { AuditLog } from '@/models/AuditLog';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// ─── Validation Schemas ──────────────────────────────────────────────────────
const createMetricSchema = z.object({
  key: z.string().min(2).max(50).regex(/^[a-z0-9_]+$/, 'Key must be lowercase snake_case').optional(),
  label: z.string().min(2).max(100),
  value: z.number().min(0),
  unit: z.string().max(10).optional(),
  icon: z.string().max(100).optional(),
  category: z.enum(['academic', 'community', 'spiritual', 'global', 'financial', 'operational']),
  isPublished: z.boolean().optional().default(true),
  displayOrder: z.number().int().optional().default(0),
});

const updateMetricSchema = createMetricSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getClientIP(req: Request): string {
  return (
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

async function logAction(
  session: any, // session type is complex, keeping any for now but could use Session from next-auth
  action: string,
  resource: string,
  details: string,
  ip: string,
  statusCode: number
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
      resource,
      details,
      ipAddress: ip,
      statusCode,
      timestamp: new Date(),
    });
  } catch (e) {
    console.warn('Audit log failed:', e);
  }
}

// ─── GET /api/impact ─────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const isAdmin = searchParams.get('admin') === 'true';

    const query: Record<string, any> = {};
    if (!isAdmin) {
      query.isPublished = true;
    } else {
      const session = await getServerSession(authOptions);
      if (!session || session.user.role !== 'Admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    if (category) query.category = category;

    const metrics = await ImpactMetric.find(query)
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({ success: true, data: metrics, total: metrics.length });
  } catch (error) {
    console.error('[Impact GET]', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}

// ─── POST /api/impact ────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only Admins can create metrics
    if (session.user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden: Requires Admin role' }, { status: 403 });
    }

    const body = await req.json();
    const result = createMetricSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = { ...result.data };

    await connectToDB();

    // Auto-generate key from label if missing
    if (!data.key && data.label) {
      data.key = data.label.toLowerCase().trim().replace(/ /g, '_').replace(/[^\w-]+/g, '');
      // Ensure key doesn't clash with existing ones
      const clash = await ImpactMetric.findOne({ key: data.key });
      if (clash) {
        data.key += '_' + Math.floor(Math.random() * 1000);
      }
    }

    // Check for duplicate key (if user provided one or generated one)
    const existing = await ImpactMetric.findOne({ key: data.key });
    if (existing) {
      return NextResponse.json(
        { error: `A metric with key '${data.key}' already exists` },
        { status: 409 }
      );
    }

    const metric = await ImpactMetric.create(data);
    const ip = getClientIP(req);

    await logAction(
      session,
      'CREATE_IMPACT_METRIC',
      'stats',
      `Created metric '${metric.label}' (key: ${metric.key}) with value ${metric.value}`,
      ip,
      201
    );

    return NextResponse.json({ success: true, data: metric }, { status: 201 });
  } catch (error) {
    console.error('[Impact POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ─── PUT /api/impact ─────────────────────────────────────────────────────────
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await connectToDB();
    const mongoose = (await import('mongoose')).default;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing metric ID' }, { status: 400 });
    }

    const body = await req.json();
    const result = updateMetricSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: result.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await ImpactMetric.findByIdAndUpdate(
      id,
      { $set: result.data },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
    }

    const ip = getClientIP(req);
    await logAction(
      session,
      'UPDATE_IMPACT_METRIC',
      'stats',
      `Updated metric '${updated.label}'`,
      ip,
      200
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Impact PUT]', error);
    return NextResponse.json({ error: 'Failed to update metric' }, { status: 500 });
  }
}

// ─── DELETE /api/impact (soft delete — sets isPublished: false) ──────────────
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing metric id' }, { status: 400 });
    }

    await connectToDB();
    const mongoose = (await import('mongoose')).default;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing metric ID' }, { status: 400 });
    }

    const metric = await ImpactMetric.findByIdAndUpdate(
      id,
      { isPublished: false },
      { new: true }
    );

    if (!metric) {
      return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
    }

    const ip = getClientIP(req);
    await logAction(
      session,
      'UNPUBLISH_IMPACT_METRIC',
      'stats',
      `Unpublished metric '${metric.label}' (id: ${id})`,
      ip,
      200
    );

    return NextResponse.json({ success: true, message: 'Metric unpublished' });
  } catch (error) {
    console.error('[Impact DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

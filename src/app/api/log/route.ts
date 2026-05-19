/**
 * Audit Log API — /api/log  (upgraded to MongoDB)
 *
 * POST /api/log  → Auth required: write an audit entry (for client-side admin actions)
 * GET  /api/log  → Admin only: paginated retrieval with filtering
 */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { connectToDB } from '@/lib/db';
import { AuditLog, type AuditResource } from '@/models/AuditLog';
import { authOptions } from '@/lib/auth';

const auditLogSchema = z.object({
  action: z.string().min(1).max(100).toUpperCase(),
  resource: z.enum([
    'stats',
    'news',
    'academic_records',
    'donation_links',
    'media',
    'users',
    'system',
  ] as [AuditResource, ...AuditResource[]]),
  resourceId: z.string().max(100).optional(),
  details: z.string().max(1000).optional(),
  statusCode: z.number().int().default(200),
});

// ─── POST /api/log ────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. MFA Login Required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = auditLogSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid log input', issues: result.error.flatten() },
        { status: 400 }
      );
    }

    const { action, resource, resourceId, details, statusCode } = result.data;
    const ip =
      req.headers.get('x-real-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';
    const userAgent = req.headers.get('user-agent') || undefined;

    await connectToDB();

    const auditEntry = await AuditLog.create({
      actorId: (session.user as any).id || session.user.name,
      actorName: session.user.name,
      actorRole: (session.user as any).role || 'Editor',
      action,
      resource,
      resourceId,
      details,
      ipAddress: ip,
      userAgent,
      statusCode,
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Audit log recorded',
      id: auditEntry._id,
    });
  } catch (error) {
    console.error('Audit Log Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ─── GET /api/log ─────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Only Admins can view audit logs
    if (!session || !session.user || (session.user as any).role !== 'Admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin role required to view audit logs' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);
    const skip = (page - 1) * limit;
    const resource = searchParams.get('resource');
    const actorId = searchParams.get('actorId');
    const action = searchParams.get('action');
    const from = searchParams.get('from'); // ISO date string
    const to = searchParams.get('to');

    await connectToDB();

    const query: any = {};
    if (resource) query.resource = resource;
    if (actorId) query.actorId = actorId;
    if (action) query.action = { $regex: action, $options: 'i' };
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Audit Log GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

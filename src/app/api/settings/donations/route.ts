import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDB } from '@/lib/db';
import { DonationSettings } from '@/models/DonationSettings';
import { AuditLog } from '@/models/AuditLog';

/**
 * GET /api/settings/donations
 * Public API to fetch current bank details / settings for the Donate page.
 */
export async function GET() {
  try {
    await connectToDB();
    
    // Find the singleton document, or create it with defaults if it doesn't exist
    let settings = await DonationSettings.findOne({ isSingleton: true });
    
    if (!settings) {
      settings = await DonationSettings.create({ isSingleton: true });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('[DonationSettings GET]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings/donations
 * Admin-only API to update the bank details / settings.
 */
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();

    // Prevent overriding the singleton tag
    delete updates.isSingleton;
    delete updates._id;

    await connectToDB();

    const settings = await DonationSettings.findOneAndUpdate(
      { isSingleton: true },
      { $set: updates },
      { new: true, upsert: true }
    );

    // Audit Log (PRD Req 12)
    await AuditLog.create({
      actorId: session.user.id || 'unknown',
      actorName: session.user?.name || 'Anonymous',
      actorRole: session.user.role || 'Editor',
      action: 'UPDATE_DONATION_SETTINGS',
      resource: 'donation_links',
      resourceId: settings._id,
      details: 'Updated bank routing or Donorbox details.',
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent'),
      statusCode: 200,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('[DonationSettings PUT]', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

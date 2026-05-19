import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDB } from '@/lib/db';
import { SiteSettings } from '@/models/SiteSettings';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDB();
    let settings = await SiteSettings.findOne({ isSingleton: true });
    
    if (!settings) {
      settings = await SiteSettings.create({ isSingleton: true });
    }
    
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectToDB();
    
    const settings = await SiteSettings.findOneAndUpdate(
      { isSingleton: true },
      { $set: body },
      { new: true, upsert: true }
    );
    
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

import { connectToDB } from '@/lib/db';
import { SiteSettings } from '@/models/SiteSettings';
import { News } from '@/models/News';
import { Event } from '@/models/Event';
import { ImpactMetric } from '@/models/ImpactMetric';
import HomePageClient from './HomePageClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
    await connectToDB();
    const settings = await SiteSettings.findOne({ isSingleton: true }).lean();
    const news = await News.find({}).sort({ date: -1 }).lean();
    const events = await Event.find({}).sort({ date: 1 }).lean();
    const metrics = await ImpactMetric.find({ isPublished: true }).sort({ displayOrder: 1, createdAt: 1 }).lean();

    return (
        <HomePageClient 
            initialSettings={JSON.parse(JSON.stringify(settings || null))} 
            initialNews={JSON.parse(JSON.stringify(news || []))} 
            initialEvents={JSON.parse(JSON.stringify(events || []))} 
            initialMetrics={JSON.parse(JSON.stringify(metrics || []))} 
        />
    );
}

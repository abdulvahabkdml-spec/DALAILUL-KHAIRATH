import { connectToDB } from '@/lib/db';
import { SiteSettings } from '@/models/SiteSettings';
import { News } from '@/models/News';
import { Event } from '@/models/Event';
import { ImpactMetric } from '@/models/ImpactMetric';
import HomePageClient from './HomePageClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
    try {
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
    } catch (error: any) {
        return (
            <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#1e293b', color: '#f8fafc', minHeight: '100vh' }}>
                <h1 style={{ color: '#f43f5e' }}>Debug Error: Homepage failed to load</h1>
                <p><strong>Message:</strong> {error.message}</p>
                <pre style={{ background: '#0f172a', padding: '1rem', borderRadius: '0.375rem', overflowX: 'auto' }}>{error.stack}</pre>
            </div>
        );
    }
}

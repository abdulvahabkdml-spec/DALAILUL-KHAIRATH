import { connectToDB } from '@/lib/db';
import { News } from '@/models/News';
import UpdatesClient from './UpdatesClient';

export const dynamic = 'force-dynamic';

export default async function UpdatesPage() {
    await connectToDB();
    const articles = await News.find({ isPublished: true }).sort({ date: -1 }).lean();

    return (
        <UpdatesClient initialArticles={JSON.parse(JSON.stringify(articles || []))} />
    );
}

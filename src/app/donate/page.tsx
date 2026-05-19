import styles from './donate.module.css';
import DonateClient from './DonateClient';
import { connectToDB } from '@/lib/db';
import { DonationSettings } from '@/models/DonationSettings';

// Revalidate this page every hour or when the admin updates it
// Though, Next.js will cache server components unless forced dynamic.
export const dynamic = 'force-dynamic';

export default async function DonatePage() {
    // Fetch settings on the server
    await connectToDB();
    const settingsDoc = await DonationSettings.findOne({ isSingleton: true }).lean();
    
    // Safely parse it for the client
    const settings = settingsDoc ? JSON.parse(JSON.stringify(settingsDoc)) : null;

    return (
        <main className="bg-white min-h-screen flex flex-col">
            {/* Donate Hero - Blue Banner Theme */}
            <header className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 w-full flex flex-col items-center justify-center overflow-hidden bg-[#005D91] mb-12 lg:mb-20">
                <div className="absolute inset-0 bg-gradient-to-r from-[#004B7A] to-[#005D91]"></div>
                <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif-premium font-bold tracking-tight reveal-card" style={{ textWrap: 'balance' }}>
                        Secure Your Hereafter
                    </h1>
                    <p className="mt-4 text-white/80 font-body text-base lg:text-lg max-w-2xl reveal-card stagger-delay" style={{ animationDelay: '0.2s' }}>
                        &quot;The believer&apos;s shade on the Day of Resurrection will be their charity.&quot; Support the Dalailul Khairath project and help us sustain our heritage.
                    </p>
                </div>
            </header>

            <div className="w-full flex-1">
                {/* Client interactive layer */}
                <DonateClient settings={settings} />
            </div>
        </main>
    );
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Count total downloads from usage records
        const downloadCount = await prisma.usageRecord.count({
            where: {
                type: 'download',
            },
        });

        // Count total resumes created as a fallback/addition if needed, 
        // but user specifically asked for "resume downloaded"
        // We can also add a base number if the DB is empty to not show "0" initially if desired,
        // but "Live count" implies accuracy. Let's stick to the DB count.

        return NextResponse.json({
            downloads: downloadCount,
            // If the count is low (e.g. dev env), we might want to show a minimum
            // formattedDownloads: downloadCount > 100 ? `${(downloadCount / 1000).toFixed(1)}K+` : downloadCount.toString()
        });
    } catch (error) {
        console.error('Error fetching public stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

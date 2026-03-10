import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v2 as cloudinary } from 'cloudinary';
import { authOptions } from '@/lib/auth';
import { parseResumeFile, validateFileSize, validateFileType } from '@/lib/resumeParser';
import { parseResumeStructure } from '@/lib/services/resumeStructureParser';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse multipart form data
        const formData = await req.formData();
        const file = formData.get('resume') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!validateFileType(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Please upload a PDF or DOCX file.' },
                { status: 400 }
            );
        }

        // Validate file size (5MB max)
        if (!validateFileSize(file.size, 5)) {
            return NextResponse.json(
                { error: 'File size must be less than 5MB' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parse the resume file
        const resumeText = await parseResumeFile(buffer, file.type);

        if (!resumeText || resumeText.length < 50) {
            return NextResponse.json(
                { error: 'Could not extract sufficient text from the resume. Please ensure the file contains readable text.' },
                { status: 400 }
            );
        }

        // 3. Parse Structure
        console.log('--- Raw Resume Text ---');
        console.log(resumeText.substring(0, 500) + '...'); // Log first 500 chars
        console.log('-----------------------');

        const structuredData = await parseResumeStructure(resumeText);

        console.log('--- Structured Data ---');
        console.log(JSON.stringify(structuredData, null, 2));
        console.log('-----------------------');

        return NextResponse.json({
            text: resumeText,
            structuredData,
            fileName: file.name
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to process resume file' },
            { status: 500 }
        );
    }
}

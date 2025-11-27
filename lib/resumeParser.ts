import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Parse a resume file and extract text content
 * @param buffer - File buffer
 * @param fileType - File MIME type
 * @returns Extracted text content
 */
export async function parseResumeFile(
    buffer: Buffer,
    fileType: string
): Promise<string> {
    try {
        if (fileType === 'application/pdf') {
            return await parsePDF(buffer);
        } else if (
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileType === 'application/msword'
        ) {
            return await parseDOCX(buffer);
        } else {
            throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
        }
    } catch (error) {
        console.error('Resume parsing error:', error);
        throw new Error('Failed to parse resume file. Please ensure the file is not corrupted or password-protected.');
    }
}

/**
 * Parse PDF file and extract text
 */
async function parsePDF(buffer: Buffer): Promise<string> {
    const data = await pdfParse(buffer);
    return data.text.trim();
}

/**
 * Parse DOCX file and extract text
 */
async function parseDOCX(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
}

/**
 * Validate file size
 * @param size - File size in bytes
 * @param maxSizeMB - Maximum allowed size in MB
 */
export function validateFileSize(size: number, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return size <= maxSizeBytes;
}

/**
 * Validate file type
 * @param mimeType - File MIME type
 */
export function validateFileType(mimeType: string): boolean {
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
    ];
    return allowedTypes.includes(mimeType);
}

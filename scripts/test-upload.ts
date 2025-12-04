import fs from 'fs';
import path from 'path';

async function testUpload() {
    const boundary = '--------------------------1234567890';
    const filePath = path.join(process.cwd(), 'test-resume.txt');

    // Create a dummy file
    fs.writeFileSync(filePath, 'This is a test resume content.');

    const fileContent = fs.readFileSync(filePath);
    const fileName = 'test-resume.txt';

    // Construct multipart form data manually (simple version)
    const body = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="${fileName}"\r\nContent-Type: text/plain\r\n\r\n`),
        fileContent,
        Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    console.log('Sending upload request...');
    try {
        const res = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
            },
            body: body as any
        });

        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Response:', text);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testUpload();

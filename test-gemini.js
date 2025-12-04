const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function test() {
    const apiKey = process.env.GOOGLE_API_KEY;
    console.log('API Key present:', !!apiKey);
    if (!apiKey) {
        console.error('No API Key found');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        console.log('Testing generation...');
        const result = await model.generateContent('Say hello');
        const response = await result.response;
        const text = response.text();
        console.log('Success! Output:', text);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response, null, 2));
        }
    }
}

test();

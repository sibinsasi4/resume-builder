const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error('No API Key found');
        return;
    }

    try {
        // We can't list models directly with the SDK easily in this version without a model instance, 
        // but we can try a raw fetch or just try 'gemini-1.0-pro'

        // Let's try a direct fetch to the API to list models
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log('Available Models:');
            data.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`));
        } else {
            console.log('No models found or error:', data);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

listModels();

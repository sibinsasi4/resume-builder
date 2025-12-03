import https from 'https';

async function testIndeedRSS() {
    const query = 'software engineer';
    const location = 'bangalore';
    const url = `https://rss.indeed.com/rss?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`;

    console.log(`Fetching Indeed RSS: ${url}`);

    https.get(url, (res) => {
        console.log(`Status: ${res.statusCode}`);
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log(`Content Length: ${data.length}`);
            console.log('Preview:', data.substring(0, 500));
        });

    }).on('error', (err) => {
        console.error('Error:', err.message);
    });
}

testIndeedRSS();

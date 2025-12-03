import https from 'https';

async function testWWR() {
    const url = 'https://weworkremotely.com/categories/remote-programming-jobs.rss';

    console.log(`Fetching WWR RSS: ${url}`);

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

testWWR();

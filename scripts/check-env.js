// Check available env vars (keys only)
console.log('Available Env Vars:', Object.keys(process.env).filter(k => !k.startsWith('npm_') && !k.startsWith('TERM')));
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('POSTGRES_PRISMA_URL exists:', !!process.env.POSTGRES_PRISMA_URL);

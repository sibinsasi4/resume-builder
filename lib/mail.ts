export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    console.log('----------------------------------------------------------');
    console.log(`📧 MOCK EMAIL TO: ${email}`);
    console.log(`🔗 PASSWORD RESET LINK: ${resetLink}`);
    console.log('----------------------------------------------------------');

    // In production, use Resend or SendGrid here
    // await resend.emails.send({ ... })

    return true;
}



export async function GET(req) {
    const cookies = req.headers.get('cookie');
    const userSession = cookies?.split('; ').find(row => row.startsWith('user_session='))?.split('=')[1];

    if (!userSession) {
        return new Response(JSON.stringify({ error: "User session not found. Please log in." }), { status: 401 });
    }

    return new Response(JSON.stringify({ userId: userSession }), { status: 200 });
}
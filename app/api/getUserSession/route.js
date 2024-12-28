

export async function GET(req) {
    const cookies = req.headers.get('cookie');

    // user session
    const userSession = cookies?.split('; ').find(row => row.startsWith('user_session='))?.split('=')[1];

    // user type
    const userType = cookies?.split('; ').find(row => row.startsWith('user_type='))?.split('=')[1];

    if (!userSession) {
        return new Response(JSON.stringify({ error: "User session not found. Please log in." }), { status: 401 });
    }

    return new Response(JSON.stringify({
        userId: userSession, userType: userType
    }), { status: 200 });
}
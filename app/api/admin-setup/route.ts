import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { setupKey } = await req.json();

    const expectedKey = process.env.ADMIN_SETUP_KEY;
    if (!expectedKey) {
      return NextResponse.json(
        { error: 'Admin setup is not configured. Set ADMIN_SETUP_KEY in server environment variables.' },
        { status: 500 }
      );
    }

    if (!setupKey || setupKey !== expectedKey) {
      return NextResponse.json({ error: 'Invalid setup key.' }, { status: 403 });
    }

    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { ContactMessage } from '@/models/ContactMessage';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDB();
    const newMessage = await ContactMessage.create({
      name,
      email,
      message,
      status: 'new',
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

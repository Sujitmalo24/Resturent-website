import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'testimonials.json');
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);
    return NextResponse.json({ success: true, message: 'Testimonials loaded', data });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Could not load testimonials', error: error.message }, { status: 500 });
  }
}

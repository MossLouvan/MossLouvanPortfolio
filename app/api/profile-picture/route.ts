import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROFILE_IMAGE_DIR = path.join(process.cwd(), 'public', 'profile');
const PROFILE_IMAGE_PATH = path.join(PROFILE_IMAGE_DIR, 'avatar.jpg');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Ensure directory exists
if (!fs.existsSync(PROFILE_IMAGE_DIR)) {
  fs.mkdirSync(PROFILE_IMAGE_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File must be smaller than 5MB' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(PROFILE_IMAGE_PATH, buffer);

    return NextResponse.json({ 
      success: true, 
      url: '/profile/avatar.jpg',
      message: 'Profile picture uploaded successfully'
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile picture' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (fs.existsSync(PROFILE_IMAGE_PATH)) {
      return NextResponse.json({ 
        exists: true, 
        url: '/profile/avatar.jpg' 
      });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking profile picture:', error);
    return NextResponse.json({ exists: false });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { saveResume, getResume } from '@/utils/firebase';

// A simple in-memory storage for demo purposes
// In a production app, you'd use a database
const resumeStorage = new Map<string, any>();

export async function POST(request: NextRequest) {
  console.log('API: POST /api/resume received');
  try {
    const data = await request.json();
    console.log('API: Parsed request data');
    
    console.log('API: Calling saveResume');
    const result = await saveResume(data);
    console.log('API: Resume saved with ID:', result.id);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  console.log('API: GET /api/resume received');
  const id = request.nextUrl.searchParams.get('id');
  console.log('API: Looking for resume with ID:', id);
  
  if (!id) {
    console.log('API: Missing resume ID');
    return NextResponse.json(
      { error: 'Missing resume ID' },
      { status: 400 }
    );
  }
  
  try {
    console.log('API: Calling getResume');
    const resumeData = await getResume(id);
    console.log('API: Resume found, returning data');
    return NextResponse.json(resumeData);
  } catch (error) {
    console.error('API Error:', error);
    const status = error instanceof Error && error.message === 'Resume not found' ? 404 : 400;
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retrieve resume' },
      { status }
    );
  }
} 
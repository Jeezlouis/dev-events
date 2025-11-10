import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event, IEvent } from '@/database';

interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Establish database connection
    await connectDB();

    // Extract and validate slug parameter
    const { slug } = await params;

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Valid slug parameter is required' },
        { status: 400 }
      );
    }


    // Query event by slug
    const event: IEvent | null = await Event.findOne({ slug: slug.trim().toLowerCase() }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json(
      {
        success: true,
        data: event,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (use proper logging in production)
    console.error('Error fetching event by slug:', error);

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while fetching the event',
      },
      { status: 500 }
    );
  }
}

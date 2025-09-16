import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const NEWSLETTER_FILE = path.join(process.cwd(), 'data', 'newsletter-subscribers.json');

// Initialize newsletter file if it doesn't exist
async function initializeNewsletterFile() {
  if (!existsSync(NEWSLETTER_FILE)) {
    const initialData = { subscribers: [] };
    await writeFile(NEWSLETTER_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  
  const data = await readFile(NEWSLETTER_FILE, 'utf8');
  return JSON.parse(data);
}

// Validate email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return Response.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return Response.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Load existing subscribers
    const data = await initializeNewsletterFile();

    // Check if email already exists
    const existingSubscriber = data.subscribers.find(
      sub => sub.email.toLowerCase() === email.toLowerCase()
    );

    if (existingSubscriber) {
      return Response.json(
        { success: false, message: 'Email is already subscribed to our newsletter' },
        { status: 400 }
      );
    }

    // Add new subscriber
    const newSubscriber = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      isActive: true,
      source: 'website_footer'
    };

    data.subscribers.push(newSubscriber);

    // Save updated data
    await writeFile(NEWSLETTER_FILE, JSON.stringify(data, null, 2));

    // TODO: Add to email service (Mailchimp, SendGrid, etc.)
    // await addToEmailService(newSubscriber.email);

    return Response.json(
      { 
        success: true, 
        message: 'Successfully subscribed to our newsletter! Thank you for joining our community.',
        data: { 
          email: newSubscriber.email,
          subscribedAt: newSubscriber.subscribedAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return Response.json(
      { success: false, message: 'Failed to subscribe to newsletter. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // This endpoint is for admin use only
    const url = new URL(request.url);
    const adminKey = url.searchParams.get('admin_key');

    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return Response.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const data = await initializeNewsletterFile();
    
    // Return summary stats
    const stats = {
      totalSubscribers: data.subscribers.length,
      activeSubscribers: data.subscribers.filter(sub => sub.isActive).length,
      recentSubscribers: data.subscribers
        .filter(sub => {
          const subDate = new Date(sub.subscribedAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return subDate > weekAgo;
        }).length
    };

    return Response.json(
      { 
        success: true, 
        message: 'Newsletter subscriber statistics',
        data: {
          stats,
          subscribers: data.subscribers.map(sub => ({
            id: sub.id,
            email: sub.email,
            subscribedAt: sub.subscribedAt,
            isActive: sub.isActive,
            source: sub.source
          }))
        }
      }
    );

  } catch (error) {
    console.error('Newsletter GET error:', error);
    return Response.json(
      { success: false, message: 'Failed to retrieve newsletter data' },
      { status: 500 }
    );
  }
}

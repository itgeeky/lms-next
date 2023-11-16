import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId, isPublished: true },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: { courseId: params.courseId, userId: user.id },
      },
    });

    if (purchase) {
      return new NextResponse('Already purchase', { status: 400 });
    }

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
        quantity: 1,
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: { userId: user.id },
      select:{
        stripeCustomerId: true
      }
    });

    if(!stripeCustomer){
      const customer = await stripe.customers.create({
        email: user.emailAddresses?.[0]?.emailAddress!,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}`,
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
    });
    
    return new NextResponse(JSON.stringify({ url: session.url }));

  } catch (error) {
    console.log('CHECKOUT ERROR', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

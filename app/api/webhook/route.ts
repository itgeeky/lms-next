import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request){
  const body = await req.text();
  const sig = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    return new NextResponse('Invalid webhook request', { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  if(event.type === 'checkout.session.completed'){
    if(!userId || !courseId){
      return new NextResponse('Invalid session, missing metadata.', { status: 400 });
    }
    
    await db.purchase.create({
      data: {
        userId,
        courseId
      }
    });
  }else{
    return new NextResponse(`Webhook error. Unhandled evet type ${event.type}`, { status: 200 });
  }

  return new NextResponse('OK', { status: 200 });

} 
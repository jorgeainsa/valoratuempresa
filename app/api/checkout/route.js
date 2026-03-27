import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  essential:            process.env.STRIPE_PRICE_ESSENTIAL,
  professional:         process.env.STRIPE_PRICE_PROFESSIONAL,
  professional_upgrade: process.env.STRIPE_PRICE_UPGRADE,
};

export async function POST(req) {
  try {
    const { plan, email, name, empresa } = await req.json();

    const priceId = PRICES[plan];
    if (!priceId) {
      return Response.json({ error: "Plan no válido" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      metadata: { plan, empresa: empresa || "", name: name || "" },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?payment=success&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_BASE_URL}/?payment=cancelled`,
      automatic_tax: { enabled: true },
      invoice_creation: { enabled: true },
      locale: "es",
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

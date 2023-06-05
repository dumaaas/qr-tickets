const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { items } = req.body;

  const transformedItems = items.map((item) => ({
    price_data: {
      currency: "usd",
      unit_amount: item.price * 100,
      product_data: {
        name: item.name,
      },
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // success_url: `${process.env.WEB_URL}/purchase?sessionId={CHECKOUT_SESSION_ID}`,
    success_url: `${process.env.WEB_URL}/success`,
    cancel_url: `${process.env.WEB_URL}/purchase`,
    line_items: transformedItems,
    mode: "payment",
    metadata: {
      purchase: JSON.stringify(items)
    }
  });

  res.status(200).json({ id: session.id })
};

/* eslint-disable import/no-anonymous-default-export */
import { query as q } from 'faunadb';
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/react'
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  }
  data: {
    stripe_customer_id: string;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {

    //Criando customer dentro do painel do Stripe
    const session = await getSession({ req }) // Vamos precisar dos dados do usuário logado, nesse caso pegamos pela session

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    )

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({ // Cadastro de cliente proprio
        email: session.user.email,
      })

      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id
            }
          }
        )
      )

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId, //id do customer no stripe
      payment_method_types: ['card'], // Metodo de pagamento (c. credito)
      billing_address_collection: 'required', // Se quer obrigar o user a add endereço ou deixar o stripe lidar com isso
      line_items: [ // Quais itens queremos que a pessoa possa ter dentro do carrinho
        { price: 'price_1LXU1KE5uVVcrnb7A6hP57ZF', quantity: 1 },
      ],
      mode: 'subscription', // Tipo de pagamento, nesse caso recorrente
      allow_promotion_codes: true, // Cupom de desconto
      success_url: process.env.STRIPE_SUCCESS_URL, // Para onde vai caso tudo esteja okay
      cancel_url: process.env.STRIPE_CANCEL_URL // Se for cancelado para onde vai
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
  }
}
import { loadStripe, Stripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey)
  }
  return stripePromise
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  client_secret: string
}

export class StripeService {
  // Créer un PaymentIntent
  static async createPaymentIntent(amount: number, currency: string = 'eur'): Promise<PaymentIntent> {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Stripe utilise les centimes
        currency,
      }),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la création du PaymentIntent')
    }

    return await response.json()
  }

  // Confirmer un paiement
  static async confirmPayment(clientSecret: string, paymentMethodId: string) {
    const stripe = await getStripe()
    if (!stripe) {
      throw new Error('Stripe n\'est pas initialisé')
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId,
    })

    if (error) {
      throw new Error(error.message)
    }

    return paymentIntent
  }

  // Créer un client Stripe
  static async createCustomer(email: string, name: string) {
    const response = await fetch('/api/create-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
      }),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la création du client')
    }

    return await response.json()
  }

  // Créer une session de paiement pour un abonnement
  static async createCheckoutSession(priceId: string, customerId?: string) {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerId,
      }),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la session')
    }

    const { url } = await response.json()
    return url
  }

  // Obtenir les méthodes de paiement d'un client
  static async getPaymentMethods(customerId: string) {
    const response = await fetch(`/api/payment-methods/${customerId}`)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des méthodes de paiement')
    }

    return await response.json()
  }

  // Créer un setup intent pour sauvegarder une carte
  static async createSetupIntent(customerId: string) {
    const response = await fetch('/api/create-setup-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
      }),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la création du SetupIntent')
    }

    return await response.json()
  }
}

// Hook React pour Stripe
export function useStripe() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processPayment = async (amount: number, paymentMethodId: string) => {
    setLoading(true)
    setError(null)

    try {
      const paymentIntent = await StripeService.createPaymentIntent(amount)
      const result = await StripeService.confirmPayment(paymentIntent.client_secret, paymentMethodId)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createCheckoutSession = async (priceId: string, customerId?: string) => {
    setLoading(true)
    setError(null)

    try {
      const url = await StripeService.createCheckoutSession(priceId, customerId)
      window.location.href = url
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    processPayment,
    createCheckoutSession,
    clearError: () => setError(null)
  }
}

import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { StripeService } from '../../lib/stripe'

interface PaymentFormProps {
  amount: number
  onSuccess: (paymentIntent: any) => void
  onError: (error: string) => void
}

export default function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Élément de carte non trouvé')
      }

      // Créer le PaymentIntent
      const paymentIntent = await StripeService.createPaymentIntent(amount)

      // Confirmer le paiement
      const { error, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      )

      if (error) {
        throw new Error(error.message)
      }

      if (confirmedPayment?.status === 'succeeded') {
        onSuccess(confirmedPayment)
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du paiement'
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informations de paiement
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carte bancaire
          </label>
          <div className="p-3 border border-gray-300 rounded-lg">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Montant total:</span>
            <span className="text-xl font-bold text-gray-900">
              {amount.toLocaleString('fr-FR')}€
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Traitement...' : `Payer ${amount.toLocaleString('fr-FR')}€`}
      </button>
    </form>
  )
}

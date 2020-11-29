import { useState, useEffect } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/useRequest'

const getTimeLeft = (order) => {
  const msLeft = new Date(order.expiresAt) - new Date()
  return Math.round(msLeft / 1000)
}

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(order))

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: (payment) => console.log(payment)
  })

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft(getTimeLeft(order))
    }, 1000);

    return () => {
      clearInterval(timerId)
    }
  }, [order])

  if(timeLeft < 0) return <div>Order Expired</div>

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={(token) => doRequest({ token: token.id })}
        stripeKey='pk_test_r01zCSEjGuosiEitm04Sst9m00mqX2Wd6F'
        amount={order.ticket.price * 100}
        email={currentUser.email}
        />
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)
  return { order: data }
}

export default OrderShow
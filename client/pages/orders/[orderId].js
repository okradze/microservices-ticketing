import { useState, useEffect } from 'react'

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const timerId = setInterval(() => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }, 1000);

    return () => {
      clearInterval(timerId)
    }
  }, [order])

  if(timeLeft < 0) return <div>Order Expired</div>

  return (
    <div>
      Time left to pay: {timeLeft} seconds
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)
  return { order: data }
}

export default OrderShow
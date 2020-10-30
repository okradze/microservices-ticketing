import { useState } from 'react'
import axios from 'axios'

const useRequest = ({ url, method, body }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async () => {
    try {
      setErrors(null)
      const response = await axios(
        url,
        method,
        body
      )
      return response.data
    } catch (errors) {
      console.log(errors)
      setErrors(
        <div className='alert alert-danger'>
          <h4>Oops</h4>
          <ul className='my-0'>
            {errors.response.data.errors.map(err => (
              <li key={err.message}>
                {err.message}
              </li>
            ))}
          </ul>
        </div>
      )
    }
  }

  return {
    doRequest,
    errors
  }
}

export default useRequest
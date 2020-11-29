import { useState } from 'react'
import axios from 'axios'

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async (additionalBody = {}) => {
    try {
      setErrors(null)
      const response = await axios[method](url, { ...body, ...additionalBody })

      if(onSuccess) onSuccess(response.data)

      return response.data
    } catch (errors) {
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
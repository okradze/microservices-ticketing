import { useState } from 'react'
import Router from 'next/router'
import buildClient from '../../api/build-client'
import useRequest from '../../hooks/useRequest'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/')
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    await doRequest()
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className='form-group'>
        <label>Email Address</label>
        <input value={email} onChange={e => setEmail(e.target.value)} className='form-control' />
      </div>
      <div className='form-group'>
        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type='password' className='form-control' />
      </div>
      {errors}
      <button className='btn btn-primary'>Sign In</button>
    </form>
  )
}

export const getServerSideProps = async (context) => {
  const client = buildClient(context)
  const { data } = await client.get('/api/users/currentuser')
  return { props: data }
}

export default SignIn
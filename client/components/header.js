import Router from 'next/router'
import Link from './link'
import useRequest from '../hooks/useRequest'

const Header = ({ currentUser }) => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  })
  
  return (
    <nav className='navbar navbar-light bg-light'>
      <Link href='/' className='navbar-brand'>GitTix</Link>

      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>
          {currentUser ? (
            <Link href='/' onClick={() => doRequest()}>Sign Out</Link>
          ) : (
            <>
            <Link href='/auth/signin'>Sign In</Link>
            <Link href='/auth/signup'>Sign Up</Link>
            </>
          )}
        </ul>
      </div>
    </nav>
)}

export default Header
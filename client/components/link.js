import Link from 'next/link'

const CustomLink = ({ children, href, ...props }) => (
  <li className='nav-item'>
    <Link href={href}>
      <a className='nav-link' {...props}>{children}</a>
    </Link>
  </li>
)

export default CustomLink
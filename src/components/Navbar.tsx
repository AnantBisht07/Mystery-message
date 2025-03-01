'use client' // server p render hokr nhi ayegaa
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {User} from 'next-auth' // session ke andr data pass kia tha user ka to ab user whi sen lenge as a next-auth
import { Button } from './ui/button'
import { toast } from 'sonner'

const Navbar = () => {
    const { data: session } = useSession() // as we know useSession next-auth ke andr as a hook hai to data destructure krnge
    const user: User = session?.user // optionally data nikal rhe, upr data mai hume login h ya nahi user milega, but actuall user data idhr se extract hoga

    // logout 
    const handleLogOut = () => {
        signOut();
        toast.success('Logged out successfully!')
    }

  return (
    <nav className='p-4 md:p-6 shadow-md text-white w-full top-0 fixed z-10 backdrop-blur-lg'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <a className='text-xl font-bold mb-4 md:mb-0' href="#">Mystery Message</a>
            {
               session ? (
                <>
                    <span className='mr-4 '>Welcome, {user?.username || user?.email} </span>
                    <Button className='w-full mt-3 md:w-auto' onClick={() => handleLogOut()}>Logout</Button>
                </>
               ) : (
                <Link href='/sign-in'>
                    <Button className='w-full md:w-auto'>Login</Button>
                </Link>
               )
            }
        </div>
    </nav>
  )
}

export default Navbar

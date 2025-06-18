'use server'
import SignInForm from './sign-in-form'
import SplashArt from './splash-art'
import { Metadata } from 'next'

export const metadata = async (): Promise<Metadata> => {
  return {
    title: 'Sign In',
  }
}

const signIn = () => {
  return (
    <div className="h-screen w-full flex-row items-center justify-center px-24 py-8 sm:flex md:px-0 md:py-0">
      <div className="mx-auto w-full max-w-md flex-col items-center justify-center sm:rounded-xl sm:bg-white sm:py-12 sm:shadow-md md:flex md:h-screen md:min-h-full md:w-1/2 md:max-w-none md:shadow-none">
        <SignInForm />
      </div>
      <div className="relative hidden h-full w-1/2 flex-auto items-center justify-center overflow-hidden bg-gray-800 p-16 md:flex lg:px-28 dark:border-l">
        <SplashArt />
      </div>
    </div>
  )
}

export default signIn

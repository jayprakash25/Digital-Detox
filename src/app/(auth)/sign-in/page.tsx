'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Chrome, Pause } from 'lucide-react';
import { signIn } from 'next-auth/react';

const SignInPage = () => {

  const handleGoogleSignIn = async() => {
    try {
      await signIn('google', {
        callbackUrl: '/',
        redirect: false
      })
      console.log("success signin ")
    } catch (error) {
        console.log('Eror signing in:', error)
    }
  }

  return (
    <div className="h-screen w-full bg-[#1a1d21] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-8 space-x-2">
        <Pause color="#4a9fff" />
          <h1 className="text-2xl font-semibold text-white">youtube detoxify</h1>
        </div>
        
        <h2 className="text-4xl font-bold mb-2 text-white">Hello, <span className="text-[#4a9fff]">human</span></h2>
        <p className="text-[#9ba1a6] mb-8">Refine your viewing, elevate your mind.</p>
        
        <Button 
          className="w-full bg-[#2b2d31] text-white hover:bg-[#3a3d42] transition-colors duration-300 py-3 text-sm font-medium rounded-md flex items-center justify-center space-x-2 mb-8"
          onClick={handleGoogleSignIn}
        >
          
          Continue with Google
        </Button>
        
        <p className="text-[#9ba1a6] text-sm">Ready for your <span className="text-white font-semibold">Mindful Watch?</span></p>
        
        <p className="text-xs text-[#9ba1a6] mt-8">
          By continuing, you agree to our <a href="#" className="text-[#4a9fff]">Terms of Service</a> and <a href="#" className="text-[#4a9fff]">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
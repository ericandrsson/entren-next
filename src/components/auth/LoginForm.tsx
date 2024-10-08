'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Separator } from '@/src/components/ui/separator'
import { Lock } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement email link sending logic
    console.log('Sending login link to:', email)
  }

  const signInWithOtp = async () => {
    // TODO: Implement OTP login logic
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: "/",
        },
      });
      if (error) throw error;
      // Handle successful OTP sign-in
      console.log('OTP sign-in successful', data);
    } catch (error) {
      console.error('Error signing in with OTP:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-primary mb-6">Logga in</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Fyll i dina inloggningsuppgifter
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
            E-post
          </label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@epost.se"
            required
            className="mt-1"
          />
        </div>
        <Button type="submit" className="w-full bg-primary text-primary-foreground" onClick={signInWithOtp}>
          Skicka länk till min e-postadress
        </Button>
      </form>
      <p className="text-xs text-muted-foreground mt-4">
        Genom att använda tjänsten godkänner du{' '}
        <a href="#" className="text-primary hover:underline">
          användarvillkor för EntrenKonto
        </a>
      </p>
      <div className="relative my-6">
        <Separator className="w-full" />
        <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 text-xs text-muted-foreground bg-white">
          eller
        </span>
      </div>
      <Button
        variant="outline"
        className="bg-white text-gray-500 w-full flex items-center justify-center space-x-2"
        onClick={() => {
          // TODO: Implement Google sign-in
          console.log('Sign in with Google')
        }}
      >
        <Lock className="h-5 w-5" />
        <span>Fortsätt med Google</span>
      </Button>
      <Button
        variant="outline"
        className="bg-white text-primary w-full mt-3 flex items-center justify-center shadow-lg"
        onClick={() => router.push('/login-password')}
      >
        <Lock className="h-4 w-4 mr-2" />
        Logga in med lösenord
      </Button>
      <p className="text-xs text-center text-muted-foreground mt-6">
        Så hanterar vi dina{' '}
        <a href="#" className="text-primary hover:underline">
          personuppgifter
        </a>
      </p>
    </div>
  )
}
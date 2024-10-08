'use client'

import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Separator } from '@/src/components/ui/separator'
import { Lock, AlertTriangle } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'
import { Checkbox } from '@/src/components/ui/checkbox'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formState, setFormState] = useState<'initial' | 'password' | 'create'>('initial')
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailExists, setEmailExists] = useState(false)

  const checkEmailExists = async (email: string) => {
    try {
      const { data, error } = await supabase.rpc('email_exists', { email })
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error checking email:', error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formState === 'create') {    
      const exists = await checkEmailExists(email)
      if (exists) {
        setEmailExists(true)
        return
      }
      console.log('Creating account:', email, password, subscribeNewsletter, acceptTerms)
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        console.error('Error creating account:', error)
      } else {
        // Handle successful account creation
        console.log('Account created successfully')
      }
    } else if (showPassword) {
      // Implement password login logic
      console.log('Logging in with password:', email, password)
    } else {
      // Implement OTP login logic
      await signInWithOtp()
    }
  }

  const signInWithOtp = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: "/",
        },
      });
      if (error) throw error;
      console.log('OTP sign-in successful', data);
    } catch (error) {
      console.error('Error signing in with OTP:', error);
    }
  };

  const togglePasswordLogin = () => {
    setShowPassword(!showPassword)
    setFormState(showPassword ? 'initial' : 'password')
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailExists(false)
  }

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-primary mb-6">
        {formState === 'create' ? 'Skapa konto på Entren' : 'Logga in'}
      </h2>
      {!showPassword && formState !== 'create' && (
        <>
          <p className="text-sm text-muted-foreground mb-2">Fyll i dina inloggningsuppgifter</p>
          <p className="text-sm text-muted-foreground mb-4">
            Logga in eller skapa konto utan lösenord - fyll i din e-postadress så skickar vi en länk.
          </p>
        </>
      )}
      {(showPassword || formState === 'create') && (
        <p className="text-sm text-muted-foreground mb-4">
          {formState === 'create' ? 'Fyll i dina uppgifter' : 'Fyll i dina inloggningsuppgifter'}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
            {formState === 'create' ? 'E-postadress' : 'E-post'}
          </label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
            className={`bg-white mt-1 ${emailExists ? 'border-red-500' : ''}`}
          />
          {emailExists && (
            <div className="flex items-center mt-2 text-red-500">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm">E-postadressen finns redan registrerad.</span>
            </div>
          )}
        </div>
        {(showPassword || formState === 'create') && (
          <div>
            <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
              {formState === 'create' ? 'Välj lösenord' : 'Lösenord'}
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white mt-1"
            />
          </div>
        )}
        {formState === 'create' && (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter"
                checked={subscribeNewsletter}
                onCheckedChange={(checked) => setSubscribeNewsletter(checked as boolean)}
              />
              <label htmlFor="newsletter" className="text-sm text-muted-foreground">
                Ja tack! Jag vill prenumerera på Entrens nyhetsbrev och få personanpassat innehåll och relevanta erbjudanden från Entren och dess partners, i enlighet med Entrens personuppgiftspolicy.
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                required
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                Jag godkänner användarvillkor för Entrenkonto
              </label>
            </div>
          </>
        )}
        <Button type="submit" className="w-full bg-primary text-primary-foreground">
          {formState === 'create' 
            ? 'Skapa konto' 
            : showPassword 
              ? 'Logga in'
              : 'Skicka länk till min e-postadress'}
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
        onClick={togglePasswordLogin}
      >
        <Lock className="h-4 w-4 mr-2" />
        {showPassword ? 'Logga in utan lösenord' : 'Logga in med lösenord'}
      </Button>
      {formState !== 'create' && (
        <Button
          variant="link"
          className="w-full mt-3"
          onClick={() => setFormState('create')}
        >
          Skapa konto
        </Button>
      )}
      {formState === 'create' && (
        <Button
          variant="link"
          className="w-full mt-3"
          onClick={() => {
            setFormState('initial')
            setShowPassword(false)
          }}
        >
          Jag har redan ett konto
        </Button>
      )}
      <p className="text-xs text-center text-muted-foreground mt-6">
        Så hanterar vi dina{' '}
        <a href="#" className="text-primary hover:underline">
          personuppgifter
        </a>
      </p>
    </div>
  )
}
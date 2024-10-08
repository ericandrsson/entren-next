'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Separator } from '@/src/components/ui/separator'
import { Lock, AlertTriangle } from 'lucide-react'
import { supabase } from '@/utils/supabase/server'
import { Checkbox } from '@/src/components/ui/checkbox'
import { useToast } from "@/src/hooks/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form"

// Define the form schema
const formSchema = z.object({
  email: z.string().email({ message: "Ogiltig e-postadress" }),
  password: z.string().min(6, { message: "Lösenord måste vara minst 6 tecken" }).optional(),
  subscribeNewsletter: z.boolean().optional(),
  acceptTerms: z.boolean().optional(),
})

export default function LoginForm() {
  const [formState, setFormState] = useState<'initial' | 'password' | 'create'>('initial')
  const [showPassword, setShowPassword] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      subscribeNewsletter: false,
      acceptTerms: false,
    },
  })

  // Check if email exists
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

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (formState === 'create') {
      await handleSignUp(values)
    } else if (showPassword) {
      await handlePasswordLogin(values)
    } else {
      await handleOtpLogin(values)
    }
  }

  // Handle sign up
  const handleSignUp = async (values: z.infer<typeof formSchema>) => {
    const exists = await checkEmailExists(values.email)
    if (exists) {
      setEmailExists(true)
      return
    }
    const { error } = await supabase.auth.signUp({ 
      email: values.email, 
      password: values.password as string 
    })
    if (error) {
      console.error('Error creating account:', error)
      toast({
        title: "Fel vid skapande av konto",
        description: "Det gick inte att skapa kontot. Försök igen senare.",
        variant: "destructive",
      })
    } else {
      localStorage.setItem('accountCreatedToast', JSON.stringify({
        title: "Konto skapat",
        description: "Ditt konto har skapats framgångsrikt. Kolla din e-post för verifieringslänk.",
        variant: "default",
      }))
      router.push('/')
    }
  }

  // Handle password login
  const handlePasswordLogin = async (values: z.infer<typeof formSchema>) => {
    const { error } = await supabase.auth.signInWithPassword({ 
      email: values.email, 
      password: values.password as string 
    })
    if (error) {
      console.error('Error logging in:', error)
      toast({
        title: "Fel vid inloggning",
        description: "Det gick inte att logga in. Försök igen senare.",
        variant: "destructive",
      })
    } else {
      router.push('/')
    }
  }

  // Handle OTP login
  const handleOtpLogin = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: "/",
        },
      });
      if (error) throw error;
      console.log('OTP sign-in successful', data);
      toast({
        title: "Inloggningslänk skickad",
        description: "Kolla din e-post för en länk att logga in med.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error signing in with OTP:', error);
      toast({
        title: "Fel vid inloggning",
        description: "Det gick inte att skicka inloggningslänken. Försök igen senare.",
        variant: "destructive",
      })
    }
  }

  // Toggle password login
  const togglePasswordLogin = () => {
    setShowPassword(!showPassword)
    setFormState(showPassword ? 'initial' : 'password')
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-postadress</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email" 
                    className={`bg-white ${emailExists ? 'border-red-500' : ''}`}
                  />
                </FormControl>
                {emailExists && (
                  <div className="flex items-center mt-2 text-red-500">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span className="text-sm">E-postadressen finns redan registrerad.</span>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {(showPassword || formState === 'create') && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{formState === 'create' ? 'Välj lösenord' : 'Lösenord'}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {formState === 'create' && (
            <>
              <FormField
                control={form.control}
                name="subscribeNewsletter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Ja tack! Jag vill prenumerera på Entrens nyhetsbrev
                      </FormLabel>
                      <FormDescription>
                        Få personanpassat innehåll och relevanta erbjudanden från Entren och dess partners, i enlighet med Entrens personuppgiftspolicy.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        required
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Jag godkänner användarvillkor för Entrenkonto
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
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
      </Form>
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
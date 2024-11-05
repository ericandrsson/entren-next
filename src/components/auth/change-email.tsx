'use client'

import { useState } from 'react'
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/src/components/ui/alert"

export default function ChangeEmail() {
  const [currentEmail] = useState('eric.andrsson@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Here you would typically make an API call to change the email
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      console.log('Email change submitted')
    } catch (err) {
      setError('Ett fel uppstod. Försök igen senare.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="m-auto w-screen overflow-y-auto rounded-none bg-card shadow-none sm:max-h-[calc(100vh-112px)] sm:max-w-lg sm:rounded-lg sm:shadow-lg sm:shadow-zinc-500/10">
      <CardHeader>
        <CardTitle>Byt e-post</CardTitle>
        <CardDescription>
          Ange ditt lösenord för att bekräfta ändringen av e-postadress
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-postadress</Label>
            <Input
              type="email"
              id="email"
              value={currentEmail}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Nuvarande lösenord</Label>
              <Link 
                href="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                Glömt lösenordet?
              </Link>
            </div>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            type="submit" 
            className="w-full bg-[#00823B] hover:bg-[#00823B]/90" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Bearbetar...' : 'Byt e-post'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => window.history.back()}
          >
            Avbryt
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
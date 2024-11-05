'use client'

import { useState } from 'react'
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/src/components/ui/alert-dialog"
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function DeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAccount = () => {
    setIsDeleting(true)
    // Here you would typically call an API to delete the account
    console.log('Deleting account...')
    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false)
      console.log('Account deleted')
      // Here you would typically redirect to a confirmation page or log out the user
    }, 2000)
  }

  return (
    <Card className="m-auto w-screen overflow-y-auto rounded-none bg-card shadow-none sm:max-h-[calc(100vh-112px)] sm:max-w-lg sm:rounded-lg sm:shadow-lg sm:shadow-zinc-500/10">
      <CardHeader>
        <CardTitle>Ta bort konto</CardTitle>
        <CardDescription>
          Ditt Entrén-konto används för att bidra till och få tillgång till verifierad information om tillgängliga entréer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Om du tar bort ditt Entrén-konto så raderar vi all information som finns sparad kopplat till ditt konto:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>ditt namn och kontaktuppgifter</li>
          <li>dina bidrag och verifieringar av entréer</li>
          <li>dina sparade platser och sökningar</li>
        </ul>
        <p>Du kommer inte längre att kunna bidra med eller verifiera information om tillgängliga entréer.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/account-settings" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center">
              <Trash2 className="mr-2 h-4 w-4" /> Ta bort konto
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Är du säker på att du vill ta bort ditt konto?</AlertDialogTitle>
              <AlertDialogDescription>
                Denna åtgärd kan inte ångras. Detta kommer permanent att ta bort ditt konto och all relaterad data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Avbryt</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting}>
                {isDeleting ? 'Tar bort...' : 'Ja, ta bort mitt konto'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

export default function UserAuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return user ? (
    <span className="text-sm">{user.email}</span>
  ) : (
    <Link href="/login">
      <Button variant="default" className="text-white">
        Logga in
      </Button>
    </Link>
  )
}
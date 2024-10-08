'use client'

import { Dialog, DialogContent } from '@/src/components/ui/dialog'
import LoginForm from '@/src/components/auth/LoginForm'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <LoginForm />
      </DialogContent>
    </Dialog>
  )
}
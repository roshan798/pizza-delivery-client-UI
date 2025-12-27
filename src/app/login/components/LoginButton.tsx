'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useFormStatus } from 'react-dom'

const LoginButton = () => {
    const {pending} = useFormStatus();
    return (
        <Button className="w-full cursor-pointer" disabled={pending}>
            {pending ? 'Logging in...' : 'Login'}
        </Button>

    )
}

export default LoginButton
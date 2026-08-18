import { signup } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

import { FadeIn } from '@/components/animations/FadeIn'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <FadeIn className="w-full max-w-sm">
        <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your email below to create a new account.
          </CardDescription>
        </CardHeader>
        <form action={signup}>
          <CardContent className="grid gap-4">
            {message && (
              <FadeIn delay={0.1}>
                <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">{message}</div>
              </FadeIn>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" name="confirm-password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit">Sign up</Button>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
        </Card>
      </FadeIn>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createClient } from "@/utils/supabase/server"
import Image from "next/image"
import { redirect } from "next/navigation"

export default function AuthenticationPage() {
  async function signIn() {
    "use server"
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback?next=/user",
      },
    })
    if (error) {
      redirect("/error")
    }
    redirect(data.url)
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col justify-center">
      <Card className="w-full ">
        <Image alt="Image" height="1000" src="/petit-dej.png" width="500" />
        <CardHeader className="flex flex-col items-center space-y-2">
          <CardTitle>Petit dej</CardTitle>
          <CardDescription>Qui va payer les croissants ?</CardDescription>
        </CardHeader>

        <form action={signIn}>
          <CardContent className="flex flex-col gap-4">
            <Button className="w-full">Connecte toi avec google</Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

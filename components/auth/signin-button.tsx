import { signInAction } from "@/actions"
import {Button} from "@heroui/react";
 
export default function SignIn() {
  return (
    <form
      action={signInAction}
    >
      <Button type="submit" variant="ghost">Sign in</Button>
    </form>
  )
}
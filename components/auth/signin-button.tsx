import { signInAction } from "@/actions"
import {Button} from "@heroui/button";
 
export default function SignIn() {
  return (
    <form
      action={signInAction}
    >
      <Button type="submit" color="secondary" variant="bordered">Sign in</Button>
    </form>
  )
}
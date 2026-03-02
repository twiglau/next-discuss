
import {Button} from "@heroui/button"; 
import { signOutAction } from "@/actions";

export default function SignOut() {
  return (
    <form
      action={signOutAction}
    >
      <Button type="submit" color="secondary">Sign out</Button>
    </form>
  )
}
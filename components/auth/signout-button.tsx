
import {Button} from "@heroui/react"; 
import { signOutAction } from "@/actions";

export default function SignOut() {
  return (
    <form
      action={signOutAction}
    >
      <Button type="submit" variant="secondary">Sign out</Button>
    </form>
  )
}
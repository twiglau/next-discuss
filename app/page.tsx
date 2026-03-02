import { Button } from "@heroui/button";
import Link from "next/link";


export default async function App() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1>话题</h1>
        <Link href="/new">
          <Button color="secondary" variant="bordered">
            创建
          </Button>
        </Link>
      </div>
    </div>
  )
}
import {Input} from "@heroui/react";
import UserAuth from "./user-auth";
import {Link} from "@heroui/react";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default async function App() {
  // const session = await auth();
  // let userInfo: React.ReactNode = null
  
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b-1 dark:border-gray-800">
      <Link href="/" className="flex items-center gap-2">
        <AcmeLogo />
        <p className="font-bold text-inherit">Discuss</p>
      </Link>
      <div className="hidden sm:flex gap-4 flex-1 justify-center">
        <div>
          <Input placeholder="Search" />
        </div>
      </div>
      <div className="flex justify-end flex-none">
        <UserAuth />
      </div>
    </nav>
  );
}

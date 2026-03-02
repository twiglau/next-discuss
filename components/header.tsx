import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@heroui/navbar";
import {Input} from "@heroui/input";
import UserAuth from "./user-auth";


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
    <Navbar className="border-b-1 dark:border-gray-800">
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">Discuss</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Input placeholder="Search" />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <UserAuth />
      </NavbarContent>
    </Navbar>
  );
}

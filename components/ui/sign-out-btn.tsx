"use client";
import { signOut } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "./dropdown-menu";
import { useRouter } from "next/router";

export default function SignOutButton() {
  const router = useRouter();

  9;
  return (
    <DropdownMenuItem
      onClick={async () => {
        const result = await signOut();
        if (result.data) {
          router.push("/sign-in");
        } else {
          alert("Error signing out");
        }
      }}
    >
      Log out
    </DropdownMenuItem>
  );
}

"use client";

import * as z from "zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { useState } from "react";

export default function SignInForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // if (!session) {
    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signIn("credentials", {
              redirect: false,
              username: username,
              password: password,
            });
          }}
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign In</button>
        </form>
        <Link href="/sign-up">Sign Up</Link>
        <Link href="/">Home</Link>
        <Link href="/sign-in">Sign In</Link>
        <Link href="/sign-out">Sign Out</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
    );
  // }else{
  //   return (
  //     <div>
  //       You Are ALredy logged in;
  //     </div>
  //   )
  // }
}

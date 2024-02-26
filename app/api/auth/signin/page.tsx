"use client"
import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/app/_components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

const SignIn = () => {
    const router = useRouter();

    const handleBackCLick = () => {
        router.replace("/");
    }
    return ( 
        <section className="mx-auto w-fit flex items-center py-8 container gap-10 mt-8 rounded-lg border-primary border-2 lg:w-1/3 flex-col">
            <Button onClick={handleBackCLick} size="icon" variant="outline" className="z-50 absolute top-4 left-4">
                <ChevronLeftIcon />
            </Button>
            <h1 className='text-lg lg:text-2xl'>Faça Login</h1>
            <Button
                variant="outline"
                className="justify-center gap-2 lg:w-1/2 items-center flex"
                onClick={() => signIn("google", { callbackUrl: "/" })}
            >
                <FaGoogle/>Sign in with Google
            </Button>
            
        </section>
     );
}
 
export default SignIn;
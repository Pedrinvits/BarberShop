"use client"
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon, MenuIcon, UserIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import SideMenu from "./side-menu";
const Header = () => {
   
    return ( 
        <Card>
            <CardContent className="p-5 justify-between items-center flex flex-row">
                <Link href={'/'}><Image src="/logo.png" alt="" height={18} width={120}/></Link>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <MenuIcon size={18}/>
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="p-0">
                        <SideMenu/>
                    </SheetContent>
                </Sheet>
            </CardContent>
        </Card>
    );
}
 
export default Header;
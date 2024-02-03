import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { MenuIcon } from "lucide-react";
const Header = () => {
    return ( 
        <Card>
            <CardContent className="p-5 justify-between items-center flex flex-row">
                <Image src="/logo.png" alt="" height={18} width={120}/>
                <Button variant="outline" size="icon" className="">
                    <MenuIcon size={18}/>
                </Button>
            </CardContent>
        </Card>
    );
}
 
export default Header;
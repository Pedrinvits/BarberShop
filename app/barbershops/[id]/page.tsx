import { db } from "@/app/_lib/prisma";
import Image from "next/image";
import BarberShopInfo from "./_components/barbershop-info";

interface BarberShopDetailsProps {
    params : {
        id?: string;
    }
}
const  BarberShopDetails =  async({params} : BarberShopDetailsProps) => {

    if (!params.id){
        return null;
    }

    const barbershop = await db.barbershop.findUnique({
        where: {
          id: params.id,
        },
        include: {
          services: true,
        },
      });

    if (!barbershop){
        // redirecionar para home
        return null;
    }

    return ( 
        <div className="">
            <BarberShopInfo barbershop={barbershop}/>
        </div>
     );
}
 
export default BarberShopDetails;
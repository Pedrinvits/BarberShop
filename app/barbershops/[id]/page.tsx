import { db } from "@/app/_lib/prisma";
import Image from "next/image";
import BarberShopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";

interface BarberShopDetailsProps {
    params : {
        id?: string;
    }
}
const  BarberShopDetails =  async({params} : BarberShopDetailsProps) => {
    const session = await getServerSession(authOptions)

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

           <div className="px-5 grid grid-cols-1 lg:grid-cols-2 gap-3 py-6">
                {barbershop.services.map((service)=>(
                    <ServiceItem key={service.id} service={service} isBookingDisable={!!session?.user} barbershop={barbershop}/>
                ))}
           </div>

        </div>
     );
}
 
export default BarberShopDetails;
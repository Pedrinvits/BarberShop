
import { redirect } from "next/navigation";
import BarbershopItem from "../(home)/_components/barbershop-item";
import Header from "../_components/header";
import { db } from "../_lib/prisma";
import Search from "../(home)/_components/search";
import { Frown } from "lucide-react";
import { format, formatDate } from "date-fns";

interface BarbershopsPageProps {
  searchParams: {
    search?: string;
    date?: number;
  };
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  if (!searchParams.search) {
    return redirect("/");
  }

  // const barbershops = await db.barbershop.findMany({
  //   where: {
  //     name: {
  //       contains: searchParams.search,
  //       // nao considera maiuscula nem minuscula
  //       mode: "insensitive",
  //     },
  //   },
  // });
  const params = {
    date : { not : format(searchParams.date as any, "yyyy-MM-dd\'T\'HH:mm:ss")+".000Z"} ,
    barbershop : {
      name : searchParams.search,
    }
  }

const barbershops = await db.booking.findMany({
  include : {
    barbershop : true,
  },
  where : params,
})

  return (
    <>
      <Header />
      <div className="px-5 py-6 flex flex-col gap-6">
        <Search defaultValues={{
          search : searchParams.search,
        }}/>
        
        {barbershops.length > 0 ? (
          <>
            <h1 className="text-gray-400 font-bold text-xs uppercase">Resultados para &quot;{searchParams.search}&quot;</h1>
            <div className="grid grid-cols-2 gap-4">
              {barbershops.map((barbershop) => (
                <div key={barbershop.id} className="w-full">
                  <BarbershopItem barbershop={barbershop} />
                </div>
              ))}
            </div> 
          </>

        ):(
          <h1 className="text-gray-400 font-bold text-sm flex gap-2">Nenhum resultado foi encontrado<Frown/></h1>
        )}
      </div>
    </>
  );
};

export default BarbershopsPage;

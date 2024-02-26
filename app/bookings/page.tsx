import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { redirect } from "next/navigation";
import Header from "../_components/header";
import { db } from "../_lib/prisma";
import BookingItem from "../_components/booking-item";

const BookingsPage = async () => {
    // precisamos verificar se o usuario esta logado ou nao
    // se nao tiver logado redirecionamos para home
    const session = await getServerSession(authOptions)
    if(!session?.user){
        redirect("/")
    }

    const [confirmedBookings, finishedBookings] = await Promise.all([
        db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: true,
            barbershop: true,
          },
        }),
        db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: {
              lt: new Date(),
            },
          },
          include: {
            service: true,
            barbershop: true,
          },
        }),
      ]);
    return ( 
        <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-xl font-bold mb-6">Agendamentos</h1>

        {confirmedBookings.length > 0 && (
          <>
            <h2 className="text-gray-400 font-bold text-sm mb-3">Confirmados</h2>

            <div className="lg:grid lg:grid-cols-2 gap-4 flex flex-col">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}

        {finishedBookings.length > 0 && (
          <>
            <h2 className="text-gray-400 font-bold text-sm mt-6 mb-3">Finalizados</h2>

            <div className="lg:grid lg:grid-cols-2 gap-4 flex flex-col">
              {finishedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
    );
}
 
export default BookingsPage;
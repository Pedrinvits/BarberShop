"use server"
import { db } from "@/app/_lib/prisma"
import { endOfDay, startOfDay } from "date-fns"

export const getDayBookings = async (date : Date , barbershopId : string) => {
    const bookings = await db.booking.findMany({
        where : {
            barbershopId,
            date : {
                // menor que o final do dia
                lte : endOfDay(date),
                // maior que o inicio do dia
                gte : startOfDay(date)
            }
        }
    })
    return bookings;
}
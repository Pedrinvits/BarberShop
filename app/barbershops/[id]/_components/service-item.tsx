"use client"
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card,CardContent } from "@/app/_components/ui/card";
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger, Sheet, SheetFooter } from "@/app/_components/ui/sheet";

import { Barbershop, Booking, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale/pt-BR";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "../_helpers/hours";
import { addDays, format, setHours, setMinutes } from "date-fns";
import { useSession } from "next-auth/react";
import { saveBooking } from "../_actions/save-booking";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { getDayBookings } from "../_actions/get-daybookigs";

interface ServiceItemProps {
    service : Service;
    isBookingDisable?: boolean;
    barbershop : Barbershop;
}
const ServiceItem = ({service,isBookingDisable,barbershop} : ServiceItemProps) => {
    
    const router = useRouter()

    const [isSubmitLoading, setSubmitLoading] = useState(false)

    const {data} = useSession()

    const [date, setDate] = useState<Date | undefined>(undefined)
    
    const [dayBookings, setDayBookings]  = useState<Booking[]>([])
  
    const timeList = useMemo(() => {
        if (!date) {
            return 
        }
        return generateDayTimeList(date).filter((time) => {
            // se houver alguma reserva no daybookins com a hora e minutos igual ao time nao vai incluir / aparecer
            const timeHour = Number(time.split(":")[0]);
            const timeMinutes = Number(time.split(":")[1]);
            // verificando se tem algum agendamento no dayBookings
            // se ele achar que ja tem hora e minuto agendado nesse dia, ele fica true e nao entra na lista
            const booking = dayBookings.find((booking) => {
              const bookingHour = booking.date.getHours();
              const bookingMinutes = booking.date.getMinutes();
      
              return bookingHour === timeHour && bookingMinutes === timeMinutes;
            });
      
            if (!booking) {
              // time incluso na lista
              return true;
            }
            return false;
          });
    },[date,dayBookings])

    const [hour,setHour] = useState<string | undefined>()

    const [sheetIsOpen, setSheetIsOpen] = useState(false)

    const handleHourClick = (time : string) => {
        setHour(time)
    }
    
    // limpa os horarios selecionados se mudar o dia no calendario
    const handleDateClick = (date : Date | undefined) => {
            setDate(date)
            setHour(undefined)
    }
    useEffect(()=>{

        if(!date){
            return
        }

        const refreshAvailableHours = async () => {
            const _dayBookings = await getDayBookings(date, barbershop.id);
            setDayBookings(_dayBookings);
          };
        
          refreshAvailableHours()
    },[date, barbershop.id])
    
    
    const handleBookingSubmit = async () => {

        setSubmitLoading(true)

        try {
            if (!hour || !date || !data?.user) {
                return
            }
            // juntando data e hora para salvar no banco
            const dateHour = Number(hour.split(":")[0]);
            const dateMinutes = Number(hour.split(":")[1]);

            const newDate = setMinutes(setHours(date, dateHour), dateMinutes);
      
            
            await saveBooking({
                serviceId: service.id,
                barberShopID: barbershop.id,
                date: newDate,
                userId: (data.user as any).id,
            })

            setSheetIsOpen(false)
            setHour(undefined)
            setDate(undefined)

            toast("Reserva realizada com sucesso!", {
                description: format(newDate, "'Para' dd 'de' MMMM 'às' HH':'mm'.'",{
                    locale : ptBR,
                }),
                action: {
                  label: "Visualizar",
                  onClick: () => router.push("/bookings"),
                },
              })
        }
        catch (error){
            console.log(error);
        }finally{
            setSubmitLoading(false)
        }
    }
    return ( 
            <Card>
                <CardContent className="p-3 w-full">
                        <div className="flex gap-4 items-center w-full">
                            <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
                                <Image 
                                src={service.imageUrl} 
                                fill 
                                style={{
                                    objectFit: "contain",
                                }} 
                                alt={service.description}
                                className="rounded-lg"
                                />
                            </div>
                        
                            <div className="flex flex-col w-full">
                                <h2 className="font-bold">{service.name}</h2>
                                <p className="text-sm text-gray-400">{service.description}</p>

                                <div className="flex items-center justify-between mt-3">
                                <p className="text-primary font-bold text-sm">
                                    {
                                        Intl.NumberFormat("pt-BR",{
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(Number(service.price))
                                    }
                                </p>
                                   {isBookingDisable ? (
                                        <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                                        <SheetTrigger asChild>
                                            <Button variant={"secondary"} >Reservar</Button>
                                        </SheetTrigger>
                                        <SheetContent className="p-0">
                                            <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
                                                <SheetTitle>Fazer Reserva</SheetTitle>
                                            </SheetHeader>
                                                <div className="py-6">
                                                    <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={handleDateClick}
                                                    locale={ptBR}
                                                    // nao deixa escolher data menor que atual
                                                    fromDate={addDays(new Date(),1)}
                                                   
                                                    styles={{
                                                        head_cell : {
                                                            width : "100%",
                                                            textTransform : "capitalize"
                                                        },
                                                        cell : {
                                                            width : "100%",
                                                        },
                                                        button : {
                                                            width : "100%",
                                                        },
                                                        nav_button_previous : {
                                                            width : "32px",
                                                            height : "32px",
                                                        },
                                                        nav_button_next: {
                                                            width : "32px",
                                                            height : "32px",
                                                        },
                                                        caption : {
                                                            textTransform : "capitalize"
                                                        }
                                                    }}
                                                />
                                                </div>
                                            {date && (
                                                <div className="py-6 px-5 border-t border-solid border-secondary flex overflow-x-auto [&::-webkit-scrollbar]:hidden gap-3">
                                                        {
                                                            timeList?.map((time)=>(
                                                                <Button 
                                                                key={time} 
                                                                variant={
                                                                    hour === time ? 'default' : 'outline'
                                                                }
                                                                className="rounded-full" 
                                                                onClick={()=>handleHourClick(time)}
                                                                >{time}</Button>
                                                            ))
                                                        }
                                                </div>  
                                            )}
                                            <div className="py-6 px-5 border-t border-solid border-secondary">
                                                <Card>
                                                    <CardContent className="p-3 flex flex-col gap-3">
                                                        <div className="flex justify-between">
                                                            <h2 className="font-bold">{service.name}</h2>
                                                            <h3 className="font-bold text-sm">
                                                                {
                                                                    Intl.NumberFormat("pt-BR",{
                                                                        style: "currency",
                                                                        currency: "BRL",
                                                                    }).format(Number(service.price))
                                                               }
                                                            </h3>
                                                        </div>
                                                        {date && (
                                                            <div className="flex justify-between">
                                                                    <h3 className="text-gray-400 text-sm">Data</h3>
                                                                    <h4 className="text-sm">{format(date, "dd 'de' MMMM",{
                                                                        locale: ptBR,
                                                                    })}</h4>
                                                            </div>
                                                        )}
                                                        {hour && (
                                                            <div className="flex justify-between">
                                                                    <h3 className="text-gray-400 text-sm">Horário</h3>
                                                                    <h4 className="text-sm">{hour}</h4>
                                                            </div>
                                                        )}
                                                         <div className="flex justify-between">
                                                                <h3 className="text-gray-400 text-sm">Baberaria</h3>
                                                                <h4 className="text-sm">{barbershop.name}</h4>
                                                            </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                            <SheetFooter className="px-5">
                                                <Button disabled={!hour || !date || isSubmitLoading} onClick={handleBookingSubmit}>
                                                    {isSubmitLoading && (
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    )}
                                                    Confirmar Reserva
                                                </Button>
                                            </SheetFooter>
                                        </SheetContent>
                                    </Sheet>

                                    ):(
                                        <Button variant={"secondary"} disabled>Reservar</Button>
                                    )
                                   }
                                </div>
                            </div>
                        </div>
                </CardContent>
            </Card>
     );
}
 
export default ServiceItem;
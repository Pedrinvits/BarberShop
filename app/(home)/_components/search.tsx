"use client"
import { Button } from "@/app/_components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { CalendarIcon, SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"

import { z } from "zod"
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/_components/ui/popover";
import { cn } from "@/app/_lib/utils";
import { addDays, format } from "date-fns";
import { Calendar } from "@/app/_components/ui/calendar";
import { ptBR } from "date-fns/locale/pt-BR";
 interface SearchProps {
    defaultValues ?: z.infer<typeof formSchema>
 }
const formSchema = z.object({
  search : z
  .string({
    required_error : "Campo Obrigatório",
  })
  .trim()
  .min(1,"Campo Obrigatório"),
  date: z.coerce.date({
    required_error: "Coloque uma data",
  }).optional(),
})
const Search = ({defaultValues}:SearchProps) => {

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues,
    })

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        if(data.date){
            router.push(`/barbershops?search=${data.search}&date=${data.date}`)
        }else{
            router.push(`/barbershops?search=${data.search}`)
        }
    }
    return ( 
        <div className="flex items-center gap-2">
            <Form {...form}>
                <form className="flex gap-4 w-full flex-col lg:flex-row " onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                            <FormItem className="w-full">
                           
                            <FormControl>
                                <Input placeholder="Busque uma barbearia" {...field}/>
                            </FormControl>
                            
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal lg:w-[240px]",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Escolha uma data</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        locale={ptBR}
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        fromDate={addDays(new Date(),1)}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <Button variant={'default'} size={'icon'} type="submit" className="w-full lg:w-fit lg:p-4">
                        <SearchIcon size={20}/>
                    </Button>
                </form>
            </Form>
        </div>
     );
}
 
export default Search;
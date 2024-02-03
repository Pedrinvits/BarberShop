import { ptBR } from "date-fns/locale";
import Header from "../_components/header";
import {format} from  "date-fns"
export default function Home (){
    return (
        <>
            <Header/>
            <div className="px-5 pt-5">
                <h1 className="text-xl font-bold">Olá Pedro</h1>
                <p className="capitalize text-sm">{format(new Date(), "EEEE ',' dd 'de' MMMM", {locale : ptBR})}</p>
            </div>
        </>
    )
}
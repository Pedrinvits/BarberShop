"use client"
import { ChevronLeftIcon, Frown, HomeIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
    const router = useRouter();

    const handleBackCLick = () => {
        router.replace("/");
    }
  return (
    <section className="mx-auto w-fit flex items-center py-8 container gap-10 mt-8 rounded-lg lg:w-1/3 flex-col">
            <Button onClick={handleBackCLick} size="icon" variant="outline" className="z-50 absolute top-4 left-4">
                <ChevronLeftIcon />
            </Button>
            <div className="flex items-center justify-center border-primary border-2 rounded-sm p-2 gap-4 ">
                <Frown/> 
                <h1 className='text-xl font-bold lg:text-2xl flex items-center'>Página não encontrada!</h1>
            </div>
        </section>
  );
};

export default NotFoundPage;
import { redirect } from "next/navigation";
import NotFoundPage from "../_components/notFoundPage";

export default async function NotFound() {
   
    return (
      <>
        <NotFoundPage/>
      </>
    )
}
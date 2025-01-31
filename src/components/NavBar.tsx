import { TurboIcon } from "./Icons/TurboIcon";
import Container from "@/components/Container";

export default function NavBar() {
    return (
        <Container color="bg-white" className="py-1 font-jura flex align-middle">
            <div className="flex items-center">
                <TurboIcon height={70} width={120} className=" text-turbo-red" />
                <span className=" font-jura text-2xl ml-1">Explorer</span>
            </div>
        </Container>
    )
}
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function BaseLayout() {
    return (
        <div className="mx-auto">
           
                <Navbar />
                <div className="items-center mx-auto">

                <Outlet />
                </div>

        </div>
    )
}
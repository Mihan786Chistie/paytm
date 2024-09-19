import { useState } from "react";
import Logout from "./Logout";

export const AppBar = ({ user }) => {
    const [drop, setDrop] = useState(false);

    const handleClick = () => {
        setDrop(!drop);
    };

    return (
        <div className="shadow h-14 flex justify-between">
            <div className="flex flex-col justify-center h-full ml-4 font-black text-3xl">
                PayTM
            </div>
            <div className="flex relative">
                <button
                    className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2"
                    onClick={handleClick}
                >
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user[0]}
                    </div>
                </button>

                {drop && (
                    <div className="absolute right-0 mt-14 w-32 bg-white rounded-lg shadow-lg">
                        <Logout />
                    </div>
                )}
            </div>
        </div>
    );
};

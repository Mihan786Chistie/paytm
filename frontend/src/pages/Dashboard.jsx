import { useEffect, useState } from "react";
import { AppBar } from "../components/AppBar";
import Balance from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";
import Transactions from "../components/Transactions";

export const Dashboard = () => {
    const [user, setUser] = useState("U");
    const [balance, setBalance] = useState("0");

    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/user/me", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => setUser(response.data.user.firstName));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/account/balance", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => setBalance(response.data.balance));
    }, []);

    return (
        <div className="bg-gradient-to-r from-violet-300 via-violet-200 to-violet-100 min-h-screen flex flex-col">
            <AppBar user={user} />
            <div className="m-5 text-3xl font-medium">
                Hello, {user}
            </div>
            <Balance value={balance} />

            <div className="flex flex-row justify-between m-5 space-x-4 flex-grow">
               
                <div className="bg-slate-50 rounded-lg p-5 w-1/2 overflow-auto">
                    <Users />
                </div>

                <div className="bg-slate-50 rounded-lg p-5 w-1/2 overflow-auto">
                    <div className="font-bold text-lg mb-4">
                        Your Transactions
                    </div>
                    <Transactions />
                </div>
            </div>
        </div>
    );
};

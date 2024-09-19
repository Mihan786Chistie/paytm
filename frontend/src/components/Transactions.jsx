import axios from "axios";
import { useEffect, useState } from "react";
import TransactionsChart from "./TransactionsChart";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/user/me", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => setTransactions(response.data.user.transactions))
            .catch(error => console.error("Error fetching transactions:", error));
    }, []);

    useEffect(() => {
        if (transactions.length > 0) {
            const fetchUserDetails = async () => {
                const userMap = {};
                await Promise.all(
                    transactions.map(async (transaction) => {
                        if (!userDetails[transaction.to]) {
                            try {
                                const response = await axios.get(`http://localhost:3000/api/v1/user/${transaction.to}`);
                                userMap[transaction.to] = response.data.user;
                            } catch (error) {
                                console.error(`Error fetching user for ${transaction.to}:`, error);
                            }
                        }
                    })
                );
                setUserDetails((prevDetails) => ({ ...prevDetails, ...userMap }));
            };
            fetchUserDetails();
        }
    }, [transactions]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-GB', options);
    };

    return (

        <>
        <TransactionsChart transactions={transactions} />
        <div className="flex flex-col p-5 w-full m-15">
            {transactions.map((transaction, index) => (
                <div key={index} className="flex justify-between mb-2 bg-slate-100 p-4 rounded-lg h-auto items-center">
                    <div>
                        {userDetails[transaction.to] ? (
                            <>
                                {userDetails[transaction.to].firstName} {userDetails[transaction.to].lastName}
                                <div className="text-sm">
                                    {formatDate(transaction.timestamp)}
                                </div>
                            </>
                        ) : (
                            "Loading..."
                        )}
                    </div>
                    <div>
                        {transaction.sign === "+" ? (
                            <span className="text-green-500">{transaction.sign} ₹ {transaction.amount}</span>
                        ) : (
                            <span className="text-red-500">{transaction.sign} ₹ {transaction.amount}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
        </>
        
    );
}

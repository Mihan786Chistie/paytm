import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TransactionsChart({ transactions }) {
    
    const formattedData = transactions.map((transaction, index) => ({
        name: `Transaction ${index + 1}`,
        amount: transaction.sign === '+' ? transaction.amount : -transaction.amount,
        date: new Date(transaction.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    }));

    return (
        <div className="w-full h-64 p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-center text-xl font-bold mb-4">Transaction History</h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

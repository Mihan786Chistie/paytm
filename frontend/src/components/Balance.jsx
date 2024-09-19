export default function Balance({value}) {
   return <div className="flex flex-col p-5 bg-slate-100 w-1/4 m-5 rounded-lg h-1/5 justify-evenly">
        <div className="font-bold text-lg">
            Your Balance
        </div>
        <div className="font-medium text-3xl">₹ {value}</div>
    </div>
}
import { useNavigate } from "react-router-dom";

 export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <button
            className="block w-full text-left px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-200"
            onClick={handleLogout}
        >
            Logout
        </button>
    );
}

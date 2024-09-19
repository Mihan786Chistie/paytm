import { useNavigate } from "react-router-dom"
import BottomWarning from "../components/BottomWarning"
import Button from "../components/Button"
import Heading from "../components/Heading"
import InputBox from "../components/InputBox"
import SubHeading  from "../components/SubHeading"
import { useState } from "react"
import axios from "axios"

export const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
    return <div className="bg-gradient-to-r from-violet-300 via-violet-200 to-violet-100 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-2xl bg-white w-96 text-center p-8 h-max px-4 shadow-lg">
        <Heading label={"Welcome Back"} />
        <SubHeading label={"Sign in to your existing account"} />
        <InputBox placeholder="johndoe@gmail.com" label={"Email"} type={"text"} onChange={(e) => {
          setUsername(e.target.value);
        }}/>
        <InputBox placeholder="123456" label={"Password"} type={"password"} onChange={(e) => {
          setPassword(e.target.value);
        }}/>
        <div className="pt-4">
          <Button label={"Continue with email"} onClick={async () => {
            const response = await axios.post("http://localhost:3000/api/v1/user/login", {
              username,
              password
            });
            localStorage.setItem("token", response.data.token);
            navigate("/");
          }} />
        </div>
        <BottomWarning label={"Don't have an account?"} linkLabel={"Sign up"} link={"/signup"} />
      </div>
    </div>
  </div>
}
import axios from "axios";
import BottomWarning from "../components/BottomWarning";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-r from-violet-300 via-violet-200 to-violet-100 h-screen flex justify-center items-center">
      <div className="flex flex-row justify-center items-center">
        
        <div className="bg-white rounded-2xl w-96 p-8 shadow-lg">
          <Heading label="Create your account" />
          <SubHeading label="Sign up to get started" />

          <InputBox label={"First Name"} placeholder="John" onChange={(e) => {
            setFirstName(e.target.value);
          }} />
          <InputBox label={"Last Name"} placeholder="Doe" onChange={(e) => {
            setLastName(e.target.value);
          }}/>
          <InputBox label={"Email"} placeholder="johndoe@gmail.com" type={"text"} onChange={(e) => {
            setUsername(e.target.value);
          }} />
          <InputBox label={"Password"} placeholder="123456" type={"password"} onChange={(e) => {
            setPassword(e.target.value);
          }}/>

          <div className="pt-4">
            <Button label="Continue with email" onClick={async() => {
              const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                username,
                firstName,
                lastName,
                password
              });

              localStorage.setItem("token", response.data.token);
              navigate("/");
            }}/>
          </div>

          <BottomWarning label="Already have an account?" link="/login" linkLabel="Login Here" />
        </div>

        <div className="ml-10">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-80">
            <h2 className="text-2xl font-semibold">💵Instant Balance Check & Secure Money Transfers</h2>
            <p className="text-gray-500 text-sm">Easily check your account balance in real-time with just one tap. Send money to anyone securely and instantly with our encrypted transfer system.</p>
            
          </div>
          <div className="bg-white rounded-2xl p-6 mt-4 shadow-lg w-80">
            <p className="text-lg text-purple-500">&quot;PayTM is surprisingly handy for keeping all my money in one place.&quot;</p>
            <p className="text-sm text-gray-500 mt-2">~ John Doe, E-commerce Specialist</p>
          </div>
        </div>

      </div>
    </div>
  );
};

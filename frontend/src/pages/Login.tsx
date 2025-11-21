import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../config/supabase";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const token = data.session?.access_token;
    if (token) setAccessToken(token);

    navigate("/links");
  }

  return (
    <div className="w-screen flex items-center justify-center" >

    <div className="min-h-screen flex w-[500px] items-center justify-center bg-gray-500 px-4">
      <Card className="w-[350px] mx-auto px-6 flex flex-col justify-center " style={{padding: "60px", backgroundColor: "#88397b1f"}}>
        <CardHeader className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Welcome Back!</h2>
        </CardHeader>
        <CardContent style={{width: "300px"}}>
          <form onSubmit={handleLogin} className="space-y-4 px-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: ".8rem", color: "black", fontSize: "16px" }}
              />
            </div><br/>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full ml-6" style={{padding: ".8rem", color: "black", fontSize: "16px"}}
              /><br/>
            </div>
            
            <Button type="submit" className="w-full" style={{width: "330px"}}>Sign in</Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-gray-500 w-full">
            Don't have an account? <Link to="/signup" className="text-gray-900 font-medium">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
    </div>
  );
}

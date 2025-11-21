import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const envBase = (import.meta.env as any).VITE_API_URL ?? "";
      const url = `${envBase}/auth/signup`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        const detail = body?.detail || body?.error || res.statusText;
        alert(`Signup failed: ${detail}`);
        setLoading(false);
        return;
      }

      alert("Signup successful — please log in.");
    } catch (err: any) {
      alert(`Signup error: ${err?.message ?? String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen flex items-center justify-center">
      <div className="min-h-screen flex w-[500px] items-center justify-center bg-gray-500 px-4">
        <Card
          className="w-[350px] mx-auto px-6 flex flex-col justify-center"
          style={{ padding: "60px", backgroundColor: "#88397b1f" }}
        >
          <CardHeader className="text-center">
            <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
          </CardHeader>
          <CardContent style={{ width: "300px" }}>
            <form onSubmit={handleSignup} className="space-y-4 px-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    padding: ".8rem",
                    color: "black",
                    fontSize: "16px",
                  }}
                />
              </div>
              <br />
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    padding: ".8rem",
                    color: "black",
                    fontSize: "16px",
                  }}
                />
              </div>
              <br />
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                style={{ width: "330px" }}
              >
                {loading ? "Signing up..." : "Sign up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-gray-500 w-full">
              Already have an account?{" "}
              <Link to="/" className="text-gray-900 font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

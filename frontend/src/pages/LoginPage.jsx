import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, MessageCircle, ArrowRight, Zap, Shield, ImageIcon, Smile } from "lucide-react";

const features = [
  { icon: <Zap className="w-4 h-4" />, title: "Real-time", desc: "Typing indicators & instant delivery" },
  { icon: <Shield className="w-4 h-4" />, title: "Secure", desc: "JWT auth with bcrypt hashing" },
  { icon: <ImageIcon className="w-4 h-4" />, title: "Media", desc: "Share images via Cloudinary" },
  { icon: <Smile className="w-4 h-4" />, title: "Emoji", desc: "Full emoji picker built-in" },
];

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loginUser, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(formData);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-background bg-grid">
      {/* Left — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm animate-slide-up">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg animate-float">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome <span className="text-gradient">back</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to continue your conversations</p>
          </div>

          <Card className="glass-card border-0 shadow-2xl">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-9"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full mt-2" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground pt-1">
                  Don't have an account?{" "}
                  <NavLink to="/signup" className="text-primary hover:underline font-medium">
                    Create one
                  </NavLink>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right — Feature Cards */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-10">
        <div className="max-w-xs w-full space-y-3 stagger">
          {features.map((f, i) => (
            <Card key={i} className="glass-card border-0 hover-lift">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-muted-foreground text-xs">{f.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

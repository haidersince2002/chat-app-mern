import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, MessageCircle, ArrowRight, Check, X } from "lucide-react";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signupUser, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signupUser(formData);
  };

  const pw = formData.password;
  const checks = [
    { label: "At least 6 characters", pass: pw.length >= 6 },
    { label: "Contains uppercase letter", pass: /[A-Z]/.test(pw) },
    { label: "Contains a number", pass: /[0-9]/.test(pw) },
  ];
  const strength = checks.filter((c) => c.pass).length;
  const strengthColor = ["bg-destructive", "bg-destructive", "bg-amber-400", "bg-emerald-500"][strength];

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
              Create <span className="text-gradient">account</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Join ChatConnect and start chatting</p>
          </div>

          <Card className="glass-card border-0 shadow-2xl">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      className="pl-9"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

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

                  {/* Strength meter */}
                  {pw.length > 0 && (
                    <div className="space-y-2 animate-fade-in">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((n) => (
                          <div
                            key={n}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              strength >= n ? strengthColor : "bg-border"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="space-y-1">
                        {checks.map((c, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            {c.pass
                              ? <Check className="w-3 h-3 text-emerald-500" />
                              : <X className="w-3 h-3 text-muted-foreground" />
                            }
                            <span className={c.pass ? "text-emerald-500" : "text-muted-foreground"}>
                              {c.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full mt-2" disabled={isSigningUp}>
                  {isSigningUp ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground pt-1">
                  Already have an account?{" "}
                  <NavLink to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </NavLink>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right — Chat Preview */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-10">
        <div className="w-full max-w-xs animate-fade-in">
          <Card className="glass-card border-0 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">ChatConnect</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-xs text-emerald-500">Online</span>
                </div>
              </div>
            </div>
            {/* Messages */}
            <div className="p-4 space-y-2.5">
              <div className="bubble-received px-3 py-2 text-xs max-w-[80%]">
                Hey! Welcome to ChatConnect 👋
              </div>
              <div className="bubble-sent px-3 py-2 text-xs max-w-[80%] ml-auto">
                This looks amazing! 🔥
              </div>
              <div className="bubble-received px-3 py-2 text-xs max-w-[80%]">
                Real-time with read receipts ✓✓
              </div>
              <div className="bubble-sent px-3 py-2 text-xs max-w-[80%] ml-auto">
                Let's get started! 🚀
              </div>
              {/* Typing indicator */}
              <div className="bubble-received px-3 py-2.5 flex items-center gap-1 w-fit">
                <span className="typing-dot text-muted-foreground" />
                <span className="typing-dot text-muted-foreground" />
                <span className="typing-dot text-muted-foreground" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

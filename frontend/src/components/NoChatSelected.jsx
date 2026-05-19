import { MessageCircle, Zap, Shield, ImageIcon, Smile } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: <Zap className="w-4 h-4" />, title: "Real-time Chat", desc: "Typing indicators & instant delivery", color: "text-amber-500 bg-amber-500/10" },
  { icon: <Shield className="w-4 h-4" />, title: "Secure", desc: "JWT auth with bcrypt encryption", color: "text-emerald-500 bg-emerald-500/10" },
  { icon: <ImageIcon className="w-4 h-4" />, title: "Media Sharing", desc: "Send images via Cloudinary", color: "text-cyan-500 bg-cyan-500/10" },
  { icon: <Smile className="w-4 h-4" />, title: "Emoji Picker", desc: "Express yourself fully", color: "text-pink-500 bg-pink-500/10" },
];

const NoChatSelected = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background bg-grid">
    <div className="max-w-sm w-full text-center space-y-8 animate-slide-up">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center shadow-xl animate-float">
          <MessageCircle className="w-8 h-8 text-primary-foreground" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight mb-2">
          Welcome to <span className="text-gradient">ChatConnect</span>
        </h2>
        <p className="text-muted-foreground text-sm">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-2 gap-3">
        {features.map((f, i) => (
          <Card key={i} className="glass-card border-0 hover-lift text-left">
            <CardContent className="p-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${f.color}`}>
                {f.icon}
              </div>
              <p className="font-semibold text-xs mb-1">{f.title}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default NoChatSelected;

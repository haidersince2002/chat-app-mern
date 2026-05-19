import { useThemeStore } from "../store/useThemeStore.js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
  {
    id: "dark",
    label: "Dark",
    icon: <Moon className="w-5 h-5" />,
    desc: "Easy on the eyes",
    bg: "bg-zinc-900",
    fg: "text-white",
    bar: "bg-white/10",
    dot: "bg-violet-400",
  },
  {
    id: "light",
    label: "Light",
    icon: <Sun className="w-5 h-5" />,
    desc: "Classic bright mode",
    bg: "bg-white",
    fg: "text-zinc-900",
    bar: "bg-black/10",
    dot: "bg-violet-500",
  },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background bg-grid p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-gradient">Settings</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Customize your experience</p>
        </div>

        {/* Theme */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Appearance</CardTitle>
            <CardDescription>Choose your preferred theme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.map((t) => {
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all duration-200 hover-lift",
                      active
                        ? "border-primary bg-primary/8"
                        : "border-border hover:border-border/80 bg-muted/30"
                    )}
                  >
                    {/* Icon + label */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center border border-border", t.bg, t.fg)}>
                        {t.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.label}</p>
                        <p className="text-muted-foreground text-xs">{t.desc}</p>
                      </div>
                    </div>
                    {/* Mini preview */}
                    <div className={cn("h-7 rounded-lg border border-border flex items-center px-2.5 gap-2", t.bg)}>
                      <div className={cn("w-2 h-2 rounded-full", t.dot)} />
                      <div className={cn("h-1.5 rounded-full flex-1", t.bar)} />
                      <div className={cn("h-1.5 w-5 rounded-full", t.bar)} />
                    </div>
                    {active && (
                      <p className="mt-2 text-xs text-primary font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /> Active
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { label: "Version", value: "2.0.0" },
              { label: "Stack", value: "MERN + Socket.io + shadcn/ui" },
              { label: "Developer", value: "Haider Ali" },
            ].map((row, i, arr) => (
              <div key={row.label}>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </div>
                {i < arr.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;

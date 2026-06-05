import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { BarChart3, Sparkles, Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[20%] w-[70%] h-[60%] rounded-full bg-blue-500/6 blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[15%] w-[60%] h-[50%] rounded-full bg-violet-500/6 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/25 mb-2">
            <BarChart3 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">DataVision AI</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to start analyzing your data
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6 space-y-4">
          <GoogleLoginButton />

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border/60" />
            <span>Secure sign-in</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          {/* Feature highlights */}
          <div className="space-y-2.5">
            {[
              { icon: BarChart3, text: "Interactive AI-powered charts" },
              { icon: Sparkles, text: "Natural language data queries" },
              { icon: Shield, text: "Your data stays private" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <div className="h-5 w-5 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Icon className="h-3 w-3 text-blue-500" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          By signing in you agree to our{" "}
          <a href="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">Terms</a>
          {" "}and{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

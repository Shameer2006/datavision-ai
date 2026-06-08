import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { BarChart3, Sparkles, Shield, LineChart } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Column - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-950 text-white p-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]" />
        </div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">DataVision AI</span>
          </Link>
        </div>

        {/* Middle: Value Prop / Graphics */}
        <div className="relative z-10 flex flex-col gap-6 max-w-lg mt-12">
          <h2 className="text-4xl sm:text-5xl font-medium tracking-tight leading-[1.1]">
            Turn your raw data into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">actionable insights</span>.
          </h2>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Upload your datasets and let our AI handle the complex analysis. Generate beautiful, interactive visualizations in seconds with just natural language.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-violet-400" />
              AI-Powered Analysis
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium backdrop-blur-md">
              <LineChart className="h-4 w-4 text-blue-400" />
              Real-time Charts
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium backdrop-blur-md">
              <Shield className="h-4 w-4 text-emerald-400" />
              Enterprise Security
            </div>
          </div>
        </div>

        {/* Bottom: Testimonial or Footer */}
        <div className="relative z-10 mt-auto pt-12">
          <blockquote className="space-y-4">
            <p className="text-lg font-medium text-zinc-300">
              &quot;DataVision completely transformed how our team interprets weekly metrics. The AI-generated dashboards save us hours of manual work.&quot;
            </p>
            <footer className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <span className="text-sm font-medium">HK</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Harini K</span>
                <span className="text-xs text-zinc-500">Director of Data, TechCorp</span>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-12 relative overflow-hidden">
        {/* Mobile background blobs */}
        <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[20%] w-[70%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute -bottom-[20%] -right-[15%] w-[60%] h-[50%] rounded-full bg-violet-500/10 blur-[120px]" />
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8 z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shadow-sm">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">DataVision AI</span>
          </Link>
        </div>

        <div className="w-full max-w-sm mx-auto space-y-8 relative z-10">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <div className="space-y-6">
            <GoogleLoginButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-medium">
                  Secure & Encrypted
                </span>
              </div>
            </div>

            <div className="space-y-4 p-5 rounded-2xl border border-border/40 bg-muted/30 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Shield className="h-4 w-4 text-blue-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Privacy First</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your data is encrypted at rest and in transit. We never use your private datasets to train our models.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center lg:text-left text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

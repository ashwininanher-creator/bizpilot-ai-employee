import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Mail, Lock, User, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — BizPilot AI" },
      { name: "description", content: "Sign in or create your BizPilot AI account to meet your first AI employee." },
    ],
  }),
  component: AuthPage,
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Password is required").max(72),
});
const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your name").max(100),
    email: z.string().trim().email("Enter a valid business email").max(255),
    password: z.string().min(8, "At least 8 characters").max(72),
    confirm: z.string(),
    terms: z.boolean().refine((v) => v, "Please accept Terms & Privacy"),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords don't match" });

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup">("login");

  // If already signed in, route them.
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) await routeAfterAuth(navigate);
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground bg-grid">
      <div className="grid lg:grid-cols-2 min-h-screen">
        <BrandPanel />
        <div className="flex items-center justify-center px-5 sm:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <div className="glass rounded-2xl border border-border/60 shadow-elegant p-6 sm:p-8">
              <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>
                <TabsContent value="signup">
                  <SignupForm onDone={() => setTab("login")} />
                </TabsContent>
              </Tabs>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-6">
              By continuing, you agree to BizPilot AI's Terms and Privacy Policy.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function BrandPanel() {
  const features = [
    "Track Sales",
    "Manage Inventory",
    "Create Bills",
    "AI Business Insights",
    "Customer Management",
  ];
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-border/60">
      <div className="absolute inset-0 bg-gradient-primary opacity-10 pointer-events-none" />
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <Link to="/" className="relative flex items-center gap-2 group">
        <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-primary shadow-glow">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </span>
        <span className="font-display text-lg font-semibold tracking-tight">
          BizPilot <span className="text-gradient">AI</span>
        </span>
      </Link>

      <div className="relative max-w-md">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl font-semibold tracking-tight leading-[1.05]"
        >
          Welcome <span className="text-gradient">back</span>.
        </motion.h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your AI Employee is ready to help run your business.
        </p>

        <ul className="mt-8 space-y-3">
          {features.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="flex items-center gap-3 text-sm"
            >
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-foreground/90">{f}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-muted-foreground">
        © {new Date().getFullYear()} BizPilot AI — Your First AI Employee.
      </p>
    </div>
  );
}

function GoogleButton({ label }: { label: string }) {
  const [loading, setLoading] = useState(false);
  const handle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (result.error) {
      setLoading(false);
      toast.error("Google sign-in failed", { description: result.error.message });
      return;
    }
    if (result.redirected) return;
    // Tokens were returned and session is set
    await routeAfterAuth();
  };
  return (
    <Button
      type="button"
      variant="outline"
      onClick={handle}
      disabled={loading}
      className="w-full h-11 font-medium"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <GoogleLogo />
      )}
      <span>{label}</span>
    </Button>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.5-1.7 4.3-5.5 4.3-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.7 14.6 2.8 12 2.8 6.9 2.8 2.8 6.9 2.8 12s4.1 9.2 9.2 9.2c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1-.2-1.5H12z"/>
      <path fill="#34A853" d="M3.6 7.3l3.2 2.3C7.7 7.7 9.7 6.3 12 6.3c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.7 14.6 2.8 12 2.8 8.3 2.8 5.1 4.6 3.6 7.3z" opacity="0"/>
    </svg>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      const msg = /Invalid login/i.test(error.message)
        ? "Email or password is incorrect."
        : error.message;
      toast.error("Login failed", { description: msg });
      return;
    }
    toast.success("Login successful");
    await routeAfterAuth(navigate);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">Sign in to BizPilot</h2>
        <p className="text-sm text-muted-foreground mt-1">Welcome back. Let's get to work.</p>
      </div>

      <GoogleButton label="Continue with Google" />

      <Divider />

      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" icon={<Mail className="h-4 w-4" />} error={errors.email}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@business.com"
            autoComplete="email"
            className="pl-9 h-11"
          />
        </Field>
        <Field label="Password" icon={<Lock className="h-4 w-4" />} error={errors.password}>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="pl-9 h-11"
          />
        </Field>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-gradient-primary text-primary-foreground hover:opacity-95 shadow-elegant font-medium"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Login <ArrowRight className="h-4 w-4" /></>}
        </Button>
      </form>
    </div>
  );
}

function SignupForm({ onDone }: { onDone: () => void }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = signupSchema.safeParse({ fullName, email, password, confirm, terms });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error("Signup failed", { description: error.message });
      return;
    }
    if (!data.session) {
      toast.success("Check your email to confirm your account.");
      onDone();
      return;
    }
    toast.success("Account created");
    await routeAfterAuth(navigate);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">Create your account</h2>
        <p className="text-sm text-muted-foreground mt-1">Start your business journey with AI.</p>
      </div>

      <GoogleButton label="Continue with Google" />

      <Divider />

      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name" icon={<User className="h-4 w-4" />} error={errors.fullName}>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Priya Sharma"
            autoComplete="name"
            className="pl-9 h-11"
          />
        </Field>
        <Field label="Business email" icon={<Mail className="h-4 w-4" />} error={errors.email}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@business.com"
            autoComplete="email"
            className="pl-9 h-11"
          />
        </Field>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Password" icon={<Lock className="h-4 w-4" />} error={errors.password}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 chars"
              autoComplete="new-password"
              className="pl-9 h-11"
            />
          </Field>
          <Field label="Confirm" icon={<Lock className="h-4 w-4" />} error={errors.confirm}>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
              className="pl-9 h-11"
            />
          </Field>
        </div>

        <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
          <Checkbox checked={terms} onCheckedChange={(v) => setTerms(!!v)} className="mt-0.5" />
          <span>
            I agree to the <span className="text-foreground underline">Terms</span> and{" "}
            <span className="text-foreground underline">Privacy Policy</span>.
          </span>
        </label>
        {errors.terms && <p className="text-xs text-destructive -mt-2">{errors.terms}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-gradient-primary text-primary-foreground hover:opacity-95 shadow-elegant font-medium"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="h-4 w-4" /></>}
        </Button>
      </form>
    </div>
  );
}

function Field({
  label, icon, error, children,
}: { label: string; icon: React.ReactNode; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-foreground/80">{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        {children}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Divider() {
  return (
    <div className="relative flex items-center">
      <div className="flex-1 border-t border-border/60" />
      <span className="px-3 text-[11px] uppercase tracking-wider text-muted-foreground">or</span>
      <div className="flex-1 border-t border-border/60" />
    </div>
  );
}

async function routeAfterAuth(navigate?: ReturnType<typeof useNavigate>) {
  const go = (to: string) => {
    if (navigate) navigate({ to });
    else window.location.replace(to);
  };
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return go("/auth");
  const { data: biz } = await supabase
    .from("businesses")
    .select("is_onboarding_completed")
    .eq("owner_id", u.user.id)
    .maybeSingle();
  if (biz?.is_onboarding_completed) go("/dashboard");
  else go("/business-setup");
}

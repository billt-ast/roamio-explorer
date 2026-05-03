import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Roamio" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { display_name: name } },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to verify.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        navigate({ to: "/" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
        <h1 className="text-4xl font-medium">{mode === "signup" ? "Create account" : "Welcome back"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to save itineraries and access admin tools.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === "signup" && (
            <input className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm" placeholder="Display name" value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <input type="email" required className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" required minLength={6} className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft disabled:opacity-60">
            {loading ? "..." : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <button className="mt-6 text-sm text-muted-foreground underline" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>
          {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>

        <Link to="/" className="mt-8 text-xs text-muted-foreground">← Back home</Link>
      </main>
    </div>
  );
}

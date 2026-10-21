/**
 * LoginPage — Accessible login form with React Hook Form + Zod validation,
 * silent-refresh aware, and premium dark glassmorphism design.
 */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Code2, Mail, Lock, Loader2, LogIn, Flame } from "lucide-react";
import { authApiService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";

/* ---------- Zod schema ---------- */
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

/* ---------- Component ---------- */
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTokens, accessToken } = useAuthStore();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  // Redirect if already logged in
  useEffect(() => {
    if (accessToken) navigate(from, { replace: true });
  }, [accessToken, from, navigate]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await authApiService.login(data);
      setTokens(result.accessToken, result.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError("root", {
        message:
          err instanceof Error
            ? err.message
            : "Login failed. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[100px]" />
      </div>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 mb-8 group">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
          <Code2 className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          CodeDrill
        </span>
      </Link>

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-2xl blur-xl" />
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-slate-400 text-sm">
              Sign in to continue your practice streak
            </p>
          </div>

          {/* Streak reminder */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
            <Flame className="h-4 w-4 text-amber-400 fill-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-300 font-medium">
              Don't break your streak — sign in to keep it alive!
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {/* Root error */}
            {errors.root && (
              <div className="px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
                {errors.root.message}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="text-sm font-medium text-slate-300"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className={`w-full bg-slate-800/60 border ${
                    errors.email
                      ? "border-rose-500/70 focus:border-rose-500"
                      : "border-slate-700/60 focus:border-indigo-500/80"
                  } rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:ring-2 ${
                    errors.email
                      ? "focus:ring-rose-500/20"
                      : "focus:ring-indigo-500/20"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full bg-slate-800/60 border ${
                    errors.password
                      ? "border-rose-500/70 focus:border-rose-500"
                      : "border-slate-700/60 focus:border-indigo-500/80"
                  } rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:ring-2 ${
                    errors.password
                      ? "focus:ring-rose-500/20"
                      : "focus:ring-indigo-500/20"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

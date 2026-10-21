/**
 * RegisterPage — Accessible registration form with React Hook Form + Zod validation,
 * premium dark glassmorphism design, and real-time password strength indicator.
 */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Code2, Mail, Lock, User, Loader2, Sparkles } from "lucide-react";
import { authApiService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";

/* ---------- Zod schema ---------- */
const registerSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(2, "Display name must be at least 2 characters")
      .max(40, "Display name cannot exceed 40 characters"),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(100, "Email cannot exceed 100 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password cannot exceed 100 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

/* ---------- Password strength util ---------- */
function getPasswordStrength(pw: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-rose-500" };
  if (score <= 3) return { score, label: "Fair", color: "bg-amber-500" };
  return { score, label: "Strong", color: "bg-emerald-500" };
}

/* ---------- Component ---------- */
export function RegisterPage() {
  const navigate = useNavigate();
  const { setTokens, accessToken } = useAuthStore();

  useEffect(() => {
    if (accessToken) navigate("/", { replace: true });
  }, [accessToken, navigate]);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");
  const { score, label, color } = getPasswordStrength(password);

  const onSubmit = async (data: RegisterForm) => {
    try {
      const result = await authApiService.register({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
      });
      setTokens(result.accessToken, result.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError("root", {
        message:
          err instanceof Error
            ? err.message
            : "Registration failed. Please try again.",
      });
    }
  };

  const fieldClass = (hasError: boolean) =>
    `w-full bg-slate-800/60 border ${
      hasError
        ? "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/20"
        : "border-slate-700/60 focus:border-indigo-500/80 focus:ring-indigo-500/20"
    } rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:ring-2`;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[100px]" />
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
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-2xl blur-xl" />
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Free forever — no credit card needed
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Create your account
            </h1>
            <p className="text-slate-400 text-sm">
              Start mastering Java Collections & DSA today
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            {/* Root error */}
            {errors.root && (
              <div className="px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
                {errors.root.message}
              </div>
            )}

            {/* Display Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="register-display-name"
                className="text-sm font-medium text-slate-300"
              >
                Display name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="register-display-name"
                  type="text"
                  autoComplete="name"
                  {...register("displayName")}
                  placeholder="Alex Coder"
                  className={fieldClass(!!errors.displayName)}
                />
              </div>
              {errors.displayName && (
                <p className="text-xs text-rose-400">
                  {errors.displayName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="register-email"
                className="text-sm font-medium text-slate-300"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className={fieldClass(!!errors.email)}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="register-password"
                className="text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  {...register("password")}
                  placeholder="Min. 8 characters"
                  className={fieldClass(!!errors.password)}
                />
              </div>
              {/* Strength meter */}
              {password && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= score ? color : "bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      score <= 1
                        ? "text-rose-400"
                        : score <= 3
                          ? "text-amber-400"
                          : "text-emerald-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-rose-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="register-confirm-password"
                className="text-sm font-medium text-slate-300"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="register-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  placeholder="Repeat your password"
                  className={fieldClass(!!errors.confirmPassword)}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              id="register-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating account…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>

            <p className="text-center text-xs text-slate-500 pt-1">
              By registering you agree to our terms of service.
            </p>
          </form>

          {/* Footer */}
          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

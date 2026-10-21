import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  Code2,
  BookOpen,
  BrainCircuit,
  Terminal,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  LogOut,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { useAuthStore } from "@/store/auth.store";
import { authApiService } from "@/services/auth.service";

/* ---------- Landing / Dashboard home ---------- */
function HomePage() {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">(
    "checking",
  );
  const navigate = useNavigate();
  const { user, logout, accessToken } = useAuthStore();

  useEffect(() => {
    fetch("/api/v1/health/liveness")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(() => setApiStatus("online"))
      .catch(() => setApiStatus("offline"));
  }, []);

  const handleLogout = async () => {
    await authApiService.logout();
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CodeDrill
              </span>
              <span className="text-xs text-indigo-400 font-mono ml-2">
                v1.0
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {/* Streak badge */}
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{user.streak.currentStreak} Day Streak</span>
              </div>
            )}

            {/* API status */}
            <div className="flex items-center gap-2 text-xs">
              {apiStatus === "online" && (
                <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  API Online
                </span>
              )}
              {apiStatus === "offline" && (
                <span className="inline-flex items-center gap-1.5 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  API Offline
                </span>
              )}
              {apiStatus === "checking" && (
                <span className="text-slate-400">Connecting...</span>
              )}
            </div>

            {/* Auth CTA */}
            {accessToken && user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs">
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{user.displayName}</span>
                </div>
                <Button
                  id="logout-btn"
                  size="sm"
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  id="nav-login-btn"
                  size="sm"
                  variant="ghost"
                  asChild
                  className="text-slate-300 hover:text-white"
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button
                  id="nav-register-btn"
                  size="sm"
                  variant="default"
                  asChild
                  className="shadow-md shadow-indigo-600/20"
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12 w-full">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="default" className="gap-1.5 py-1 px-3">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Active Recall & Deliberate Practice Engine
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Master{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Java Collections
            </span>{" "}
            &{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              DSA
            </span>{" "}
            Internals
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Move beyond generic problem banks. Dive deep into table bucket
            resizing, fail-fast mechanics, concurrency contracts, and
            algorithmic patterns with automated SM-2 spaced repetition.
          </p>
          {!accessToken && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="shadow-lg shadow-indigo-600/30 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
              >
                <Link to="/register">Start for Free</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800/60"
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>

        {/* 5 Modalities Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "MCQs", icon: CheckCircle2, color: "text-indigo-400" },
            {
              label: "Output Prediction",
              icon: Terminal,
              color: "text-amber-400",
            },
            {
              label: "Fill-in-the-Blank",
              icon: Code2,
              color: "text-emerald-400",
            },
            {
              label: "Monaco Sandbox",
              icon: BrainCircuit,
              color: "text-pink-400",
            },
            {
              label: "Interview Drills",
              icon: BookOpen,
              color: "text-cyan-400",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-3 rounded-lg border border-slate-800/80 bg-slate-900/40 text-xs font-medium text-slate-300"
            >
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Track Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Track 1: Java Collections */}
          <Card className="hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="default">Track 1</Badge>
                <span className="text-xs text-slate-400 font-mono">
                  8 Topics • 175 Problems
                </span>
              </div>
              <CardTitle className="mt-3 group-hover:text-indigo-300 transition-colors">
                Java Collections Deep Dive
              </CardTitle>
              <CardDescription>
                Unpack the real mechanics behind ArrayList resizing, HashMap
                treeification, fail-fast modCount checks, ConcurrentHashMap
                segment-less locking, and equals/hashCode contracts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  "HashMap Internals",
                  "ConcurrentHashMap",
                  "CopyOnWriteArrayList",
                  "equals/hashCode",
                  "TreeMap & NavigableMap",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded bg-slate-800/60 text-slate-300 border border-slate-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button className="w-full mt-4" variant="default">
                Explore Java Collections
              </Button>
            </CardContent>
          </Card>

          {/* Track 2: DSA */}
          <Card className="hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-500/5 group flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="success">Track 2</Badge>
                <span className="text-xs text-slate-400 font-mono">
                  13 Topics • 280 Problems
                </span>
              </div>
              <CardTitle className="mt-3 group-hover:text-emerald-300 transition-colors">
                Data Structures & Algorithms
              </CardTitle>
              <CardDescription>
                Systematic pattern mastery covering two pointers, sliding
                window, monotonic stacks, tree recursions, graph topological
                sorts, dynamic programming, and bit manipulation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  "Sliding Window",
                  "Two Pointers",
                  "Monotonic Stack",
                  "Graph Traversals",
                  "Dynamic Programming",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded bg-slate-800/60 text-slate-300 border border-slate-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white">
                Explore DSA Track
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>
          CodeDrill © 2026. Built with React 19, TypeScript, Monaco Editor &
          Express REST API.
        </p>
      </footer>
    </div>
  );
}

/* ---------- Root App with routing ---------- */
export function App() {
  return (
    <AuthInitializer>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Example of a future protected route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all → home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AuthInitializer>
  );
}

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalAchievementNotification } from "@/components/GlobalAchievementNotification";
import { GlobalXPCelebration } from "@/components/GlobalXPCelebration";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { lazy, Suspense } from "react";

// Eager load critical routes
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import LandingRedirect from "./pages/LandingRedirect";

// Lazy load secondary routes
const Summary = lazy(() => import("./pages/Summary"));
const History = lazy(() => import("./pages/History"));
const Plans = lazy(() => import("./pages/Plans"));
const Explore = lazy(() => import("./pages/Explore"));
const Demo = lazy(() => import("./pages/Demo"));
const Welcome = lazy(() => import("./pages/Welcome"));
const PremiumWelcome = lazy(() => import("./pages/PremiumWelcome"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Faq = lazy(() => import("./pages/Faq"));
const Contact = lazy(() => import("./pages/Contact"));
const Profile = lazy(() => import("./pages/Profile"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Ranking = lazy(() => import("./pages/Ranking"));
const Settings = lazy(() => import("./pages/Settings"));

const Admin = lazy(() => import("./pages/Admin"));
const PopulateBooks = lazy(() => import("./pages/PopulateBooks"));
const CurationPeople = lazy(() => import("./pages/CurationPeople"));
const DeduplicateBooks = lazy(() => import("./pages/DeduplicateBooks"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimized QueryClient for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Optimized loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p className="text-sm text-muted-foreground">Carregando...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <GlobalAchievementNotification />
        <GlobalXPCelebration />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
            <Route path="/" element={<LandingRedirect />} />
            <Route path="/pt" element={<Landing lang="pt" />} />
            <Route path="/es" element={<Landing lang="es" />} />
            <Route path="/en" element={<Landing lang="en" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pt/auth" element={<Auth />} />
            <Route path="/es/auth" element={<Auth />} />
            <Route path="/en/auth" element={<Auth />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/premium-welcome" element={<PremiumWelcome />} />
            <Route path="/summary/:id" element={<Summary />} />
            <Route path="/history" element={<History />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pt/terms" element={<Terms />} />
            <Route path="/pt/privacy" element={<Privacy />} />
            <Route path="/pt/faq" element={<Faq />} />
            <Route path="/es/terms" element={<Terms />} />
            <Route path="/es/privacy" element={<Privacy />} />
            <Route path="/es/faq" element={<Faq />} />
            <Route path="/en/terms" element={<Terms />} />
            <Route path="/en/privacy" element={<Privacy />} />
            <Route path="/en/faq" element={<Faq />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/populate-books" element={<PopulateBooks />} />
            <Route path="/curation/people" element={<CurationPeople />} />
            <Route path="/deduplicate-books" element={<DeduplicateBooks />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Faq = lazy(() => import("./pages/Faq"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const GenerateCovers = lazy(() => import("./pages/GenerateCovers"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>}>
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
            <Route path="/summary/:id" element={<Summary />} />
            <Route path="/history" element={<History />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/pt/terms" element={<Terms />} />
            <Route path="/pt/privacy" element={<Privacy />} />
            <Route path="/pt/faq" element={<Faq />} />
            <Route path="/es/terms" element={<Terms />} />
            <Route path="/es/privacy" element={<Privacy />} />
            <Route path="/es/faq" element={<Faq />} />
            <Route path="/en/terms" element={<Terms />} />
            <Route path="/en/privacy" element={<Privacy />} />
            <Route path="/en/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pt/contact" element={<Contact />} />
            <Route path="/es/contact" element={<Contact />} />
            <Route path="/en/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/generate-covers" element={<GenerateCovers />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

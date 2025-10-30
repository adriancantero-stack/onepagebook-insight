import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { BookOpen, Globe } from "lucide-react";
import { useABTest } from "@/hooks/useABTest";
const Auth = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string>("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const navigate = useNavigate();
  const { trackConversion } = useABTest();

  // Detect and set language on mount
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['pt', 'en', 'es'];
    if (supportedLangs.includes(browserLang) && i18n.language !== browserLang) {
      i18n.changeLanguage(browserLang);
    }
  }, [i18n]);
  useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (session) {
        navigate("/home");
      }
    });
  }, [navigate]);
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      if (isSignUp) {
        // Capture signup metadata - prioritize landing page data if available
        const signupLanguage = localStorage.getItem("pending_signup_language") || localStorage.getItem("language") || navigator.language.split("-")[0] || "en";
        const signupPath = localStorage.getItem("pending_signup_path") || window.location.pathname;
        const signupCountry = localStorage.getItem("pending_signup_country") || navigator.language; // e.g., "pt-BR", "en-US", "es-ES"
        
        // Signup
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              signup_language: signupLanguage,
              signup_path: signupPath,
              signup_country: signupCountry
            },
            emailRedirectTo: `${window.location.origin}/welcome`
          }
        });
        if (error) throw error;
        
        // Track signup conversion for A/B test (non-blocking)
        trackConversion('signup').catch(err => console.error('Error tracking signup:', err));
        
        // Clear pending signup data after successful signup
        localStorage.removeItem("pending_signup_language");
        localStorage.removeItem("pending_signup_path");
        localStorage.removeItem("pending_signup_country");
        
        toast({
          title: t("toast.success")
        });
        navigate("/welcome");
      } else {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast({
          title: t("toast.success")
        });
        navigate("/");
      }
    } catch (error: any) {
      const errorMessage = error.message || t("toast.authError");
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: t("toast.error"),
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    
    try {
      // Capture and store signup metadata in localStorage for later
      const signupLanguage = localStorage.getItem("language") || navigator.language.split("-")[0] || "en";
      const signupPath = window.location.pathname;
      const signupCountry = navigator.language; // e.g., "pt-BR", "en-US", "es-ES"
      
      // Store metadata temporarily for use after OAuth redirect
      localStorage.setItem("pending_signup_language", signupLanguage);
      localStorage.setItem("pending_signup_path", signupPath);
      localStorage.setItem("pending_signup_country", signupCountry);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/welcome`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      const errorMessage = error.message || t("auth.googleError");
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: t("toast.error"),
        description: errorMessage
      });
      setGoogleLoading(false);
    }
  };

  const getContent = () => {
    const lang = i18n.language;
    
    const content = {
      pt: {
        headline: "Entre e descubra o poder de aprender em minutos.",
        subtext: "Acesse com um clique e comece agora.",
        googleButton: "Entrar com Google",
        emailLink: "Prefere e-mail?",
        emailLinkAction: "Entrar com e-mail",
        noAccount: "Não tem conta?",
        createFree: "Criar grátis",
        emailModalTitle: "Entrar com e-mail",
        emailModalDesc: "Preencha seus dados para acessar",
      },
      en: {
        headline: "Sign in and unlock the power of learning in minutes.",
        subtext: "Access with one click and start now.",
        googleButton: "Sign in with Google",
        emailLink: "Prefer email?",
        emailLinkAction: "Sign in with email",
        noAccount: "Don't have an account?",
        createFree: "Create free",
        emailModalTitle: "Sign in with email",
        emailModalDesc: "Fill in your details to access",
      },
      es: {
        headline: "Inicia sesión y descubre el poder de aprender en minutos.",
        subtext: "Accede con un clic y comienza ahora.",
        googleButton: "Iniciar sesión con Google",
        emailLink: "¿Prefieres correo?",
        emailLinkAction: "Iniciar con correo",
        noAccount: "¿No tienes cuenta?",
        createFree: "Crear gratis",
        emailModalTitle: "Iniciar con correo",
        emailModalDesc: "Completa tus datos para acceder",
      }
    };

    return content[lang as keyof typeof content] || content.en;
  };

  const cycleLanguage = () => {
    const languages = ['pt', 'en', 'es'];
    const currentIndex = languages.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    i18n.changeLanguage(languages[nextIndex]);
  };

  const content = getContent();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 relative animate-fade-in">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 animate-scale-in">
        <BookOpen className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-semibold text-foreground">OnePageBook</h1>
      </div>

      {/* Main Content Card */}
      <div className="w-full max-w-md space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {/* Headline */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
            {content.headline}
          </h2>
          <p className="text-base text-muted-foreground">
            {content.subtext}
          </p>
        </div>

        {/* Google Button - Primary CTA */}
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white"/>
          </svg>
          {googleLoading ? (
            <span className="animate-pulse">{i18n.language === 'pt' ? 'Entrando...' : i18n.language === 'es' ? 'Entrando...' : 'Signing in...'}</span>
          ) : content.googleButton}
        </Button>

        {/* Email Alternative - Minimalist */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {content.emailLink}{' '}
            <button
              onClick={() => setShowEmailModal(true)}
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
            >
              {content.emailLinkAction}
            </button>
          </p>
        </div>

        {/* Create Account Footer */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            {content.noAccount}{' '}
            <button
              onClick={handleGoogleSignIn}
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              {content.createFree} →
            </button>
          </p>
        </div>
      </div>

      {/* Language Selector - Discrete */}
      <button
        onClick={cycleLanguage}
        className="absolute bottom-6 right-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        <span className="uppercase font-medium">{i18n.language}</span>
      </button>

      {/* Email Login Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="sm:max-w-md bg-background rounded-2xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">{content.emailModalTitle}</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              {content.emailModalDesc}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAuth} className="space-y-4 mt-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  {i18n.language === 'pt' ? 'Nome completo' : i18n.language === 'es' ? 'Nombre completo' : 'Full name'}
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-11 rounded-xl border-input focus:border-primary bg-background"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {i18n.language === 'pt' ? 'E-mail' : i18n.language === 'es' ? 'Correo' : 'Email'}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl border-input focus:border-primary bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                {i18n.language === 'pt' ? 'Senha' : i18n.language === 'es' ? 'Contraseña' : 'Password'}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11 rounded-xl border-input focus:border-primary bg-background"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 rounded-xl text-primary-foreground font-medium transition-all"
              disabled={loading || !email || !password || (isSignUp && !fullName)}
            >
              {loading
                ? (i18n.language === 'pt' ? 'Carregando...' : i18n.language === 'es' ? 'Cargando...' : 'Loading...')
                : isSignUp
                  ? (i18n.language === 'pt' ? 'Criar conta' : i18n.language === 'es' ? 'Crear cuenta' : 'Create account')
                  : (i18n.language === 'pt' ? 'Entrar' : i18n.language === 'es' ? 'Entrar' : 'Sign in')}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {isSignUp
                  ? (i18n.language === 'pt' ? 'Já tem conta? Entrar' : i18n.language === 'es' ? '¿Ya tienes cuenta? Entrar' : 'Already have an account? Sign in')
                  : (i18n.language === 'pt' ? 'Não tem conta? Criar' : i18n.language === 'es' ? '¿No tienes cuenta? Crear' : "Don't have an account? Create")}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
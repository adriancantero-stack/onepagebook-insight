import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { BookOpen } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
const Auth = () => {
  const {
    t
  } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string>("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
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
        // Signup
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            },
            emailRedirectTo: `${window.location.origin}/welcome`
          }
        });
        if (error) throw error;
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/home`
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

  return <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-background p-4">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        
        <Card className="w-full max-w-md border-transparent">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">OnePageBook</h1>
            </div>
          </div>
          <p className="text-sm text-primary font-medium mb-3">{t("auth.tagline")}</p>
          <p className="text-base sm:text-lg text-foreground/80 mb-6 max-w-[60ch] mx-auto leading-relaxed py-0 my-[5px]">
            {t("hero.sub")}
          </p>
          <CardDescription className="mt-1 mb-3 py-[4px]">
            {t("auth.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            type="button"
            variant="outline" 
            className="w-full h-12 mb-4"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {googleLoading ? t("auth.signingIn") : t("auth.continueWithGoogle")}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mb-4">
            {t("auth.googlePrivacy")}
          </p>
          
          <div className="relative mb-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              {t("auth.orDivider")}
            </span>
          </div>

          <form onSubmit={handleAuth} className="space-y-2">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">{t("auth.fullName")}</Label>
                <Input 
                  id="fullName" 
                  type="text" 
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)} 
                  required 
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                minLength={6} 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !email || !password || (isSignUp && !fullName)}
            >
              {loading 
                ? t("auth.loading") 
                : isSignUp 
                  ? t("auth.startFree") 
                  : t("auth.login")
              }
            </Button>
            {error && (
              <p className="text-sm text-destructive text-center mt-2">{error}</p>
            )}
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="text-sm"
              >
                {isSignUp 
                  ? t("auth.haveAccount") 
                  : t("auth.noAccount")
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
      
      <Footer />
    </div>;
};
export default Auth;
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
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (session) {
        navigate("/");
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
  return <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-background p-4">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        
        <Card className="w-full max-w-md">
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
          <CardDescription className="mt-8 mb-3 py-[4px] underline animate-pulse text-foreground font-semibold">
            {t("auth.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-3">
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
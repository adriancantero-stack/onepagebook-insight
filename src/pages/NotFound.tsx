import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Set meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'A página que você procura não existe. Retorne à página inicial do OnePageBook para criar resumos de livros com IA.');
    }
    
    // Set title
    document.title = '404 - Página Não Encontrada | OnePageBook';
    
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-6 p-8">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Página Não Encontrada</h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
          <Button 
            onClick={() => navigate("/")}
            size="lg"
            className="mt-4"
          >
            <Home className="mr-2 h-4 w-4" />
            Voltar para Home
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFound;

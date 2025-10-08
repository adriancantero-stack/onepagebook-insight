import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const contactEmail = "contact@onepagebook.ai";

  return (
    <footer className="mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link 
              to="/terms" 
              className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              {t("footer.terms")}
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              to="/privacy" 
              className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              {t("footer.privacy")}
            </Link>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <p className="text-center text-xs">
              Associado da Amazon
            </p>
            <p className="text-center">
              {t("footer.copyright", { year: currentYear })}
            </p>
            <p className="text-center text-xs md:hidden">
              Versão 1.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

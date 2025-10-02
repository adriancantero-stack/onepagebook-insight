import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const contactEmail = "sac@onepagebook.ai";

  return (
    <footer className="border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/terms" 
              className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-[#5A54E6] focus:ring-offset-2 rounded"
            >
              {t("footer.terms")}
            </Link>
            <Link 
              to="/privacy" 
              className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-[#5A54E6] focus:ring-offset-2 rounded"
            >
              {t("footer.privacy")}
            </Link>
            <Link 
              to="/faq" 
              className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-[#5A54E6] focus:ring-offset-2 rounded"
            >
              {t("footer.faq")}
            </Link>
            <a 
              href={`mailto:${contactEmail}`}
              className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-[#5A54E6] focus:ring-offset-2 rounded"
            >
              {t("footer.contact")}
            </a>
          </div>
          <p className="text-center">
            {t("footer.copyright", { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

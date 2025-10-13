import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Zap, Infinity } from "lucide-react";

const PremiumWelcome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // GA4 Purchase Tracking com regras de idioma e preço
    try {
      // evita duplicar o evento na mesma sessão
      if (sessionStorage.getItem('ga_purchase')) return;

      // idioma: html lang -> prefixo da rota -> navegador
      const htmlLang = (document.documentElement.lang || '').slice(0,2).toLowerCase();
      const routeLang = (location.pathname.match(/^\/([a-z]{2})\//) || [])[1];
      const lang = (htmlLang || routeLang || navigator.language.slice(0,2) || 'en').toLowerCase();

      // tenta ler valor/moeda de atributos no HTML (se existir)
      const dataEl = document.querySelector('[data-plan-price][data-currency]');
      let value = dataEl ? Number(dataEl.getAttribute('data-plan-price')) : NaN;
      let currency = dataEl ? (dataEl.getAttribute('data-currency') || '').toUpperCase() : '';

      // permite override via querystring (ex.: ?price=14.9&currency=BRL)
      const qs = new URLSearchParams(location.search);
      const qsPrice = qs.get('price');
      const qsCurrency = qs.get('currency');
      if (!isNaN(Number(qsPrice))) value = Number(qsPrice);
      if (qsCurrency) currency = qsCurrency.toUpperCase();

      // fallback padrão por idioma (regra do produto)
      if (isNaN(value) || !currency) {
        if (lang === 'pt') {
          value = 14.90;
          currency = 'BRL';
        } else {
          value = 4.99;
          currency = 'USD';
        }
      }

      // transaction id: use o session_id da Stripe se veio no retorno
      const sessionId = qs.get('session_id');
      const transactionId = sessionId || ('opb_' + Date.now() + '_' + Math.random().toString(36).slice(2));

      // dispara evento GA4 purchase
      const gtag = (window as any).gtag;
      if (gtag) {
        gtag('event', 'purchase', {
          transaction_id: transactionId,
          value: value,
          currency: currency,
          plan: 'premium',
          language: lang,
          method: 'stripe',
          items: [{
            item_id: 'opb_premium',
            item_name: 'OnePageBook Premium',
            price: value,
            quantity: 1
          }]
        });
        sessionStorage.setItem('ga_purchase', '1'); // trava anti-duplicação
      } else {
        console.warn('gtag() não encontrado. Confirme a tag GA4 no <head>.');
      }
    } catch (e) {
      console.error('Erro ao disparar GA4 purchase:', e);
    }

    // Auto-redirect after 8 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const benefits = [
    {
      icon: Infinity,
      title: "Resumos Ilimitados",
      description: "Gere quantos resumos quiser, sem limites"
    },
    {
      icon: Zap,
      title: "Áudios Ilimitados",
      description: "Ouça todos os resumos em formato de áudio"
    },
    {
      icon: Sparkles,
      title: "Acesso Prioritário",
      description: "Novos recursos e melhorias em primeira mão"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7B61FF]/5 via-white to-[#9D8CFF]/5 p-6">
      <div className="w-full max-w-2xl text-center space-y-8 animate-fade-in">
        {/* Premium Crown Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#7B61FF]/30 blur-3xl rounded-full animate-pulse" />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#9D8CFF] flex items-center justify-center shadow-2xl border-4 border-white">
              <Crown className="w-16 h-16 text-white" strokeWidth={1.5} fill="white" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Pagamento confirmado
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-[#1D1D1F] tracking-tight leading-tight">
            Bem-vindo ao<br />
            <span className="bg-gradient-to-r from-[#7B61FF] to-[#9D8CFF] bg-clip-text text-transparent">
              Premium Ilimitado
            </span>
          </h1>
          
          <p className="text-xl text-[#86868B] font-normal max-w-lg mx-auto leading-relaxed">
            Parabéns! Agora você tem acesso ilimitado a todos os recursos do OnePageBook.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-4 pt-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 border-2 border-[#E5E5EA] hover:border-[#7B61FF] transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7B61FF]/10 to-[#9D8CFF]/10 flex items-center justify-center mb-4 mx-auto">
                  <Icon className="w-6 h-6 text-[#7B61FF]" strokeWidth={2} />
                </div>
                <h3 className="text-base font-semibold text-[#1D1D1F] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-[#86868B] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="pt-6 space-y-4">
          <Button 
            onClick={() => navigate("/")} 
            className="w-full h-14 sm:h-16 bg-gradient-to-r from-[#7B61FF] to-[#9D8CFF] hover:from-[#6951E6] hover:to-[#8B7CFF] text-white rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            Começar a usar agora
          </Button>
          
          <p className="text-sm text-[#86868B] font-normal">
            Redirecionando automaticamente em 8 segundos...
          </p>
        </div>

        {/* Trust Line */}
        <div className="pt-4">
          <p className="text-xs text-[#86868B]">
            🔒 Pagamento processado com segurança · Acesso ativado instantaneamente
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumWelcome;

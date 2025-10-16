import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookText, Headphones, Brain, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    icon: BookText,
    title: "Resumo em 1 Página",
    description: "Principais ideias organizadas e prontas para ler",
    color: "from-blue-500 to-cyan-500",
    content: (
      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-xl w-full h-full flex flex-col gap-2 overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 sm:h-8 w-6 sm:w-8 rounded bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <BookText className="h-3 sm:h-4 w-3 sm:w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="h-2 sm:h-3 bg-gradient-to-r from-primary to-purple-600 rounded w-3/4 mb-1"></div>
            <div className="h-1.5 sm:h-2 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        
        <div className="space-y-1.5 sm:space-y-2 flex-1 overflow-y-auto">
          <div className="bg-primary/5 border-l-2 border-primary p-1.5 sm:p-2 rounded-r">
            <div className="h-1.5 sm:h-2 bg-primary/30 rounded w-1/4 mb-1"></div>
            <div className="h-1 sm:h-1.5 bg-gray-300 rounded w-full mb-0.5"></div>
            <div className="h-1 sm:h-1.5 bg-gray-300 rounded w-5/6"></div>
          </div>
          
          <div className="space-y-1">
            <div className="flex gap-1.5 sm:gap-2 items-start">
              <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-primary/20 shrink-0 mt-0.5"></div>
              <div className="flex-1 space-y-0.5">
                <div className="h-1 sm:h-1.5 bg-gray-200 rounded w-full"></div>
                <div className="h-1 sm:h-1.5 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
            <div className="flex gap-1.5 sm:gap-2 items-start">
              <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-primary/20 shrink-0 mt-0.5"></div>
              <div className="flex-1 space-y-0.5">
                <div className="h-1 sm:h-1.5 bg-gray-200 rounded w-full"></div>
                <div className="h-1 sm:h-1.5 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="flex gap-1.5 sm:gap-2 items-start">
              <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-primary/20 shrink-0 mt-0.5"></div>
              <div className="flex-1 space-y-0.5">
                <div className="h-1 sm:h-1.5 bg-gray-200 rounded w-full"></div>
                <div className="h-1 sm:h-1.5 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-1.5 sm:p-2 rounded mt-2">
            <div className="h-1.5 sm:h-2 bg-purple-300 rounded w-2/3 mb-1"></div>
            <div className="h-1 sm:h-1.5 bg-purple-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    icon: Headphones,
    title: "Áudio Realista",
    description: "Ouça enquanto dirige ou malha",
    color: "from-purple-500 to-pink-500",
    content: (
      <div className="bg-white rounded-lg p-6 shadow-xl w-full h-full flex flex-col justify-center items-center gap-4">
        <div className="relative w-20 h-20">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Headphones className="absolute inset-0 m-auto h-10 w-10 text-white z-10" />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full"
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span>0:00</span>
          <span>/</span>
          <span>2:30</span>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    icon: Brain,
    title: "Flashcards Interativos",
    description: "Memorize conceitos-chave facilmente",
    color: "from-orange-500 to-red-500",
    content: (
      <div className="relative w-full h-full flex items-center justify-center p-2">
        <motion.div
          className="bg-white rounded-lg shadow-2xl w-full sm:w-4/5 h-full sm:h-4/5 flex flex-col border-2 border-primary/20 relative overflow-hidden"
          animate={{ rotateY: [0, 0, 0, 180, 180, 180, 0] }}
          transition={{ duration: 6, repeat: Infinity, times: [0, 0.3, 0.4, 0.5, 0.8, 0.9, 1] }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front - Question */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex-1 flex flex-col justify-center items-center text-center gap-3 sm:gap-4">
              <div className="inline-flex px-3 py-1 bg-primary/10 rounded-full">
                <span className="text-xs font-medium text-primary">Pergunta</span>
              </div>
              <p className="text-sm sm:text-base lg:text-lg font-semibold text-foreground px-4">
                O que são hábitos atômicos?
              </p>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              Toque para ver a resposta
            </div>
          </motion.div>

          {/* Back - Answer */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-purple-50"
            style={{ backfaceVisibility: "hidden", rotateY: "180deg" }}
          >
            <div className="flex-1 flex flex-col justify-center items-center text-center gap-3 sm:gap-4">
              <div className="inline-flex px-3 py-1 bg-green-100 rounded-full">
                <span className="text-xs font-medium text-green-700">Resposta</span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 px-4 leading-relaxed">
                Pequenas mudanças que, quando repetidas consistentemente, geram resultados extraordinários ao longo do tempo.
              </p>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              Auto-flip em progresso
            </div>
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 pointer-events-none" />
        </motion.div>
      </div>
    ),
  },
  {
    id: 4,
    icon: Lightbulb,
    title: "Exemplos Práticos",
    description: "Aplique o conhecimento na vida real",
    color: "from-green-500 to-emerald-500",
    content: (
      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-xl w-full h-full flex flex-col gap-2 overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-yellow-100 rounded-lg">
            <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
          </div>
          <div className="flex-1">
            <div className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded w-2/3"></div>
          </div>
        </div>
        
        <div className="space-y-2 flex-1">
          <div className="bg-green-50 border-l-4 border-green-500 p-2 sm:p-3 rounded-r">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <div className="h-1.5 sm:h-2 bg-green-600 rounded w-1/3"></div>
            </div>
            <div className="space-y-1">
              <div className="h-1 sm:h-1.5 bg-green-200 rounded w-full"></div>
              <div className="h-1 sm:h-1.5 bg-green-200 rounded w-5/6"></div>
              <div className="h-1 sm:h-1.5 bg-green-200 rounded w-4/5"></div>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-2 sm:p-3 rounded-r">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <div className="h-1.5 sm:h-2 bg-blue-600 rounded w-1/4"></div>
            </div>
            <div className="space-y-1">
              <div className="h-1 sm:h-1.5 bg-blue-200 rounded w-full"></div>
              <div className="h-1 sm:h-1.5 bg-blue-200 rounded w-4/5"></div>
            </div>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-2 sm:p-3 rounded-r">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              <div className="h-1.5 sm:h-2 bg-purple-600 rounded w-1/3"></div>
            </div>
            <div className="space-y-1">
              <div className="h-1 sm:h-1.5 bg-purple-200 rounded w-full"></div>
              <div className="h-1 sm:h-1.5 bg-purple-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export const DemoCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

  const current = slides[currentSlide];
  const Icon = current.icon;

  return (
    <div className="relative w-full h-full">
      {/* Main Carousel */}
      <div className="aspect-[4/3] rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 to-purple-100/50 shadow-xl sm:shadow-2xl border border-primary/20 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 p-4 sm:p-8 flex items-center justify-center"
          >
            {current.content}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg h-8 w-8 sm:h-10 sm:w-10"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg h-8 w-8 sm:h-10 sm:w-10"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? "w-8 bg-primary" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Info Card Below Carousel */}
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 bg-background p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg border"
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${current.color}`}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-sm sm:text-base">{current.title}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">{current.description}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

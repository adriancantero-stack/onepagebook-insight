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
      <div className="bg-white rounded-lg p-4 shadow-xl w-full h-full flex flex-col gap-2">
        <div className="h-3 bg-gradient-to-r from-primary to-purple-600 rounded w-3/4"></div>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
        <div className="h-2 bg-gray-200 rounded w-5/6"></div>
        <div className="h-2 bg-gray-200 rounded w-4/5"></div>
        <div className="mt-2 space-y-1">
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full bg-primary/20 shrink-0"></div>
            <div className="h-2 bg-gray-200 rounded flex-1"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full bg-primary/20 shrink-0"></div>
            <div className="h-2 bg-gray-200 rounded flex-1"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full bg-primary/20 shrink-0"></div>
            <div className="h-2 bg-gray-200 rounded flex-1"></div>
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
          <span>5:30</span>
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
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          className="bg-white rounded-lg p-6 shadow-2xl w-4/5 h-4/5 flex flex-col justify-center items-center gap-3 border-2 border-primary/20"
          animate={{ rotateY: [0, 180, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-2">Pergunta</div>
            <div className="text-sm font-semibold">O que são hábitos atômicos?</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-50 rounded-lg" />
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
      <div className="bg-white rounded-lg p-4 shadow-xl w-full h-full flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          <div className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded w-1/2"></div>
        </div>
        <div className="space-y-2">
          <div className="bg-green-50 border-l-4 border-green-500 p-2 rounded">
            <div className="h-2 bg-green-200 rounded w-3/4 mb-1"></div>
            <div className="h-1.5 bg-green-100 rounded w-full"></div>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded">
            <div className="h-2 bg-blue-200 rounded w-2/3 mb-1"></div>
            <div className="h-1.5 bg-blue-100 rounded w-5/6"></div>
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

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  card_order: number;
}

interface FlashcardsPracticeProps {
  flashcards: Flashcard[];
}

export const FlashcardsPractice = ({ flashcards }: FlashcardsPracticeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (!flashcards || flashcards.length === 0) {
    return null;
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Card {currentIndex + 1} de {flashcards.length}</span>
        <Button
          onClick={handleReset}
          variant="ghost"
          size="sm"
          className="h-8"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Recomeçar
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      <Card
        onClick={handleFlip}
        className="relative h-64 cursor-pointer perspective-1000"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front side (Question) */}
          <div
            className={`absolute inset-0 p-8 flex flex-col items-center justify-center backface-hidden ${
              isFlipped ? 'invisible' : 'visible'
            }`}
          >
            <div className="text-xs font-medium text-primary mb-4">PERGUNTA</div>
            <p className="text-lg text-center leading-relaxed">
              {currentCard.question}
            </p>
            <div className="mt-6 text-sm text-muted-foreground">
              Clique para ver a resposta
            </div>
          </div>

          {/* Back side (Answer) */}
          <div
            className={`absolute inset-0 p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180 bg-primary/5 ${
              isFlipped ? 'visible' : 'invisible'
            }`}
          >
            <div className="text-xs font-medium text-primary mb-4">RESPOSTA</div>
            <p className="text-lg text-center leading-relaxed">
              {currentCard.answer}
            </p>
            <div className="mt-6 text-sm text-muted-foreground">
              Clique para voltar à pergunta
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between gap-2 sm:gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
          className="flex-1 text-xs sm:text-sm"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          <span className="hidden xs:inline">Anterior</span>
          <span className="xs:hidden">Ant</span>
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          variant="outline"
          className="flex-1 text-xs sm:text-sm"
        >
          <span className="hidden xs:inline">Próximo</span>
          <span className="xs:hidden">Prox</span>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

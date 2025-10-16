import { Card } from "./ui/card";
import { Lightbulb, Target, TrendingUp } from "lucide-react";

interface PracticalExample {
  title: string;
  context: string;
  application: string;
  expected_result: string;
}

interface PracticalExamplesProps {
  examples: PracticalExample[];
}

export const PracticalExamples = ({ examples }: PracticalExamplesProps) => {
  if (!examples || examples.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {examples.map((example, index) => (
        <Card
          key={index}
          className="p-4 sm:p-6 border-l-4 border-l-primary hover:shadow-md transition-shadow"
        >
          <div className="space-y-3 sm:space-y-4">
            {/* Title */}
            <div className="flex items-start gap-2 sm:gap-3">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
              <h4 className="font-semibold text-base sm:text-lg">{example.title}</h4>
            </div>

            {/* Context */}
            <div className="pl-6 sm:pl-8 space-y-2">
              <div className="text-xs sm:text-sm">
                <span className="font-medium text-muted-foreground">
                  Contexto:
                </span>
                <p className="text-foreground leading-relaxed mt-1">
                  {example.context}
                </p>
              </div>

              {/* Application */}
              <div className="text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  <span className="font-medium text-muted-foreground">
                    Aplicação:
                  </span>
                </div>
                <p className="text-foreground leading-relaxed mt-1">
                  {example.application}
                </p>
              </div>

              {/* Expected Result */}
              <div className="text-xs sm:text-sm bg-primary/5 p-2 sm:p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  <span className="font-medium text-primary">
                    Resultado Esperado:
                  </span>
                </div>
                <p className="text-foreground leading-relaxed mt-1">
                  {example.expected_result}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

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
    <div className="space-y-4">
      {examples.map((example, index) => (
        <Card
          key={index}
          className="p-6 border-l-4 border-l-primary hover:shadow-md transition-shadow"
        >
          <div className="space-y-4">
            {/* Title */}
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <h4 className="font-semibold text-lg">{example.title}</h4>
            </div>

            {/* Context */}
            <div className="pl-8 space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <span className="font-medium text-muted-foreground shrink-0">
                  Contexto:
                </span>
                <p className="text-foreground leading-relaxed">
                  {example.context}
                </p>
              </div>

              {/* Application */}
              <div className="flex items-start gap-2 text-sm">
                <Target className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-muted-foreground">
                    Aplicação:
                  </span>
                  <p className="text-foreground leading-relaxed mt-1">
                    {example.application}
                  </p>
                </div>
              </div>

              {/* Expected Result */}
              <div className="flex items-start gap-2 text-sm bg-primary/5 p-3 rounded-lg">
                <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-primary">
                    Resultado Esperado:
                  </span>
                  <p className="text-foreground leading-relaxed mt-1">
                    {example.expected_result}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

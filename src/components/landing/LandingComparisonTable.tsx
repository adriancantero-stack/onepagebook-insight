import { Check, X } from "lucide-react";

export default function LandingComparisonTable() {
  return (
    <section className="container mx-auto px-6 py-16 sm:px-12 sm:py-24 lg:px-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
          Mais do que resumos.
        </h2>
        <p className="text-xl text-muted-foreground">
          Um sistema de <span className="text-primary font-semibold">aprendizagem acelerada</span>.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-background rounded-xl shadow-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-primary/10 to-purple-50">
              <th className="p-4 text-left font-semibold">Recurso</th>
              <th className="p-4 text-center font-semibold bg-primary/20">
                <span className="text-primary">OnePageBook ✅</span>
              </th>
              <th className="p-4 text-center font-semibold">Blinkist</th>
              <th className="p-4 text-center font-semibold">12Min</th>
              <th className="p-4 text-center font-semibold">Headway</th>
            </tr>
          </thead>
          <tbody>
            {[
              { feature: "IA avançada (PT, EN, ES)", opb: true, b: "partial", m: true, h: true },
              { feature: "Flashcards interativos", opb: true, b: false, m: false, h: false },
              { feature: "Exemplos aplicáveis", opb: true, b: false, m: false, h: false },
              { feature: "Geração sob demanda", opb: true, b: false, m: false, h: false },
              { feature: "Exportação PDF / áudio", opb: true, b: false, m: true, h: true },
            ].map((row, idx) => (
              <tr key={idx} className="border-t hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium">{row.feature}</td>
                <td className="p-4 text-center bg-primary/5">
                  {row.opb ? <Check className="inline h-5 w-5 text-green-600" /> : <X className="inline h-5 w-5 text-red-500" />}
                </td>
                <td className="p-4 text-center">
                  {row.b === "partial" ? "⚠️" : row.b ? <Check className="inline h-5 w-5 text-green-600" /> : <X className="inline h-5 w-5 text-red-500" />}
                </td>
                <td className="p-4 text-center">
                  {row.m ? <Check className="inline h-5 w-5 text-green-600" /> : <X className="inline h-5 w-5 text-red-500" />}
                </td>
                <td className="p-4 text-center">
                  {row.h ? <Check className="inline h-5 w-5 text-green-600" /> : <X className="inline h-5 w-5 text-red-500" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

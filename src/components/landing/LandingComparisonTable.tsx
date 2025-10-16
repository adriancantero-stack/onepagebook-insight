import { Check, X } from "lucide-react";

export default function LandingComparisonTable() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-12 sm:py-16 lg:py-24">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
          Mais do que resumos.
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground px-4">
          Um sistema de <span className="text-primary font-semibold">aprendizagem acelerada</span>.
        </p>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full border-collapse bg-background rounded-xl shadow-lg overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-primary/10 to-purple-50">
                <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold sticky left-0 bg-gradient-to-r from-primary/10 to-purple-50 z-10">Recurso</th>
                <th className="p-2 sm:p-4 text-center text-xs sm:text-sm font-semibold bg-primary/20 min-w-[100px]">
                  <span className="text-primary">OnePageBook</span>
                </th>
                <th className="p-2 sm:p-4 text-center text-xs sm:text-sm font-semibold min-w-[80px]">Blinkist</th>
                <th className="p-2 sm:p-4 text-center text-xs sm:text-sm font-semibold min-w-[80px]">12Min</th>
                <th className="p-2 sm:p-4 text-center text-xs sm:text-sm font-semibold min-w-[80px]">Headway</th>
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
                  <td className="p-2 sm:p-4 text-xs sm:text-sm font-medium sticky left-0 bg-background z-10">{row.feature}</td>
                  <td className="p-2 sm:p-4 text-center bg-primary/5">
                    {row.opb ? <Check className="inline h-4 w-4 sm:h-5 sm:w-5 text-green-600" /> : <X className="inline h-4 w-4 sm:h-5 sm:w-5 text-red-500" />}
                  </td>
                  <td className="p-2 sm:p-4 text-center">
                    {row.b === "partial" ? "⚠️" : row.b ? <Check className="inline h-4 w-4 sm:h-5 sm:w-5 text-green-600" /> : <X className="inline h-4 w-4 sm:h-5 sm:w-5 text-red-500" />}
                  </td>
                  <td className="p-2 sm:p-4 text-center">
                    {row.m ? <Check className="inline h-4 w-4 sm:h-5 sm:w-5 text-green-600" /> : <X className="inline h-4 w-4 sm:h-5 sm:w-5 text-red-500" />}
                  </td>
                  <td className="p-2 sm:p-4 text-center">
                    {row.h ? <Check className="inline h-4 w-4 sm:h-5 sm:w-5 text-green-600" /> : <X className="inline h-4 w-4 sm:h-5 sm:w-5 text-red-500" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

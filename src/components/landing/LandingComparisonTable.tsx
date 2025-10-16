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

      {/* Mobile Version - Cards */}
      <div className="md:hidden space-y-4">
        <div className="bg-gradient-to-br from-primary/10 to-purple-50 p-4 rounded-xl border-2 border-primary/30">
          <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
            <Check className="h-5 w-5" />
            OnePageBook
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              <span>IA avançada (PT, EN, ES)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              <span>Flashcards interativos</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              <span>Exemplos aplicáveis</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              <span>Geração sob demanda</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              <span>Exportação PDF / áudio</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white p-3 rounded-lg border text-center">
            <p className="font-semibold text-xs mb-2">Blinkist</p>
            <div className="space-y-1">
              <span className="block text-xs">⚠️</span>
              <X className="h-3 w-3 text-red-500 mx-auto" />
              <X className="h-3 w-3 text-red-500 mx-auto" />
              <X className="h-3 w-3 text-red-500 mx-auto" />
              <X className="h-3 w-3 text-red-500 mx-auto" />
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border text-center">
            <p className="font-semibold text-xs mb-2">12Min</p>
            <div className="space-y-1">
              <Check className="h-3 w-3 text-green-600 mx-auto" />
              <X className="h-3 w-3 text-red-500 mx-auto" />
              <X className="h-3 w-3 text-red-500 mx-auto" />
              <X className="h-3 w-3 text-red-500 mx-auto" />
              <Check className="h-3 w-3 text-green-600 mx-auto" />
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border text-center">
            <p className="font-semibold text-xs mb-2">Headway</p>
            <div className="space-y-1">
              <Check className="h-3 w-3 text-green-600 mx-auto" />
              <X className="h-3 w-3 text-red-500 mx-auto" />
              <X className="h-3 w-3 text-red-500 mx-auto" />
              <X className="h-3 w-3 text-red-500 mx-auto" />
              <Check className="h-3 w-3 text-green-600 mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Version - Table */}
      <div className="hidden md:block overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full border-collapse bg-background rounded-xl shadow-lg overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-primary/10 to-purple-50">
                <th className="p-3 lg:p-4 text-left text-sm lg:text-base font-semibold">Recurso</th>
                <th className="p-3 lg:p-4 text-center text-sm lg:text-base font-semibold bg-primary/20">
                  <span className="text-primary">OnePageBook</span>
                </th>
                <th className="p-3 lg:p-4 text-center text-sm lg:text-base font-semibold">Blinkist</th>
                <th className="p-3 lg:p-4 text-center text-sm lg:text-base font-semibold">12Min</th>
                <th className="p-3 lg:p-4 text-center text-sm lg:text-base font-semibold">Headway</th>
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
                  <td className="p-3 lg:p-4 text-sm lg:text-base font-medium">{row.feature}</td>
                  <td className="p-3 lg:p-4 text-center bg-primary/5">
                    {row.opb ? <Check className="inline h-5 w-5 text-green-600" /> : <X className="inline h-5 w-5 text-red-500" />}
                  </td>
                  <td className="p-3 lg:p-4 text-center">
                    {row.b === "partial" ? "⚠️" : row.b ? <Check className="inline h-5 w-5 text-green-600" /> : <X className="inline h-5 w-5 text-red-500" />}
                  </td>
                  <td className="p-3 lg:p-4 text-center">
                    {row.m ? <Check className="inline h-5 w-5 text-green-600" /> : <X className="inline h-5 w-5 text-red-500" />}
                  </td>
                  <td className="p-3 lg:p-4 text-center">
                    {row.h ? <Check className="inline h-5 w-5 text-green-600" /> : <X className="inline h-5 w-5 text-red-500" />}
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

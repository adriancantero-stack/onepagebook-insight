import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";

export default function LandingComparisonTable() {
  const { t } = useTranslation();
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-12 sm:py-16 lg:py-24">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
          {t("landing.comparison.title")}
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground px-4">
          {t("landing.comparison.subtitle")}
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
              <span>{t("landing.comparison.features.ai")}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              <span>{t("landing.comparison.features.flashcards")}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              <span>{t("landing.comparison.features.examples")}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              <span>{t("landing.comparison.features.ondemand")}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              <span>{t("landing.comparison.features.export")}</span>
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
                <th className="p-3 lg:p-4 text-left text-sm lg:text-base font-semibold">{t("landing.comparison.feature")}</th>
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
                { feature: t("landing.comparison.features.ai"), opb: true, b: "partial", m: true, h: true },
                { feature: t("landing.comparison.features.flashcards"), opb: true, b: false, m: false, h: false },
                { feature: t("landing.comparison.features.examples"), opb: true, b: false, m: false, h: false },
                { feature: t("landing.comparison.features.ondemand"), opb: true, b: false, m: false, h: false },
                { feature: t("landing.comparison.features.export"), opb: true, b: false, m: true, h: true },
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

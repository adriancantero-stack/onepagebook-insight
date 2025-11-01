import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CategoryCarousel } from "./CategoryCarousel";
import { useTranslation } from "react-i18next";

interface HomeCategoriesContainerProps {
  onBookSelect: (bookId: string, title: string, author: string) => void;
  language: string;
}

interface Category {
  id: string;
  key: string;
  name_pt: string;
  name_en: string;
  name_es: string;
  display_order: number;
}

export const HomeCategoriesContainer = ({
  onBookSelect,
  language,
}: HomeCategoriesContainerProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("book_categories")
        .select("id, key, name_pt, name_en, name_es, display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .limit(8);

      if (!error && data) {
        setCategories(data);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const getCategoryName = (category: Category) => {
    const lang = i18n.language;
    if (lang === "pt") return category.name_pt;
    if (lang === "es") return category.name_es;
    return category.name_en;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="py-8">
            <div className="h-8 w-48 bg-muted rounded mb-4 px-4" />
            <div className="flex gap-4 px-4 overflow-hidden">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="w-[150px] sm:w-[180px] md:w-[200px] aspect-[2/3] bg-muted rounded flex-shrink-0" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {categories.map((category) => (
        <CategoryCarousel
          key={category.id}
          categoryKey={category.key}
          categoryName={getCategoryName(category)}
          onBookSelect={onBookSelect}
          language={language}
        />
      ))}
    </div>
  );
};

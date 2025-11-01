import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CategoryCarousel } from "./CategoryCarousel";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";

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

const CATEGORIES_PER_LOAD = 6;

export const HomeCategoriesContainer = ({
  onBookSelect,
  language,
}: HomeCategoriesContainerProps) => {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [displayedCategories, setDisplayedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { i18n } = useTranslation();
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("book_categories")
        .select("id, key, name_pt, name_en, name_es, display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setAllCategories(data);
        setDisplayedCategories(data.slice(0, CATEGORIES_PER_LOAD));
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const loadMoreCategories = useCallback(() => {
    if (loadingMore || displayedCategories.length >= allCategories.length) return;
    
    setLoadingMore(true);
    setTimeout(() => {
      const nextBatch = allCategories.slice(
        displayedCategories.length,
        displayedCategories.length + CATEGORIES_PER_LOAD
      );
      setDisplayedCategories(prev => [...prev, ...nextBatch]);
      setLoadingMore(false);
    }, 300);
  }, [allCategories, displayedCategories.length, loadingMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreCategories();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreCategories]);

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

  const hasMore = displayedCategories.length < allCategories.length;

  return (
    <div className="max-w-7xl mx-auto">
      {displayedCategories.map((category) => (
        <CategoryCarousel
          key={category.id}
          categoryKey={category.key}
          categoryName={getCategoryName(category)}
          onBookSelect={onBookSelect}
          language={language}
        />
      ))}
      
      {hasMore && (
        <div ref={observerRef} className="py-8">
          {loadingMore && (
            <div className="px-4">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="flex gap-4 overflow-hidden">
                {[...Array(6)].map((_, j) => (
                  <Skeleton key={j} className="w-[150px] sm:w-[180px] md:w-[200px] aspect-[2/3] flex-shrink-0" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

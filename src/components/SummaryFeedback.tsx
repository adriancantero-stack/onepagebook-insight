import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Star, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface SummaryFeedbackProps {
  summaryId: string;
  userId: string;
}

export const SummaryFeedback = ({ summaryId, userId }: SummaryFeedbackProps) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [existingFeedback, setExistingFeedback] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadExistingFeedback();
  }, [summaryId, userId]);

  const loadExistingFeedback = async () => {
    const { data, error } = await supabase
      .from("summary_feedback")
      .select("*")
      .eq("book_summary_id", summaryId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error loading feedback:", error);
      return;
    }

    if (data) {
      setExistingFeedback(data);
      setRating(data.rating || 0);
      setComment(data.comment || "");
    }
  };

  const handleSubmit = async () => {
    if (rating === 0 && !comment.trim()) {
      toast.error(t("Forneça pelo menos uma avaliação ou comentário"));
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackData = {
        user_id: userId,
        book_summary_id: summaryId,
        rating: rating || null,
        comment: comment.trim() || null,
      };

      if (existingFeedback) {
        const { error } = await supabase
          .from("summary_feedback")
          .update(feedbackData)
          .eq("id", existingFeedback.id);

        if (error) throw error;
        toast.success(t("Avaliação atualizada com sucesso!"));
      } else {
        const { error } = await supabase
          .from("summary_feedback")
          .insert(feedbackData);

        if (error) throw error;
        toast.success(t("Obrigado pelo seu feedback!"));
      }

      await loadExistingFeedback();
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(t("Erro ao enviar avaliação"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (existingFeedback && !showForm) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5" />
            {t("Sua Avaliação")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {existingFeedback.rating && (
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= existingFeedback.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
          {existingFeedback.comment && (
            <p className="text-sm text-muted-foreground mb-3">{existingFeedback.comment}</p>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            {t("Editar Avaliação")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          {t("Avalie este Resumo")}
        </CardTitle>
        <CardDescription>
          {t("Sua opinião nos ajuda a melhorar! Avalie e deixe sugestões.")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            {t("Avaliação (opcional)")}
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 cursor-pointer transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 hover:text-yellow-200"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            {t("Comentários ou Sugestões (opcional)")}
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("Compartilhe suas sugestões de melhoria...")}
            rows={4}
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {comment.length}/1000
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? t("Enviando...") : t("Enviar Avaliação")}
          </Button>
          {showForm && (
            <Button variant="outline" onClick={() => setShowForm(false)}>
              {t("Cancelar")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

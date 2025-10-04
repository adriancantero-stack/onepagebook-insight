import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTitle: string;
  onConfirm: (title: string, author: string) => void;
  lang: string;
}

export const BookDetailsModal = ({
  open,
  onOpenChange,
  initialTitle,
  onConfirm,
  lang,
}: BookDetailsModalProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle);
  const [author, setAuthor] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [authorError, setAuthorError] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
    setAuthor("");
    setTitleError(false);
    setAuthorError(false);
  }, [initialTitle, open]);

  const getModalTitle = () => {
    switch (lang) {
      case "en": return "Complete book details";
      case "es": return "Completar datos del libro";
      default: return "Completar dados do livro";
    }
  };

  const getModalDescription = () => {
    switch (lang) {
      case "en": return "To generate the summary correctly, provide title and author.";
      case "es": return "Para generar el resumen correctamente, indique el título y el autor.";
      default: return "Para gerar o resumo corretamente, informe o título e o autor.";
    }
  };

  const getAuthorPlaceholder = () => {
    switch (lang) {
      case "en": return "Author's name";
      case "es": return "Nombre del autor";
      default: return "Nome do autor";
    }
  };

  const getConfirmButton = () => {
    switch (lang) {
      case "en": return "Confirm";
      case "es": return "Confirmar";
      default: return "Confirmar";
    }
  };

  const getCancelButton = () => {
    switch (lang) {
      case "en": return "Cancel";
      case "es": return "Cancelar";
      default: return "Cancelar";
    }
  };

  const handleConfirm = () => {
    const isTitleValid = title.trim().length > 0;
    const isAuthorValid = author.trim().length > 0;

    setTitleError(!isTitleValid);
    setAuthorError(!isAuthorValid);

    if (isTitleValid && isAuthorValid) {
      onConfirm(title.trim(), author.trim());
      onOpenChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    }
  };

  const isValid = title.trim().length > 0 && author.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
          <DialogDescription>{getModalDescription()}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="book-title">
              {t("home.bookTitle")} *
            </Label>
            <Input
              id="book-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError(false);
              }}
              onKeyDown={handleKeyDown}
              autoFocus
              className={titleError ? "border-destructive" : ""}
            />
            {titleError && (
              <p className="text-sm text-destructive">
                {lang === "en" ? "Title is required" : lang === "es" ? "El título es obligatorio" : "Título obrigatório"}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="book-author">
              {t("home.bookAuthor").replace(" (opcional)", "")} *
            </Label>
            <Input
              id="book-author"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                setAuthorError(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder={getAuthorPlaceholder()}
              className={authorError ? "border-destructive" : ""}
            />
            {authorError && (
              <p className="text-sm text-destructive">
                {lang === "en" ? "Author is required" : lang === "es" ? "El autor es obligatorio" : "Autor obrigatório"}
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="sm:flex-1"
          >
            {getCancelButton()}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!isValid}
            className="sm:flex-1"
          >
            {getConfirmButton()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

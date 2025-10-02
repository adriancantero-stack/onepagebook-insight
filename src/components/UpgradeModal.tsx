import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Crown } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "summary" | "audio";
}

export const UpgradeModal = ({ open, onOpenChange, type }: UpgradeModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate("/plans");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Crown className="w-8 h-8 text-primary" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl">
            {t("limit.modal.title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            {t("limit.modal.body")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="sm:flex-1">
            Fechar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleUpgrade}
            className="sm:flex-1 bg-primary hover:bg-primary/90"
          >
            {t("limit.modal.btn")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

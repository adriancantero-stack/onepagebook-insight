import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CronTimer } from "@/components/CronTimer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, FileText, TrendingUp, Crown, Download, BookOpen, ImagePlus, Sparkles, Upload, Trash2, RefreshCw, UserX, Merge, Globe } from "lucide-react";
import { ManualCoverUpload } from "@/components/admin/ManualCoverUpload";
import { TestEmailNotification } from "@/components/admin/TestEmailNotification";
import { TestPremiumEmail } from "@/components/admin/TestPremiumEmail";
import { TestWelcomeEmail } from "@/components/admin/TestWelcomeEmail";
import { bookCatalog } from "@/data/bookCatalog";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSummaries: number;
  freeUsers: number;
  premiumUsers: number;
  booksWithSummary: number;
  booksWithoutSummary: number;
  booksWithCover: number;
  booksWithoutCover: number;
  totalAudios: number;
  usersByLanguage?: {
    pt: number;
    en: number;
    es: number;
  };
  usersByCountry?: Record<string, number>;
  trafficSources?: Record<string, number>;
}

interface DailyMetrics {
  booksImportedLast24h: number;
  summariesGeneratedLast24h: number;
}

interface UserData {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  plan_type: string;
  summaries_count: number;
  signup_language?: string;
  signup_path?: string;
  signup_country?: string;
}

const Admin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [userGrowth, setUserGrowth] = useState<{ date: string; users: number }[]>([]);
  const [catalogStats, setCatalogStats] = useState({ total: 0, pt: 0, en: 0, es: 0 });
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{ current: number; total: number; lang: string } | null>(null);
  const [importingCatalog, setImportingCatalog] = useState(false);
  const [catalogImportProgress, setCatalogImportProgress] = useState({ current: 0, total: 0 });
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [isCheckingSummaries, setIsCheckingSummaries] = useState(false);
  const [booksWithoutSummaries, setBooksWithoutSummaries] = useState<number | null>(null);
  const [batchGenerateProgress, setBatchGenerateProgress] = useState({ current: 0, total: 0 });
  const [isGeneratingCovers, setIsGeneratingCovers] = useState(false);
  const [isCheckingCovers, setIsCheckingCovers] = useState(false);
  const [booksWithoutCovers, setBooksWithoutCovers] = useState<number | null>(null);
  const [coverGenerateProgress, setCoverGenerateProgress] = useState({ current: 0, total: 0 });
  const [cronSchedules, setCronSchedules] = useState<Array<{
    job_name: string;
    description: string;
    next_run_at: string;
  }>>([]);
  const summaryProgressInterval = useRef<number | null>(null);
  const [isValidatingBooks, setIsValidatingBooks] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    total: number;
    valid: number;
    invalid: number;
    uncertain: number;
  } | null>(null);
  const [isMigratingCategories, setIsMigratingCategories] = useState(false);
  const [categoryMigrationResults, setCategoryMigrationResults] = useState<{
    totalBooks: number;
    migrated: number;
    skipped: number;
    errors: number;
    categoryBreakdown: Record<string, number>;
  } | null>(null);
  const [invalidBooks, setInvalidBooks] = useState<Array<{
    id: string;
    title: string;
    author: string;
    lang: string;
  }>>([]);
  const [showInvalidBooksModal, setShowInvalidBooksModal] = useState(false);
  const [isLoadingInvalidBooks, setIsLoadingInvalidBooks] = useState(false);
  const [isClearingAudioCache, setIsClearingAudioCache] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [upgradingUserId, setUpgradingUserId] = useState<string | null>(null);
  const [isCompletingUserData, setIsCompletingUserData] = useState(false);
  const [incompleteUsersCount, setIncompleteUsersCount] = useState<number>(0);
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics | null>(null);


  useEffect(() => {
    checkAdminAccess();
    loadCronSchedules();
    
    // Update cron schedules every minute
    const interval = setInterval(loadCronSchedules, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await Promise.all([loadAdminData(), loadDailyMetrics()]);
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadCronSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('cron_schedules')
        .select('job_name, description, next_run_at')
        .order('job_name');
      
      if (!error && data) {
        setCronSchedules(data);
      }
    } catch (error) {
      console.error('Error loading cron schedules:', error);
    }
  };

  const loadDailyMetrics = async () => {
    try {
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Get books imported in last 24h from book_import_history
      const { data: importHistory } = await supabase
        .from("book_import_history")
        .select("books_imported")
        .gte("started_at", twentyFourHoursAgo.toISOString())
        .eq("status", "completed");

      const booksImportedLast24h = importHistory?.reduce((sum, record) => sum + (record.books_imported || 0), 0) || 0;

      // Get summaries generated in last 24h
      const { count: summariesLast24h } = await supabase
        .from("book_summaries")
        .select("*", { count: 'exact', head: true })
        .gte("created_at", twentyFourHoursAgo.toISOString());

      setDailyMetrics({
        booksImportedLast24h,
        summariesGeneratedLast24h: summariesLast24h || 0,
      });
    } catch (error) {
      console.error("Error loading daily metrics:", error);
    }
  };

  const loadAdminData = async () => {
    try {
      // Get all users with their profiles and subscription info
      const { data: profilesData } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          created_at,
          signup_language,
          signup_path,
          signup_country,
          preferred_language
        `);

      const { data: subscriptionsData } = await supabase
        .from("user_subscriptions")
        .select(`
          user_id,
          subscription_plans(type)
        `);

      const { data: summariesData } = await supabase
        .from("book_summaries")
        .select("user_id");

      // Calculate stats
      const totalUsers = profilesData?.length || 0;
      const summariesByUser = summariesData?.reduce((acc: any, curr) => {
        acc[curr.user_id] = (acc[curr.user_id] || 0) + 1;
        return acc;
      }, {}) || {};
      
      const activeUsers = Object.keys(summariesByUser).length;
      const totalSummaries = summariesData?.length || 0;

      const planCounts = subscriptionsData?.reduce((acc: any, curr: any) => {
        const planType = curr.subscription_plans?.type || "free";
        acc[planType] = (acc[planType] || 0) + 1;
        return acc;
      }, {}) || {};

      // Calculate language distribution
      const langCounts = profilesData?.reduce((acc: any, curr) => {
        const lang = curr.preferred_language || 'pt';
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      }, {}) || {};

      // Calculate country distribution
      const countryCounts = profilesData?.reduce((acc: any, curr) => {
        if (curr.signup_country) {
          acc[curr.signup_country] = (acc[curr.signup_country] || 0) + 1;
        }
        return acc;
      }, {}) || {};

      // Calculate traffic source distribution
      const trafficSources = profilesData?.reduce((acc: any, curr) => {
        if (curr.signup_path) {
          acc[curr.signup_path] = (acc[curr.signup_path] || 0) + 1;
        }
        return acc;
      }, {}) || {};

      // Get total audios count
      const { count: audiosCount } = await supabase
        .from("book_audio")
        .select("*", { count: 'exact', head: true });

      setStats({
        totalUsers,
        activeUsers,
        totalSummaries,
        freeUsers: planCounts.free || 0,
        premiumUsers: planCounts.premium || 0,
        booksWithSummary: 0,
        booksWithoutSummary: 0,
        booksWithCover: 0,
        booksWithoutCover: 0,
        totalAudios: audiosCount || 0,
        usersByLanguage: {
          pt: langCounts.pt || 0,
          en: langCounts.en || 0,
          es: langCounts.es || 0,
        },
        usersByCountry: countryCounts,
        trafficSources: trafficSources,
      });

      // Get auth users via edge function (requires service role)
      const { data: authUsersResponse, error: authError } = await supabase.functions.invoke(
        'admin-user-operations',
        { body: { operation: 'list_users' } }
      );

      if (authError) {
        console.error('Error fetching auth users:', authError);
        toast.error("Não foi possível carregar os emails dos usuários. Verifique os logs.");
      }

      const authUsers = authUsersResponse?.users || [];
      console.log(`Loaded ${authUsers.length} auth users with emails`);
      
      // Helper function to capitalize first letter of each word
      const capitalizeName = (name: string | null) => {
        if (!name) return "N/A";
        return name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      };

      // Prepare users table data
      const usersWithData = profilesData?.map(profile => {
        const subscription = subscriptionsData?.find(s => s.user_id === profile.id);
        const planType = subscription?.subscription_plans?.type || "free";
        const summariesCount = summariesByUser[profile.id] || 0;
        const authUser = authUsers.find((u: any) => u.id === profile.id);

        return {
          id: profile.id,
          email: authUser?.email || "",
          full_name: capitalizeName(profile.full_name),
          created_at: profile.created_at,
          plan_type: planType,
          summaries_count: summariesCount,
          signup_language: profile.signup_language,
          signup_path: profile.signup_path,
          signup_country: profile.signup_country,
        };
      }) || [];

      // Sort users by created_at date - oldest first (Adrian Cantero always first)
      const sortedUsers = usersWithData.sort((a, b) => {
        if (a.email === 'adrian.cantero1@gmail.com') return -1;
        if (b.email === 'adrian.cantero1@gmail.com') return 1;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });

      setUsers(sortedUsers);

      // Count users with incomplete data
      const incomplete = sortedUsers.filter(u => 
        !u.signup_language || !u.signup_path || !u.signup_country
      ).length;
      setIncompleteUsersCount(incomplete);

      // Calculate user growth (last 30 days) - using Brazil timezone
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const growthData = profilesData
        ?.filter(p => new Date(p.created_at) >= thirtyDaysAgo)
        .reduce((acc: any, curr) => {
          // Convert UTC to Brazil timezone (UTC-3)
          const utcDate = new Date(curr.created_at);
          const brazilDate = new Date(utcDate.getTime() - (3 * 60 * 60 * 1000));
          const dateKey = brazilDate.toISOString().split('T')[0]; // YYYY-MM-DD format
          acc[dateKey] = (acc[dateKey] || 0) + 1;
          return acc;
        }, {}) || {};

      // Sort dates chronologically and format for display
      const growthArray = Object.entries(growthData)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([date, count]) => {
          // Format to dd/MM/yyyy for display
          const [year, month, day] = date.split('-');
          return {
            date: `${day}/${month}`,
            users: count as number,
          };
        });

      setUserGrowth(growthArray);

      // Load catalog stats with summary and cover info
      // Fetch ALL books without pagination limits
      let allBooks: any[] = [];
      let from = 0;
      const pageSize = 1000;
      
      while (true) {
        const { data: booksData, error: booksError } = await supabase
          .from("books")
          .select("lang, cover_url")
          .range(from, from + pageSize - 1);

        if (booksError) {
          console.error("Error fetching books:", booksError);
          break;
        }

        if (!booksData || booksData.length === 0) break;
        
        allBooks = [...allBooks, ...booksData];
        
        if (booksData.length < pageSize) break;
        from += pageSize;
      }

      console.log(`Total de livros carregados: ${allBooks.length}`);

      if (allBooks.length > 0) {
        const langCounts = allBooks.reduce((acc: any, book) => {
          acc[book.lang] = (acc[book.lang] || 0) + 1;
          return acc;
        }, {});

        // Contar livros com resumo na tabela book_summaries
        const { data: catalogSummaries } = await supabase
          .from('book_summaries')
          .select('canonical_title, canonical_author, language')
          .eq('source', 'catalog');

        const booksWithSummary = catalogSummaries?.length || 0;
        const booksWithCover = allBooks.filter(b => b.cover_url !== null && b.cover_url !== '' && b.cover_url !== '/logo-gray.png').length;

        console.log(`Livros com resumo: ${booksWithSummary}, sem resumo: ${allBooks.length - booksWithSummary}`);
        console.log(`Livros com capa: ${booksWithCover}, sem capa: ${allBooks.length - booksWithCover}`);

        setCatalogStats({
          total: allBooks.length,
          pt: langCounts.pt || 0,
          en: langCounts.en || 0,
          es: langCounts.es || 0,
        });

        setStats(prev => prev ? {
          ...prev,
          booksWithSummary,
          booksWithoutSummary: allBooks.length - booksWithSummary,
          booksWithCover,
          booksWithoutCover: allBooks.length - booksWithCover,
        } : null);
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Tem certeza que deseja deletar o usuário ${userEmail}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setDeletingUserId(userId);
    try {
      const { data, error } = await supabase.functions.invoke('admin-user-operations', {
        body: { operation: 'delete_user', userId }
      });
      
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success("Usuário deletado com sucesso");
      await loadAdminData();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erro ao deletar usuário");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleUpgradeToPremium = async (userId: string, userEmail: string, currentPlan: string) => {
    if (currentPlan === "premium") {
      toast.info("Este usuário já possui plano Premium");
      return;
    }

    if (!confirm(`Deseja liberar o plano Premium para ${userEmail}?`)) {
      return;
    }

    setUpgradingUserId(userId);
    try {
      // Get premium plan ID
      const { data: premiumPlan, error: planError } = await supabase
        .from("subscription_plans")
        .select("id")
        .eq("type", "premium")
        .single();

      if (planError) throw planError;

      // Update user subscription via edge function
      const { data, error } = await supabase.functions.invoke('admin-user-operations', {
        body: { operation: 'upgrade_to_premium', userId, planId: premiumPlan.id }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success("Usuário atualizado para Premium!");
      await loadAdminData();
    } catch (error) {
      console.error("Error upgrading user:", error);
      toast.error("Erro ao liberar Premium");
    } finally {
      setUpgradingUserId(null);
    }
  };

  const handleCompleteUserData = async () => {
    if (!confirm(`Deseja completar os dados de ${incompleteUsersCount} usuários com informações faltantes?\n\nSerá feito:\n- Idioma será definido como 'preferred_language' se vazio\n- Origem será definida como '/auth' se vazio\n- País não pode ser inferido e permanecerá vazio`)) {
      return;
    }

    setIsCompletingUserData(true);
    try {
      // Get all profiles with incomplete data
      const { data: profiles, error: fetchError } = await supabase
        .from("profiles")
        .select("id, signup_language, signup_path, signup_country, preferred_language");

      if (fetchError) throw fetchError;

      let updated = 0;
      let errors = 0;

      for (const profile of profiles || []) {
        const updates: any = {};
        let needsUpdate = false;

        // Complete signup_language from preferred_language
        if (!profile.signup_language && profile.preferred_language) {
          updates.signup_language = profile.preferred_language;
          needsUpdate = true;
        }

        // Set default signup_path if empty
        if (!profile.signup_path) {
          updates.signup_path = '/auth';
          needsUpdate = true;
        }

        // Update profile if needed
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", profile.id);

          if (updateError) {
            console.error(`Error updating profile ${profile.id}:`, updateError);
            errors++;
          } else {
            updated++;
          }
        }
      }

      toast.success(`Dados completados!`, {
        description: `${updated} usuários atualizados, ${errors} erros`
      });

      await loadAdminData();
    } catch (error) {
      console.error("Error completing user data:", error);
      toast.error("Erro ao completar dados dos usuários");
    } finally {
      setIsCompletingUserData(false);
    }
  };

  const handleImportGoogleBooks = async () => {
    setImporting(true);
    setImportProgress({ current: 0, total: 100, lang: 'multi' });
    
    toast.info("Importando 100 livros diversificados...", {
      description: "Google Books + Open Library, múltiplas categorias"
    });
    
    try {
      const { data, error } = await supabase.functions.invoke("daily-book-import");

      if (error) throw error;

      if (data?.stats) {
        const { inserted, skipped, errors, target } = data.stats;
        
        setImportProgress({ current: inserted, total: target, lang: 'done' });
        
        if (inserted > 0) {
          toast.success("Importação concluída!", {
            description: `✅ ${inserted} livros importados, ⏭️ ${skipped} já existiam${errors > 0 ? `, ⚠️ ${errors} erros` : ''}`
          });
        } else if (skipped > 0) {
          toast.info("Todos os livros já existiam no catálogo", {
            description: `${skipped} livros encontrados mas já estavam cadastrados`
          });
        } else {
          toast.warning("Nenhum livro foi importado", {
            description: "Tente novamente ou verifique os logs"
          });
        }

        // Show import log if available
        if (data.log && data.log.length > 0) {
          console.log("📋 Import Log:", data.log.join('\n'));
        }
      }

      await loadAdminData();
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Erro ao importar livros", {
        description: error instanceof Error ? error.message : "Falha na importação"
      });
    } finally {
      setImporting(false);
      setTimeout(() => setImportProgress(null), 2000);
    }
  };

  const handlePopulateNewCategories = async () => {
    setImporting(true);
    toast.info("Populando novas categorias...");

    try {
      const { data, error } = await supabase.functions.invoke('populate-new-categories');

      if (error) throw error;

      if (data?.stats) {
        const stats = data.stats;
        toast.success("Novas categorias populadas!", {
          description: `Inseridos: ${stats.inserted}, Pulados: ${stats.skipped}, Erros: ${stats.errors}`
        });
      } else {
        toast.success("Novas categorias populadas com sucesso!");
      }
      
      await loadAdminData();
    } catch (error) {
      console.error("Error populating new categories:", error);
      toast.error("Erro", {
        description: "Falha ao popular novas categorias"
      });
    } finally {
      setImporting(false);
    }
  };

  const handleImportHardcodedCatalog = async () => {
    setImportingCatalog(true);
    
    // Flatten full catalog from code
    const flatBooks = bookCatalog.flatMap(cat =>
      cat.books.map(b => ({
        title: b.title,
        author: b.author,
        lang: b.locale,
        categoryId: cat.id,
      }))
    );

    const totalBooks = flatBooks.length;
    setCatalogImportProgress({ current: 0, total: totalBooks });
    toast.info(`Iniciando importação de ${totalBooks} livros...`);

    try {
      let inserted = 0;
      let skipped = 0;
      const batchSize = 50;
      
      // Process in batches directly from client
      for (let i = 0; i < flatBooks.length; i += batchSize) {
        const batch = flatBooks.slice(i, i + batchSize);
        
        for (const book of batch) {
          // Check if book already exists
          const { data: existing } = await supabase
            .from('books')
            .select('id')
            .eq('title', book.title)
            .eq('author', book.author)
            .eq('lang', book.lang)
            .maybeSingle();

          if (existing) {
            skipped++;
          } else {
            // Insert new book
            const { error: insertError } = await supabase
              .from('books')
              .insert({
                title: book.title,
                author: book.author,
                lang: book.lang,
                category: book.categoryId,
                is_active: true,
                popularity: 0,
              });

            if (!insertError) {
              inserted++;
            }
          }
          
          // Update progress after each book
          setCatalogImportProgress({ current: i + batch.indexOf(book) + 1, total: totalBooks });
        }
      }

      toast.success("Importação do catálogo concluída!", {
        description: `${inserted} importados, ${skipped} já existiam`
      });

      // Reload data
      await loadAdminData();
    } catch (error) {
      console.error("Catalog import error:", error);
      toast.error("Erro", {
        description: "Falha ao importar catálogo hardcoded"
      });
    } finally {
      setImportingCatalog(false);
      setTimeout(() => setCatalogImportProgress({ current: 0, total: 0 }), 2000);
    }
  };

  const checkBooksWithoutSummaries = async () => {
    setIsCheckingSummaries(true);
    try {
      // Contar livros ativos
      const { count: totalBooks, error: countError } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (countError) throw countError;

      // Contar resumos únicos no catálogo
      const { data: summaries, error: summariesError } = await supabase
        .from('book_summaries')
        .select('canonical_title, canonical_author, language')
        .eq('source', 'catalog');

      if (summariesError) throw summariesError;

      // Criar set de livros com resumo (title|lang)
      const booksWithSummary = new Set();
      summaries?.forEach(s => {
        booksWithSummary.add(`${s.canonical_title}|${s.language}`);
      });

      const withoutSummaries = (totalBooks || 0) - booksWithSummary.size;
      setBooksWithoutSummaries(withoutSummaries);
      
      if (withoutSummaries === 0) {
        toast.success("Todos os livros têm resumos!", {
          description: "Não há livros pendentes.",
        });
      } else {
        toast.info(`${withoutSummaries} livros sem resumo`, {
          description: "Clique em 'Gerar Resumos' para processar em lotes.",
        });
      }
    } catch (error) {
      console.error('Error checking summaries:', error);
      toast.error("Erro ao verificar resumos", {
        description: error.message,
      });
    } finally {
      setIsCheckingSummaries(false);
    }
  };

  const handleBatchGenerateSummaries = async () => {
    setBatchGenerating(true);
    
    toast.info("🔄 Gerando resumos em segundo plano...", {
      description: "Este processo pode levar vários minutos. Recarregue a página para ver o progresso.",
    });

    try {
      const { data, error } = await supabase.functions.invoke('batch-generate-summaries', {
        body: { booksWithoutSummaries }
      });

      if (error) throw error;

      toast.success("Geração iniciada com sucesso!", {
        description: "Os resumos estão sendo gerados no servidor. Isso pode levar vários minutos.",
      });
    } catch (error: any) {
      console.error('Error generating summaries:', error);
      toast.error("Erro ao gerar resumos", {
        description: error.message,
      });
      setBatchGenerating(false);
    }
  };

  const checkBooksWithoutCovers = async () => {
    setIsCheckingCovers(true);
    try {
      // First, update books without covers to use the site icon as placeholder
      const { error: updateError } = await supabase
        .from('books')
        .update({ cover_url: '/book-placeholder.png' })
        .eq('is_active', true)
        .is('cover_url', null);

      if (updateError) {
        console.error('Error setting placeholder covers:', updateError);
      }

      // Then count books that still need proper covers
      const { count, error } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('cover_url', '/book-placeholder.png');

      if (error) throw error;
      setBooksWithoutCovers(count || 0);
      
      if (count === 0) {
        toast.success("Todos os livros já têm capas!", {
          description: "Não há livros pendentes para gerar capas.",
        });
      } else {
        toast.info(`${count} livros usando ícone do site como placeholder`, {
          description: "Ícone do site definido até encontrar as capas corretas.",
        });
      }
    } catch (error) {
      console.error('Error checking covers:', error);
      toast.error("Erro ao verificar capas", {
        description: error.message,
      });
    } finally {
      setIsCheckingCovers(false);
    }
  };

  const handleGenerateCovers = async () => {
    if (!booksWithoutCovers || booksWithoutCovers === 0) {
      toast.error("Nenhum livro sem capa", {
        description: "Por favor, verifique os livros sem capa primeiro.",
      });
      return;
    }

    setIsGeneratingCovers(true);
    setCoverGenerateProgress({ current: 0, total: booksWithoutCovers });

    try {
      // Get books without covers
      const { data: books, error: booksError } = await supabase
        .from('books')
        .select('id, title, author, cover_url')
        .eq('is_active', true)
        .or('cover_url.is.null,cover_url.eq./logo-gray.png')
        .order('created_at', { ascending: true });

      if (booksError) throw booksError;
      if (!books || books.length === 0) {
        toast.error("Nenhum livro sem capa", {
          description: "Todos os livros já possuem capas!",
        });
        setIsGeneratingCovers(false);
        return;
      }

      const totalBooks = books.length;
      const results = {
        success: 0,
        failed: 0,
        skipped: 0,
      };

      // Process books in batches
      const batchSize = 10;
      for (let i = 0; i < books.length; i += batchSize) {
        const batch = books.slice(i, i + batchSize);
        
        // Process batch via edge function
        const { data, error } = await supabase.functions.invoke('generate-book-covers', {
          body: { books: batch }
        });

        if (error) {
          console.error('Batch error:', error);
          results.failed += batch.length;
        } else if (data) {
          results.success += data.success || 0;
          results.skipped += data.skipped || 0;
          results.failed += data.failed || 0;
        }

        // Update progress
        setCoverGenerateProgress({ 
          current: Math.min(i + batchSize, totalBooks), 
          total: totalBooks 
        });
      }

      toast.success("Capas atualizadas!", {
        description: `${results.success} capas atualizadas, ${results.skipped} sem alteração, ${results.failed} falhas`,
      });

      // Reset and reload data
      setBooksWithoutCovers(null);
      await loadAdminData();
    } catch (error) {
      console.error('Error updating covers:', error);
      toast.error("Erro", {
        description: "Falha ao atualizar capas",
      });
    } finally {
      setIsGeneratingCovers(false);
      setTimeout(() => setCoverGenerateProgress({ current: 0, total: 0 }), 2000);
    }
  };

  const handleClearAudioCache = async () => {
    setIsClearingAudioCache(true);
    
    try {
      toast.info("Limpando cache de áudios...", {
        description: "Todos os áudios serão regenerados na próxima reprodução"
      });

      const { data, error } = await supabase.functions.invoke("clear-audio-cache");

      if (error) throw error;

      toast.success("Cache limpo com sucesso!", {
        description: `${data.totalDeleted} arquivos de áudio removidos`,
      });

    } catch (error) {
      console.error('Error clearing audio cache:', error);
      toast.error("Erro ao limpar cache", {
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsClearingAudioCache(false);
    }
  };


  const handleValidateBooks = async () => {
    setIsValidatingBooks(true);
    setValidationResults(null);
    
    try {
      toast.info("Iniciando validação de livros...", {
        description: "Isso pode levar alguns minutos"
      });

      // Get count of books without identifiers
      const { count } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .is('isbn', null)
        .is('google_books_id', null)
        .is('asin', null)
        .eq('is_active', true);

      const totalToValidate = count || 0;
      
      if (totalToValidate === 0) {
        toast.success("Todos os livros já possuem identificadores!");
        return;
      }

      const batchSize = 50;
      let offset = 0;
      let allResults = {
        total: 0,
        valid: 0,
        invalid: 0,
        uncertain: 0
      };

      // Process in batches
      while (offset < totalToValidate) {
        const { data, error } = await supabase.functions.invoke("validate-books", {
          body: { 
            limit: batchSize,
            offset: offset
          }
        });

        if (error) {
          console.error('Validation error:', error);
          throw error;
        }

        if (data?.summary) {
          allResults.total += data.summary.total;
          allResults.valid += data.summary.valid;
          allResults.invalid += data.summary.invalid;
          allResults.uncertain += data.summary.uncertain;
          
          setValidationResults({ ...allResults });
          
          toast.info(`Progresso: ${offset + data.summary.total}/${totalToValidate}`, {
            description: `${allResults.valid} válidos, ${allResults.invalid} inválidos`
          });
        }

        offset += batchSize;
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      toast.success("Validação concluída!", {
        description: `${allResults.valid} livros válidos, ${allResults.invalid} inválidos, ${allResults.uncertain} incertos`
      });

      await loadAdminData();
    } catch (error) {
      console.error('Error validating books:', error);
      toast.error("Erro ao validar livros");
    } finally {
      setIsValidatingBooks(false);
    }
  };

  const handleMigrateCategories = async (dryRun = false) => {
    setIsMigratingCategories(true);
    setCategoryMigrationResults(null);

    try {
      console.log(`Starting category migration (dryRun: ${dryRun})...`);
      
      const { data, error } = await supabase.functions.invoke('migrate-book-categories', {
        body: { dryRun }
      });

      if (error) {
        throw error;
      }

      console.log('Migration results:', data);

      if (data?.stats) {
        setCategoryMigrationResults(data.stats);
        
        const message = dryRun
          ? `Preview: ${data.stats.migrated} livros seriam migrados`
          : `Migração concluída: ${data.stats.migrated} livros atualizados`;
        
        toast.success(message, {
          description: `${data.stats.skipped} já estavam corretos, ${data.stats.errors} erros`
        });
      }

      if (!dryRun) {
        await loadAdminData();
      }
    } catch (error) {
      console.error('Error migrating categories:', error);
      toast.error("Erro ao migrar categorias");
    } finally {
      setIsMigratingCategories(false);
    }
  };

  const handleLoadInvalidBooks = async () => {
    setIsLoadingInvalidBooks(true);
    try {
      const { data: books, error } = await supabase
        .from('books')
        .select('id, title, author, lang, isbn, google_books_id, asin')
        .is('isbn', null)
        .is('google_books_id', null)
        .is('asin', null)
        .eq('is_active', true)
        .order('title');

      if (error) throw error;

      setInvalidBooks(books || []);
      setShowInvalidBooksModal(true);
      toast.success(`${books?.length || 0} livros inválidos encontrados para revisão`);
    } catch (error) {
      console.error('Error loading invalid books:', error);
      toast.error("Erro ao carregar livros inválidos");
    } finally {
      setIsLoadingInvalidBooks(false);
    }
  };

  const handleRemoveInvalidBook = async (bookId: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;

      setInvalidBooks(prev => prev.filter(b => b.id !== bookId));
      toast.success("Livro removido definitivamente da base de dados");
      
      await loadAdminData();
    } catch (error) {
      console.error('Error removing book:', error);
      toast.error("Erro ao remover livro");
    }
  };

  const handleKeepInvalidBook = (bookId: string) => {
    setInvalidBooks(prev => prev.filter(b => b.id !== bookId));
    toast.success("Livro mantido no catálogo");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

  const planDistribution = [
    { name: "Free", value: stats?.freeUsers || 0 },
    { name: "Premium", value: stats?.premiumUsers || 0 },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <h1 className="text-2xl md:text-4xl font-bold">Painel Administrativo</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Com pelo menos 1 resumo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Resumos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalSummaries}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planos Premium</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.premiumUsers}</div>
              <p className="text-xs text-muted-foreground">
                de {stats?.totalUsers} usuários ({stats?.totalUsers ? Math.round((stats.premiumUsers / stats.totalUsers) * 100) : 0}% conversão)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Metrics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Métricas das Últimas 24 Horas
            </CardTitle>
            <CardDescription>
              Atividade recente da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Livros Importados</span>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {dailyMetrics?.booksImportedLast24h || 0}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Novos livros adicionados ao catálogo via importação automática
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Resumos Gerados</span>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {dailyMetrics?.summariesGeneratedLast24h || 0}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Resumos criados pelos usuários nas últimas 24 horas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Distribution Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Distribuição de Usuários por Idioma
            </CardTitle>
            <CardDescription>
              Idiomas preferidos pelos usuários da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">🇧🇷 Português</span>
                  <Badge variant="secondary">{stats?.usersByLanguage?.pt || 0}</Badge>
                </div>
                <Progress 
                  value={stats?.totalUsers ? ((stats.usersByLanguage?.pt || 0) / stats.totalUsers) * 100 : 0} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {stats?.totalUsers ? Math.round(((stats.usersByLanguage?.pt || 0) / stats.totalUsers) * 100) : 0}% dos usuários
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">🇬🇧 Inglês</span>
                  <Badge variant="secondary">{stats?.usersByLanguage?.en || 0}</Badge>
                </div>
                <Progress 
                  value={stats?.totalUsers ? ((stats.usersByLanguage?.en || 0) / stats.totalUsers) * 100 : 0} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {stats?.totalUsers ? Math.round(((stats.usersByLanguage?.en || 0) / stats.totalUsers) * 100) : 0}% dos usuários
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">🇪🇸 Espanhol</span>
                  <Badge variant="secondary">{stats?.usersByLanguage?.es || 0}</Badge>
                </div>
                <Progress 
                  value={stats?.totalUsers ? ((stats.usersByLanguage?.es || 0) / stats.totalUsers) * 100 : 0} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {stats?.totalUsers ? Math.round(((stats.usersByLanguage?.es || 0) / stats.totalUsers) * 100) : 0}% dos usuários
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Country Distribution Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Distribuição por País
            </CardTitle>
            <CardDescription>
              Países de origem dos usuários cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.usersByCountry && Object.keys(stats.usersByCountry).length > 0 ? (
              <div className="space-y-4">
                {(() => {
                  // Mapear códigos de país para nomes e consolidar duplicatas
                  const countryNames: Record<string, string> = {
                    'pt-BR': '🇧🇷 Brasil',
                    'pt': '🇧🇷 Brasil',
                    'pt-US': '🇺🇸 Estados Unidos',
                    'en-US': '🇺🇸 Estados Unidos',
                    'en-GB': '🇬🇧 Reino Unido',
                    'en-CA': '🇨🇦 Canadá',
                    'es-MX': '🇲🇽 México',
                    'es-AR': '🇦🇷 Argentina',
                    'es-CL': '🇨🇱 Chile',
                    'es-UY': '🇺🇾 Uruguai',
                    'es-ES': '🇪🇸 Espanha',
                    'pt-PT': '🇵🇹 Portugal',
                    'pt-AO': '🇦🇴 Angola',
                    'pt-MZ': '🇲🇿 Moçambique',
                    'en-IN': '🇮🇳 Índia',
                    'en-PK': '🇵🇰 Paquistão',
                  };

                  // Consolidar contagens por país
                  const consolidatedCountries: Record<string, number> = {};
                  Object.entries(stats.usersByCountry).forEach(([code, count]) => {
                    const countryName = countryNames[code] || `🌍 ${code}`;
                    consolidatedCountries[countryName] = (consolidatedCountries[countryName] || 0) + (count as number);
                  });

                  return Object.entries(consolidatedCountries)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 10)
                    .map(([countryName, count]) => {
                      const percentage = stats.totalUsers ? Math.round(((count as number) / stats.totalUsers) * 100) : 0;
                      
                      return (
                        <div key={countryName} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{countryName}</span>
                            <Badge variant="secondary">{count as number}</Badge>
                          </div>
                          <Progress 
                            value={percentage} 
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground">
                            {percentage}% dos usuários
                          </p>
                        </div>
                      );
                    });
                })()}
                <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                  Total de usuários com país registrado: {Object.values(stats.usersByCountry).reduce((a, b) => a + (b as number), 0)} de {stats.totalUsers}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum dado de país disponível</p>
            )}
          </CardContent>
        </Card>

        {/* Traffic Sources Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Fontes de Tráfego
            </CardTitle>
            <CardDescription>
              De onde os usuários estão vindo para se cadastrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.trafficSources && Object.keys(stats.trafficSources).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(stats.trafficSources)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([source, count]) => {
                    const sourceNames: Record<string, string> = {
                      '/auth': '🔐 Página de Login/Registro',
                      '/': '🏠 Landing Page',
                      '/pt': '🇧🇷 Landing PT',
                      '/en': '🇬🇧 Landing EN',
                      '/es': '🇪🇸 Landing ES',
                      '/home': '🏠 Home',
                      '/explore': '🔍 Explorar',
                    };
                    const displayName = sourceNames[source] || `📄 ${source}`;
                    const percentage = stats.totalUsers ? Math.round(((count as number) / stats.totalUsers) * 100) : 0;
                    
                    return (
                      <div key={source} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{displayName}</span>
                          <Badge variant="secondary">{count as number}</Badge>
                        </div>
                        <Progress 
                          value={percentage} 
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {percentage}% dos cadastros
                        </p>
                      </div>
                    );
                  })}
                <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                  Total de usuários com origem registrada: {Object.values(stats.trafficSources).reduce((a, b) => a + (b as number), 0)} de {stats.totalUsers}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum dado de tráfego disponível</p>
            )}
          </CardContent>
        </Card>

        {/* Premium Conversions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Conversões Premium
            </CardTitle>
            <CardDescription>
              Últimas conversões para o plano Premium via Stripe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              As conversões são processadas automaticamente via webhook do Stripe. Os dados aparecem aqui após a atualização da assinatura do usuário.
            </p>
            <div className="mt-4">
              <p className="text-lg font-semibold">Taxa de Conversão: {stats?.totalUsers ? Math.round((stats.premiumUsers / stats.totalUsers) * 100) : 0}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                {stats?.premiumUsers} de {stats?.totalUsers} usuários converteram para Premium
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Catalog Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Gerenciamento de Catálogo
            </CardTitle>
            <CardDescription>
              Expanda o catálogo com livros do Google Books API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Catalog Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl md:text-2xl font-bold">{catalogStats.total}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">PT</p>
                <p className="text-xl md:text-2xl font-bold">{catalogStats.pt}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">EN</p>
                <p className="text-xl md:text-2xl font-bold">{catalogStats.en}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ES</p>
                <p className="text-xl md:text-2xl font-bold">{catalogStats.es}</p>
              </div>
            </div>

            {/* Summary, Cover, and Audio Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs md:text-sm font-medium">Livros com Resumo</p>
                  <Badge variant="secondary" className="shrink-0">{stats?.booksWithSummary || 0}</Badge>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs md:text-sm text-muted-foreground">Livros sem Resumo</p>
                  <Badge variant="outline" className="shrink-0">{stats?.booksWithoutSummary || 0}</Badge>
                </div>
                <Progress 
                  value={catalogStats.total > 0 ? ((stats?.booksWithSummary || 0) / catalogStats.total) * 100 : 0} 
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs md:text-sm font-medium">Livros com Capa</p>
                  <Badge variant="secondary" className="shrink-0">{stats?.booksWithCover || 0}</Badge>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs md:text-sm text-muted-foreground">Livros sem Capa</p>
                  <Badge variant="outline" className="shrink-0">{stats?.booksWithoutCover || 0}</Badge>
                </div>
                <Progress 
                  value={catalogStats.total > 0 ? ((stats?.booksWithCover || 0) / catalogStats.total) * 100 : 0} 
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs md:text-sm font-medium">Áudios Gerados</p>
                  <Badge variant="secondary" className="shrink-0">{stats?.totalAudios || 0}</Badge>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs md:text-sm text-muted-foreground">Total</p>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {stats?.totalAudios || 0} arquivos
                  </span>
                </div>
                <Progress 
                  value={100} 
                  className="h-2"
                />
              </div>
            </div>

            {/* Import Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <div className="space-y-2">
                  <Button 
                    onClick={handleImportGoogleBooks}
                    disabled={importing}
                    className="w-full h-auto py-2.5 md:py-3 whitespace-normal text-xs md:text-sm"
                    size="lg"
                  >
                    <Download className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
                    <span className="leading-tight">
                      {importing ? "Importando..." : "Importar Google Books"}
                    </span>
                  </Button>
                  {cronSchedules.find(s => s.job_name === 'weekly-google-books-import') && (
                    <CronTimer 
                      nextRunAt={cronSchedules.find(s => s.job_name === 'weekly-google-books-import')!.next_run_at}
                      jobName="weekly-google-books-import"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={handleImportHardcodedCatalog}
                    disabled={importingCatalog}
                    variant="secondary"
                    className="w-full h-auto py-2.5 md:py-3 whitespace-normal text-xs md:text-sm"
                    size="lg"
                  >
                    <Upload className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
                    <span className="leading-tight">
                      {importingCatalog ? "Importando..." : "Importar Catálogo"}
                    </span>
                  </Button>
                  {importingCatalog && catalogImportProgress.total > 0 && (
                    <div className="space-y-1">
                      <Progress value={(catalogImportProgress.current / catalogImportProgress.total) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {catalogImportProgress.current}/{catalogImportProgress.total}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={handlePopulateNewCategories}
                    disabled={importing}
                    variant="outline"
                    className="w-full h-auto py-2.5 md:py-3 whitespace-normal text-xs md:text-sm"
                    size="lg"
                  >
                    <Sparkles className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
                    <span className="leading-tight">
                      {importing ? "Populando..." : "Popular Novas Categorias"}
                    </span>
                  </Button>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    Adiciona ~20 livros para cada nova categoria (Ficção, Romance, Suspense, etc.)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={handleValidateBooks}
                    disabled={isValidatingBooks}
                    variant="outline"
                    className="w-full h-auto py-2.5 md:py-3 whitespace-normal text-xs md:text-sm"
                    size="lg"
                  >
                    <Sparkles className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
                    <span className="leading-tight">
                      {isValidatingBooks ? "Validando..." : "Validar Livros"}
                    </span>
                  </Button>
                  {validationResults && (
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-green-600">Válidos:</span>
                        <span className="font-medium">{validationResults.valid}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-600">Inválidos:</span>
                        <span className="font-medium">{validationResults.invalid}</span>
                      </div>
                    </div>
                  )}
                  {isValidatingBooks && validationResults && (
                    <Progress 
                      value={(validationResults.total / (validationResults.total || 1)) * 100} 
                      className="h-2" 
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => handleMigrateCategories(false)}
                    disabled={isMigratingCategories}
                    variant="outline"
                    className="w-full h-auto py-2.5 md:py-3 whitespace-normal text-xs md:text-sm"
                    size="lg"
                  >
                    <BookOpen className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
                    <span className="leading-tight">
                      {isMigratingCategories ? "Migrando..." : "Migrar Categorias"}
                    </span>
                  </Button>
                  {categoryMigrationResults && (
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Migrados:</span>
                        <span className="font-medium">{categoryMigrationResults.migrated}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Erros:</span>
                        <span className="font-medium text-red-600">{categoryMigrationResults.errors}</span>
                      </div>
                    </div>
                  )}
                  {isMigratingCategories && categoryMigrationResults && (
                    <Progress 
                      value={((categoryMigrationResults.migrated + categoryMigrationResults.skipped) / categoryMigrationResults.totalBooks) * 100} 
                      className="h-2" 
                    />
                  )}
                </div>
                
              </div>

              {/* Check and Generate Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Button 
                    onClick={checkBooksWithoutCovers}
                    disabled={isCheckingCovers}
                    variant="outline"
                    className="w-full h-auto py-2.5 md:py-3 whitespace-normal text-xs md:text-sm"
                  >
                    <ImagePlus className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
                    <span className="leading-tight">
                      {isCheckingCovers ? "Verificando..." : "Verificar Capas"}
                    </span>
                  </Button>
                  {cronSchedules.find(s => s.job_name === 'nightly-cover-check') && (
                    <CronTimer 
                      nextRunAt={cronSchedules.find(s => s.job_name === 'nightly-cover-check')!.next_run_at}
                      jobName="nightly-cover-check"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button 
                      onClick={checkBooksWithoutSummaries}
                      disabled={isCheckingSummaries}
                      variant="outline"
                      className="flex-1 h-auto py-2.5 md:py-3 whitespace-normal text-xs md:text-sm"
                    >
                      <Sparkles className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
                      <span className="leading-tight">
                        {isCheckingSummaries ? "Verificando..." : "Verificar Resumos"}
                      </span>
                    </Button>
                    <Button 
                      onClick={loadAdminData}
                      variant="outline"
                      className="h-auto py-2.5 md:py-3 px-3"
                      title="Atualizar contagem de resumos"
                    >
                      <RefreshCw className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </Button>
                  </div>
                  {cronSchedules.find(s => s.job_name === 'nightly-summary-check') && (
                    <CronTimer 
                      nextRunAt={cronSchedules.find(s => s.job_name === 'nightly-summary-check')!.next_run_at}
                      jobName="nightly-summary-check"
                    />
                  )}
                </div>
              </div>

              {/* Clear Audio Cache Button */}
              <div className="pt-4 border-t">
                <Button 
                  onClick={handleClearAudioCache}
                  disabled={isClearingAudioCache}
                  variant="destructive"
                  className="w-full h-auto py-2.5 md:py-3 whitespace-normal text-xs md:text-sm"
                >
                  <Trash2 className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
                  <span className="leading-tight">
                    {isClearingAudioCache ? "Limpando cache..." : "Limpar Cache de Áudios"}
                  </span>
                </Button>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-2 text-center">
                  Remove todos os áudios em cache. Eles serão regenerados com o texto atualizado.
                </p>
              </div>

              {/* Deduplicate Books Button */}
              <div className="pt-4 border-t">
                <Button 
                  onClick={() => navigate('/deduplicate-books')}
                  variant="outline"
                  className="w-full h-auto py-2.5 md:py-3 whitespace-normal text-xs md:text-sm"
                >
                  <Merge className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
                  <span className="leading-tight">
                    Deduplicar Livros
                  </span>
                </Button>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-2 text-center">
                  Remove livros duplicados do catálogo mantendo apenas uma cópia de cada.
                </p>
              </div>

              {/* Catalog Import Progress */}
              {importingCatalog && catalogImportProgress.total > 0 && (
                <div className="space-y-2 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Importando livros do catálogo...</span>
                    <span className="text-muted-foreground">
                      {catalogImportProgress.current} / {catalogImportProgress.total}
                    </span>
                  </div>
                  <Progress 
                    value={(catalogImportProgress.current / catalogImportProgress.total) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {Math.round((catalogImportProgress.current / catalogImportProgress.total) * 100)}% concluído
                  </p>
                </div>
              )}

              {/* Cover Check Result */}
              {booksWithoutCovers !== null && !isGeneratingCovers && (
                <div className="space-y-3 p-4 rounded-lg border bg-muted/50">
                  <p className="text-lg font-semibold text-center">
                    {booksWithoutCovers === 0 
                      ? "✅ Todos os livros têm capas!"
                      : `📚 ${booksWithoutCovers} livros sem capas encontrados`}
                  </p>
                  
                  {booksWithoutCovers > 0 && (
                    <Button
                      onClick={handleGenerateCovers}
                      disabled={isGeneratingCovers}
                      className="w-full gap-2"
                      size="lg"
                    >
                      <ImagePlus className="w-5 h-5" />
                      Iniciar Geração de Capas
                    </Button>
                  )}
                </div>
              )}

              {/* Cover Generate Progress */}
              {isGeneratingCovers && coverGenerateProgress.total > 0 && (
                <div className="space-y-2 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Gerando capas...</span>
                    <span className="text-muted-foreground">
                      {coverGenerateProgress.current} / {coverGenerateProgress.total}
                    </span>
                  </div>
                  <Progress 
                    value={coverGenerateProgress.total > 0 ? (coverGenerateProgress.current / coverGenerateProgress.total) * 100 : 0} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {coverGenerateProgress.total > 0 ? Math.round((coverGenerateProgress.current / coverGenerateProgress.total) * 100) : 0}% concluído
                  </p>
                </div>
              )}

              {/* Manual Cover Upload and Email Test Section */}
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <ManualCoverUpload />
                <div className="space-y-6">
                  <TestEmailNotification />
                  <TestPremiumEmail />
                  <TestWelcomeEmail />
                  
                  {/* Daily Reminders Test */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        📧 Testar Lembretes Diários
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Enviar lembretes para todos os usuários agora
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => navigate('/admin/test-reminders')}
                        className="w-full gap-2"
                      >
                        Ir para Teste de Lembretes
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Summary Check Result */}
              {booksWithoutSummaries !== null && !batchGenerating && (
                <div className="space-y-3 p-4 rounded-lg border bg-muted/50">
                  <p className="text-lg font-semibold text-center">
                    {booksWithoutSummaries === 0 
                      ? "✅ Todos os livros têm resumos!"
                      : `📚 ${booksWithoutSummaries} livros sem resumos encontrados`}
                  </p>
                  
                  {booksWithoutSummaries > 0 && (
                    <Button
                      onClick={handleBatchGenerateSummaries}
                      disabled={batchGenerating}
                      className="w-full gap-2"
                      size="lg"
                    >
                      <Sparkles className="w-5 h-5" />
                      Iniciar Geração de Resumos
                    </Button>
                  )}
                </div>
              )}

              {/* Batch Generate Progress */}
              {batchGenerating && (
                <div className="space-y-3 p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">🔄 Gerando resumos em segundo plano</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Este processo pode levar vários minutos. Os resumos estão sendo gerados no servidor.
                        Recarregue a página ou clique no botão 🔄 para ver o progresso atualizado.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setBatchGenerating(false);
                      toast.info("Indicador ocultado. A geração continua no servidor.");
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Ocultar este aviso
                  </Button>
                </div>
              )}

              {/* Invalid Books Section */}
              {validationResults && validationResults.invalid > 0 && (
                <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-semibold text-lg">⚠️ {validationResults.invalid} livros inválidos detectados</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Estes livros não foram encontrados no Google Books e podem ter informações incorretas. 
                    Você pode revisá-los manualmente ou removê-los do catálogo.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleLoadInvalidBooks}
                      disabled={isLoadingInvalidBooks}
                    >
                      {isLoadingInvalidBooks ? "Carregando..." : "Revisar Manualmente"}
                    </Button>
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (confirm(`Tem certeza que deseja remover ${validationResults.invalid} livros inválidos?`)) {
                          try {
                            const { error } = await supabase
                              .from('books')
                              .update({ is_active: false })
                              .is('isbn', null)
                              .is('google_books_id', null)
                              .is('asin', null)
                              .eq('is_active', true);

                            if (error) throw error;

                            toast.success("Livros inválidos removidos com sucesso");
                            setValidationResults(null);
                            await loadAdminData();
                          } catch (error) {
                            console.error('Error removing invalid books:', error);
                            toast.error("Erro ao remover livros inválidos");
                          }
                        }
                      }}
                    >
                      Remover Todos Inválidos
                    </Button>
                  </div>
                </div>
              )}

              {/* Google Books Import Progress */}
              {importing && importProgress && (
                <div className="space-y-2 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Importando livros - {importProgress.lang.toUpperCase()}</span>
                    <span className="text-muted-foreground">
                      {importProgress.current} / {importProgress.total}
                    </span>
                  </div>
                  <Progress 
                    value={importProgress.total > 0 ? (importProgress.current / importProgress.total) * 100 : 0} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {importProgress.total > 0 ? Math.round((importProgress.current / importProgress.total) * 100) : 0}% concluído
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Usuários (Últimos 30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Planos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg md:text-xl">Todos os Usuários</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Lista completa de usuários registrados na plataforma
                  {incompleteUsersCount > 0 && (
                    <span className="block sm:inline sm:ml-2 text-amber-600 font-medium text-xs md:text-sm">
                      ({incompleteUsersCount} com dados incompletos)
                    </span>
                  )}
                </CardDescription>
              </div>
              {incompleteUsersCount > 0 && (
                <Button
                  onClick={handleCompleteUserData}
                  disabled={isCompletingUserData}
                  variant="outline"
                  className="gap-1.5 text-xs md:text-sm h-auto py-2 md:py-2.5 w-full sm:w-auto"
                >
                  <RefreshCw className={`h-3 w-3 md:h-4 md:w-4 ${isCompletingUserData ? 'animate-spin' : ''}`} />
                  <span className="whitespace-nowrap">
                    {isCompletingUserData ? 'Completando...' : 'Completar Dados Faltantes'}
                  </span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs md:text-sm">#</TableHead>
                  <TableHead className="text-xs md:text-sm min-w-[120px]">Nome</TableHead>
                  <TableHead className="hidden md:table-cell text-xs md:text-sm">Email</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs md:text-sm">Data de Cadastro</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs md:text-sm">Idioma</TableHead>
                  <TableHead className="hidden xl:table-cell text-xs md:text-sm">Origem</TableHead>
                  <TableHead className="hidden xl:table-cell text-xs md:text-sm">País</TableHead>
                  <TableHead className="text-xs md:text-sm">Plano</TableHead>
                  <TableHead className="text-right text-xs md:text-sm">Resumos</TableHead>
                  <TableHead className="text-right text-xs md:text-sm min-w-[140px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-muted-foreground text-xs md:text-sm">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-xs md:text-sm">{user.full_name}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs md:text-sm">{user.email}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs md:text-sm">
                      {new Date(user.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {user.signup_language ? (
                        <Badge variant="outline" className="text-[10px] md:text-xs">{user.signup_language.toUpperCase()}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {user.signup_path ? (
                        <span className="text-[10px] md:text-xs text-muted-foreground">{user.signup_path}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {user.signup_country ? (
                        <span className="text-[10px] md:text-xs">{user.signup_country}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.plan_type === "premium" ? "default" : "secondary"} className="text-[10px] md:text-xs">
                        {user.plan_type === "premium" ? "Premium" : "Free"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs md:text-sm">{user.summaries_count}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 md:gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpgradeToPremium(user.id, user.email, user.plan_type)}
                          disabled={upgradingUserId === user.id || user.plan_type === "premium"}
                          className="gap-0.5 md:gap-1 text-[10px] md:text-xs h-7 md:h-8 px-2 md:px-3"
                        >
                          <Crown className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          <span className="hidden sm:inline">
                            {user.plan_type === "premium" ? "Premium" : "Liberar"}
                          </span>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          disabled={deletingUserId === user.id}
                          className="gap-0.5 md:gap-1 text-[10px] md:text-xs h-7 md:h-8 px-2 md:px-3"
                        >
                          <UserX className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          <span className="hidden sm:inline">Deletar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Invalid Books Review Modal */}
        {showInvalidBooksModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Revisar Livros Inválidos ({invalidBooks.length})</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowInvalidBooksModal(false)}
                  >
                    ✕
                  </Button>
                </CardTitle>
                <CardDescription>
                  Revise cada livro e decida se deseja mantê-lo ou removê-lo do catálogo
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-y-auto flex-1">
                {invalidBooks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    ✅ Todos os livros foram revisados!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invalidBooks.map((book) => (
                      <div 
                        key={book.id}
                        className="p-4 border rounded-lg bg-muted/50 flex items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Autor: {book.author} | Idioma: {book.lang.toUpperCase()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleKeepInvalidBook(book.id)}
                          >
                            Manter
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveInvalidBook(book.id)}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

import { useEffect, useState } from "react";
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
import { Users, FileText, TrendingUp, Crown, Download, BookOpen, ImagePlus, Sparkles, Upload } from "lucide-react";
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
}

interface UserData {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  plan_type: string;
  summaries_count: number;
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
  const [importProgress, setImportProgress] = useState<string[]>([]);
  const [cronSchedules, setCronSchedules] = useState<Array<{
    job_name: string;
    description: string;
    next_run_at: string;
  }>>([]);

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
      await loadAdminData();
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

  const loadAdminData = async () => {
    try {
      // Get all users with their profiles and subscription info
      const { data: profilesData } = await supabase
        .from("profiles")
        .select(`
          id,
          email,
          full_name,
          created_at
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
      });

      // Prepare users table data
      const usersWithData = profilesData?.map(profile => {
        const subscription = subscriptionsData?.find(s => s.user_id === profile.id);
        const planType = subscription?.subscription_plans?.type || "free";
        const summariesCount = summariesByUser[profile.id] || 0;

        return {
          id: profile.id,
          email: profile.email || "",
          full_name: profile.full_name || "N/A",
          created_at: profile.created_at,
          plan_type: planType,
          summaries_count: summariesCount,
        };
      }) || [];

      setUsers(usersWithData);

      // Calculate user growth (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const growthData = profilesData
        ?.filter(p => new Date(p.created_at) >= thirtyDaysAgo)
        .reduce((acc: any, curr) => {
          const date = new Date(curr.created_at).toLocaleDateString("pt-BR");
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {}) || {};

      const growthArray = Object.entries(growthData).map(([date, count]) => ({
        date,
        users: count as number,
      }));

      setUserGrowth(growthArray);

      // Load catalog stats with summary and cover info
      // Fetch ALL books without pagination limits
      let allBooks: any[] = [];
      let from = 0;
      const pageSize = 1000;
      
      while (true) {
        const { data: booksData, error: booksError } = await supabase
          .from("books")
          .select("lang, summary, cover_url")
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

        const booksWithSummary = allBooks.filter(b => b.summary !== null && b.summary !== '').length;
        const booksWithCover = allBooks.filter(b => b.cover_url !== null && b.cover_url !== '').length;

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

  const handleImportGoogleBooks = async () => {
    setImporting(true);
    setImportProgress(["Iniciando importação do Google Books..."]);

    try {
      const { data, error } = await supabase.functions.invoke("import-google-books", {
        body: { lang: "all", target: 100 }
      });

      if (error) {
        toast.error("Erro na importação", {
          description: error.message
        });
        return;
      }

      if (data?.log) {
        setImportProgress(data.log);
      }

      toast.success("Importação concluída!", {
        description: `${data.stats.inserted} livros importados, ${data.stats.skipped} pulados`
      });

      // Reload data
      await loadAdminData();
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Erro", {
        description: "Falha ao importar livros"
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
      const { count, error } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .is('summary', null);

      if (error) throw error;
      setBooksWithoutSummaries(count || 0);
      
      if (count === 0) {
        toast.success("Todos os livros já têm resumos!", {
          description: "Não há livros pendentes para gerar resumos.",
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
    if (!booksWithoutSummaries || booksWithoutSummaries === 0) {
      toast.error("Nenhum livro sem resumo", {
        description: "Por favor, verifique os livros sem resumo primeiro.",
      });
      return;
    }

    setBatchGenerating(true);
    setBatchGenerateProgress({ current: 0, total: booksWithoutSummaries });

    try {
      // Get books without summaries
      const { data: books, error: booksError } = await supabase
        .from('books')
        .select('id, title, author, lang')
        .eq('is_active', true)
        .is('summary', null)
        .order('created_at', { ascending: true })
        .limit(booksWithoutSummaries);

      if (booksError) throw booksError;
      if (!books || books.length === 0) {
        toast.error("Nenhum livro sem resumo", {
          description: "Todos os livros já possuem resumos!",
        });
        setBatchGenerating(false);
        return;
      }

      toast.info(`Iniciando geração de ${books.length} resumos...`);

      let successCount = 0;
      let errorCount = 0;

      // Process books one by one (AI generation is slow, so we process sequentially)
      for (let i = 0; i < books.length; i++) {
        const book = books[i];
        
        try {
          console.log(`Generating summary ${i + 1}/${books.length}: ${book.title}`);
          
          // Call individual generate-summary function
          const { data, error } = await supabase.functions.invoke('generate-summary', {
            body: { 
              userTitle: book.title,
              userAuthor: book.author,
              locale: book.lang
            }
          });

          if (error) {
            console.error(`Error generating summary for ${book.title}:`, error);
            errorCount++;
          } else if (data?.summary) {
            successCount++;
          } else {
            errorCount++;
          }

          // Update progress after each book
          setBatchGenerateProgress({ current: i + 1, total: books.length });

          // Small delay to avoid overwhelming the API
          if (i < books.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }

        } catch (error) {
          console.error(`Error processing ${book.title}:`, error);
          errorCount++;
        }
      }

      toast.success("Geração concluída!", {
        description: `${successCount} resumos gerados, ${errorCount} erros`
      });

      // Reset and reload data
      setBooksWithoutSummaries(null);
      await loadAdminData();
    } catch (error) {
      console.error("Batch generate error:", error);
      toast.error("Erro", {
        description: "Falha ao gerar resumos automaticamente"
      });
    } finally {
      setBatchGenerating(false);
      setTimeout(() => setBatchGenerateProgress({ current: 0, total: 0 }), 2000);
    }
  };

  const checkBooksWithoutCovers = async () => {
    setIsCheckingCovers(true);
    try {
      const { count, error } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .or('cover_url.is.null,cover_url.eq./logo-gray.png');

      if (error) throw error;
      setBooksWithoutCovers(count || 0);
      
      if (count === 0) {
        toast.success("Todos os livros já têm capas!", {
          description: "Não há livros pendentes para gerar capas.",
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
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <Crown className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Painel Administrativo</h1>
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
                de {stats?.totalUsers} usuários
              </p>
            </CardContent>
          </Card>
        </div>

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
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{catalogStats.total}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">PT</p>
                <p className="text-2xl font-bold">{catalogStats.pt}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">EN</p>
                <p className="text-2xl font-bold">{catalogStats.en}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ES</p>
                <p className="text-2xl font-bold">{catalogStats.es}</p>
              </div>
            </div>

            {/* Summary and Cover Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Livros com Resumo</p>
                  <Badge variant="secondary">{stats?.booksWithSummary || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Livros sem Resumo</p>
                  <Badge variant="outline">{stats?.booksWithoutSummary || 0}</Badge>
                </div>
                <Progress 
                  value={catalogStats.total > 0 ? ((stats?.booksWithSummary || 0) / catalogStats.total) * 100 : 0} 
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Livros com Capa</p>
                  <Badge variant="secondary">{stats?.booksWithCover || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Livros sem Capa</p>
                  <Badge variant="outline">{stats?.booksWithoutCover || 0}</Badge>
                </div>
                <Progress 
                  value={catalogStats.total > 0 ? ((stats?.booksWithCover || 0) / catalogStats.total) * 100 : 0} 
                  className="h-2"
                />
              </div>
            </div>

            {/* Import Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Button 
                    onClick={handleImportGoogleBooks}
                    disabled={importing}
                    className="w-full h-auto py-3 whitespace-normal"
                    size="lg"
                  >
                    <Download className="mr-2 h-4 w-4 shrink-0" />
                    <span className="text-sm leading-tight">
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
                    className="w-full"
                    size="lg"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {importingCatalog ? "Importando..." : "Importar Catálogo"}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={checkBooksWithoutCovers}
                    disabled={isCheckingCovers || isGeneratingCovers}
                    variant="secondary"
                    className="w-full"
                    size="lg"
                  >
                    <ImagePlus className="mr-2 h-4 w-4" />
                    {isCheckingCovers ? "Verificando..." : "Verificar Capas"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={checkBooksWithoutSummaries}
                    disabled={isCheckingSummaries || batchGenerating}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isCheckingSummaries ? "Verificando..." : "Verificar Resumos"}
                  </Button>
                  {cronSchedules.find(s => s.job_name === 'daily-summary-generation') && (
                    <CronTimer 
                      nextRunAt={cronSchedules.find(s => s.job_name === 'daily-summary-generation')!.next_run_at}
                      jobName="daily-summary-generation"
                    />
                  )}
                </div>
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
              {batchGenerating && batchGenerateProgress.total > 0 && (
                <div className="space-y-2 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Gerando resumos automaticamente...</span>
                    <span className="text-muted-foreground">
                      {batchGenerateProgress.current} / {batchGenerateProgress.total}
                    </span>
                  </div>
                  <Progress 
                    value={batchGenerateProgress.total > 0 ? (batchGenerateProgress.current / batchGenerateProgress.total) * 100 : 0} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {batchGenerateProgress.total > 0 ? Math.round((batchGenerateProgress.current / batchGenerateProgress.total) * 100) : 0}% concluído
                  </p>
                </div>
              )}

              {/* Import Progress */}
              {importing && (
                <div className="space-y-2">
                  <Progress value={33} className="w-full" />
                  <div className="text-sm text-muted-foreground space-y-1 max-h-32 overflow-y-auto">
                    {importProgress.map((log, i) => (
                      <p key={i}>{log}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Import Log */}
              {!importing && importProgress.length > 0 && (
                <div className="rounded-lg border bg-muted p-4 space-y-1 max-h-48 overflow-y-auto">
                  {importProgress.map((log, i) => (
                    <p key={i} className="text-sm">{log}</p>
                  ))}
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
            <CardTitle>Todos os Usuários</CardTitle>
            <CardDescription>
              Lista completa de usuários registrados na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead className="text-right">Resumos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.plan_type === "premium" ? "default" : "secondary"}>
                        {user.plan_type === "premium" ? "Premium" : "Free"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{user.summaries_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;

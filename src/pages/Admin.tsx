import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
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
import { Users, FileText, TrendingUp, Crown, Download, BookOpen, ImagePlus, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSummaries: number;
  freeUsers: number;
  premiumUsers: number;
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
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [importProgress, setImportProgress] = useState<string[]>([]);

  useEffect(() => {
    checkAdminAccess();
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

      // Load catalog stats
      const { data: booksData } = await supabase
        .from("books")
        .select("lang");

      if (booksData) {
        const langCounts = booksData.reduce((acc: any, book) => {
          acc[book.lang] = (acc[book.lang] || 0) + 1;
          return acc;
        }, {});

        setCatalogStats({
          total: booksData.length,
          pt: langCounts.pt || 0,
          en: langCounts.en || 0,
          es: langCounts.es || 0,
        });
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

  const handleBatchGenerateSummaries = async () => {
    setBatchGenerating(true);
    toast.info("Iniciando geração automática de resumos...");

    try {
      const { data, error } = await supabase.functions.invoke("batch-generate-summaries");

      if (error) {
        toast.error("Erro na geração de resumos", {
          description: error.message
        });
        return;
      }

      toast.success("Geração concluída!", {
        description: `${data.processed} resumos gerados com sucesso`
      });

      if (data.errors > 0) {
        toast.warning(`${data.errors} livros apresentaram erros na geração`);
      }

      // Reload data
      await loadAdminData();
    } catch (error) {
      console.error("Batch generate error:", error);
      toast.error("Erro", {
        description: "Falha ao gerar resumos automaticamente"
      });
    } finally {
      setBatchGenerating(false);
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

            {/* Import Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Button 
                  onClick={handleImportGoogleBooks}
                  disabled={importing}
                  className="w-full"
                  size="lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {importing ? "Importando..." : "Importar 300 Livros"}
                </Button>
                
                <Button 
                  onClick={() => navigate("/generate-covers")}
                  variant="secondary"
                  className="w-full"
                  size="lg"
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Gerar Capas dos Livros
                </Button>

                <Button 
                  onClick={handleBatchGenerateSummaries}
                  disabled={batchGenerating}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {batchGenerating ? "Gerando..." : "Gerar Resumos Auto"}
                </Button>
              </div>

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

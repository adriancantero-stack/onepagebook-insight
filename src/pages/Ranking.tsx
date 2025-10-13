import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FloatingHeader } from '@/components/FloatingHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LevelBadge } from '@/components/LevelBadge';
import { Trophy, TrendingUp, Globe, Calendar, Medal, Crown, Loader2, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface RankingUser {
  id: string;
  full_name: string;
  photo_url: string | null;
  xp: number;
  level: string;
  total_books_read: number;
  total_summaries_generated: number;
  streak_days: number;
  preferred_language: string;
}

export default function Ranking() {
  const { t, i18n } = useTranslation();
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'global' | 'language' | 'weekly'>('global');
  const [currentUser, setCurrentUser] = useState<RankingUser | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadRankings();
  }, [filter, i18n.language]);

  const loadRankings = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('profiles')
        .select('id, full_name, photo_url, xp, level, total_books_read, total_summaries_generated, streak_days, preferred_language')
        .order('xp', { ascending: false })
        .limit(100);

      // Apply language filter
      if (filter === 'language') {
        query = query.eq('preferred_language', i18n.language);
      }

      // For weekly, we'd need to filter by created_at in the last 7 days
      // This is a simplified version
      if (filter === 'weekly') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        // Note: This requires a created_at or last_activity field
      }

      const { data, error } = await query;

      if (error) throw error;

      setRankings(data || []);

      // Find current user's rank
      if (user && data) {
        const userIndex = data.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          setUserRank(userIndex + 1);
          setCurrentUser(data[userIndex]);
        } else {
          // User not in top 100, fetch their data separately
          const { data: userData } = await supabase
            .from('profiles')
            .select('id, full_name, photo_url, xp, level, total_books_read, total_summaries_generated, streak_days, preferred_language')
            .eq('id', user.id)
            .single();
          
          if (userData) {
            setCurrentUser(userData);
            // Calculate actual rank
            const { count } = await supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true })
              .gt('xp', userData.xp);
            setUserRank((count || 0) + 1);
          }
        }
      }
    } catch (error) {
      console.error('Error loading rankings:', error);
      toast({
        title: t('toast.error'),
        description: t('ranking.errorLoading'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareRanking = async () => {
    if (!currentUser || !userRank) return;

    const text = `${t('ranking.shareText', { 
      rank: userRank, 
      xp: currentUser.xp,
      level: t(`levels.${currentUser.level}`)
    })}\n\n🚀 ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          text,
          url: window.location.origin
        });
      } catch (error) {
        // User cancelled or error
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('ranking.shared'),
      description: t('ranking.sharedDesc')
    });
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" fill="currentColor" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" fill="currentColor" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" fill="currentColor" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-primary to-accent rounded-full mb-4 shadow-lg">
            <Trophy className="h-12 w-12 text-primary-foreground" />
          </div>
          
          <h1 className="text-4xl font-bold font-poppins text-foreground mb-2">
            {t('ranking.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('ranking.subtitle')}
          </p>
        </div>

        {/* Current User Card */}
        {currentUser && userRank && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarImage src={currentUser.photo_url || ''} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {currentUser.full_name?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-card rounded-full px-2 py-0.5 border border-primary">
                    <span className="text-xs font-bold text-primary">#{userRank}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground">{currentUser.full_name || t('ranking.you')}</h3>
                  <LevelBadge level={currentUser.level} xp={currentUser.xp} size="sm" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentUser.xp.toLocaleString()} XP · {currentUser.total_summaries_generated} {t('ranking.summaries')}
                  </p>
                </div>
              </div>

              <Button
                onClick={shareRanking}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                {t('ranking.share')}
              </Button>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="global" className="gap-1 sm:gap-2 flex-col sm:flex-row py-2 sm:py-2.5">
              <Globe className="h-4 w-4" />
              <span className="text-xs sm:text-sm">{t('ranking.global')}</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="gap-1 sm:gap-2 flex-col sm:flex-row py-2 sm:py-2.5">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs sm:text-sm">{t('ranking.byLanguage')}</span>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="gap-1 sm:gap-2 flex-col sm:flex-row py-2 sm:py-2.5">
              <Calendar className="h-4 w-4" />
              <span className="text-xs sm:text-sm">{t('ranking.weekly')}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Rankings List */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : rankings.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">{t('ranking.noData')}</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {rankings.map((user, index) => {
              const rank = index + 1;
              const isCurrentUser = currentUser?.id === user.id;
              
              return (
                <Card 
                  key={user.id}
                  className={`p-3 sm:p-4 transition-all hover:shadow-md ${
                    isCurrentUser ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-4">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-8 sm:w-12 flex-shrink-0">
                      {getRankIcon(rank) || (
                        <span className="text-sm sm:text-lg font-bold text-muted-foreground">
                          #{rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                      <AvatarImage src={user.photo_url || ''} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm sm:text-base">
                        {user.full_name?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 min-w-0 mr-2">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                          {user.full_name || t('ranking.anonymous')}
                        </h3>
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-[10px] sm:text-xs px-1 py-0 sm:px-2 sm:py-0.5 flex-shrink-0">
                            {t('ranking.you')}
                          </Badge>
                        )}
                      </div>
                      <LevelBadge level={user.level} xp={user.xp} size="sm" showIcon={false} />
                    </div>

                    {/* Stats */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-sm sm:text-base text-foreground whitespace-nowrap">
                        {user.xp.toLocaleString()} XP
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                        {user.total_summaries_generated} {t('ranking.summaries')}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
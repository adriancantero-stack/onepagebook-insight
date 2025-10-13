import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FloatingHeader } from '@/components/FloatingHeader';
import { XPBar } from '@/components/XPBar';
import { LevelBadge } from '@/components/LevelBadge';
import { ProfileStats } from '@/components/ProfileStats';
import { AchievementCard } from '@/components/AchievementCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trophy, Settings, Crown } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { toast } from '@/hooks/use-toast';

export default function Profile() {
  const navigate = useNavigate();
  const { userAchievements, isLoading: achievementsLoading } = useAchievements();
  
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Load subscription
      const { data: subData } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      setSubscription(subData);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Erro ao carregar perfil',
        description: 'Tente novamente mais tarde',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isPremium = subscription?.subscription_plans?.type === 'premium';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-lilac-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-lilac-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-lilac-50 flex items-center justify-center">
        <p>Perfil não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lilac-50">
      <FloatingHeader />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-poppins text-foreground mb-2">
            Meu Perfil
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso e conquistas
          </p>
        </div>

        {/* Main Profile Card */}
        <Card className="max-w-4xl mx-auto mb-8 bg-white/70 backdrop-blur-md border-lilac-200 shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-lilac-200 shadow-lg">
                  <AvatarImage src={profile.photo_url} />
                  <AvatarFallback className="bg-gradient-to-br from-lilac-400 to-purple-500 text-white text-2xl font-poppins">
                    {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                {isPremium && (
                  <div className="absolute -bottom-1 -right-1 bg-premium-gold rounded-full p-1.5 shadow-lg">
                    <Crown className="h-4 w-4 text-gray-900" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h2 className="text-2xl font-bold font-poppins text-foreground">
                      {profile.full_name || 'Usuário'}
                    </h2>
                    {isPremium && (
                      <Badge className="bg-gradient-to-r from-premium-gold to-yellow-400 text-gray-900 border-0">
                        👑 Premium
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <LevelBadge level={profile.level || 'Beginner'} xp={profile.xp || 0} />
                  </div>
                </div>

                {/* XP Bar */}
                <XPBar currentXP={profile.xp || 0} level={profile.level || 'Beginner'} />

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/achievements')}
                    className="border-lilac-200 hover:bg-lilac-50"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Ver Conquistas
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/settings')}
                    className="border-lilac-200 hover:bg-lilac-50"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mb-8">
          <ProfileStats
            totalBooksRead={profile.total_books_read || 0}
            totalSummariesGenerated={profile.total_summaries_generated || 0}
            streakDays={profile.streak_days || 0}
            memberSince={profile.created_at}
          />
        </div>

        {/* Recent Achievements */}
        <Card className="max-w-4xl mx-auto bg-white/70 backdrop-blur-md border-lilac-200">
          <CardHeader>
            <CardTitle className="font-poppins flex items-center gap-2">
              <Trophy className="h-5 w-5 text-premium-gold" />
              Conquistas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievementsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-lilac-500" />
              </div>
            ) : userAchievements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma conquista desbloqueada ainda</p>
                <p className="text-sm mt-1">Complete seu primeiro resumo para começar!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userAchievements.slice(0, 4).map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    {...achievement}
                    unlocked={true}
                  />
                ))}
              </div>
            )}

            {userAchievements.length > 4 && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => navigate('/achievements')}
                  className="border-lilac-200 hover:bg-lilac-50"
                >
                  Ver Todas as Conquistas
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        title: t('profile.errorLoading'),
        description: t('profile.tryAgainLater'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isPremium = subscription?.subscription_plans?.type === 'premium';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">{t('profile.profileNotFound')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 pt-20 sm:pt-24">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-poppins text-foreground mb-2">
            {t('profile.title')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t('profile.subtitle')}
          </p>
        </div>

        {/* Main Profile Card */}
        <Card className="max-w-4xl mx-auto mb-6 sm:mb-8 bg-white/70 backdrop-blur-md border-lilac-200 shadow-xl">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-lilac-200 shadow-lg">
                  <AvatarImage src={profile.photo_url} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-lilac-400 to-purple-500 text-white text-xl sm:text-2xl font-poppins">
                    {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                {isPremium && (
                  <div className="absolute -bottom-1 -right-1 bg-premium-gold rounded-full p-1.5 shadow-lg">
                    <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-900" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 w-full text-center space-y-3 sm:space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold font-poppins text-foreground">
                      {profile.nickname || profile.full_name || t('profile.user')}
                    </h2>
                    {isPremium && (
                      <Badge className="bg-gradient-to-r from-premium-gold to-yellow-400 text-gray-900 border-0 text-xs sm:text-sm">
                        👑 {t('profile.premium')}
                      </Badge>
                    )}
                  </div>
                  
                  {profile.nickname && profile.full_name && (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {profile.full_name}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-center gap-2">
                    <LevelBadge level={profile.level || 'Beginner'} xp={profile.xp || 0} />
                  </div>
                </div>

                {/* XP Bar */}
                <XPBar currentXP={profile.xp || 0} level={profile.level || 'Beginner'} />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/achievements')}
                    className="border-lilac-200 hover:bg-lilac-50 w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    {t('profile.viewAchievements')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/settings')}
                    className="border-lilac-200 hover:bg-lilac-50 w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    {t('profile.settings')}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
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
              {t('profile.recentAchievements')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievementsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-lilac-500" />
              </div>
            ) : userAchievements.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-muted-foreground">
                <p className="text-sm sm:text-base">{t('profile.noAchievements')}</p>
                <p className="text-xs sm:text-sm mt-1">{t('profile.completeFirst')}</p>
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
                  {t('profile.viewAllAchievements')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FloatingHeader } from '@/components/FloatingHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const PRESET_AVATARS = [
  { id: 'funny-1', url: '/avatars/funny-1.png', category: 'funny' },
  { id: 'funny-2', url: '/avatars/funny-2.png', category: 'funny' },
  { id: 'funny-3', url: '/avatars/funny-3.png', category: 'funny' },
  { id: 'intellectual-1', url: '/avatars/intellectual-1.png', category: 'intellectual' },
  { id: 'intellectual-2', url: '/avatars/intellectual-2.png', category: 'intellectual' },
  { id: 'intellectual-3', url: '/avatars/intellectual-3.png', category: 'intellectual' },
];

export default function Settings() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

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

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O tamanho máximo é 2MB',
        variant: 'destructive'
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Tipo de arquivo inválido',
        description: 'Por favor, envie uma imagem',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photo_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, photo_url: publicUrl });
      
      toast({
        title: 'Foto atualizada!',
        description: 'Sua foto de perfil foi atualizada com sucesso',
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Erro ao enviar foto',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePresetAvatarSelect = async (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const fullUrl = window.location.origin + avatarUrl;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photo_url: fullUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, photo_url: fullUrl });
      
      toast({
        title: 'Avatar atualizado!',
        description: 'Seu avatar foi atualizado com sucesso',
      });
    } catch (error: any) {
      console.error('Error updating avatar:', error);
      toast({
        title: 'Erro ao atualizar avatar',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-lilac-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-lilac-500" />
      </div>
    );
  }

  const funnyAvatars = PRESET_AVATARS.filter(a => a.category === 'funny');
  const intellectualAvatars = PRESET_AVATARS.filter(a => a.category === 'intellectual');

  return (
    <div className="min-h-screen bg-lilac-50">
      <FloatingHeader />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/profile')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Perfil
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-poppins text-foreground mb-2">
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Personalize seu perfil
          </p>
        </div>

        <Card className="bg-white/70 backdrop-blur-md border-lilac-200 shadow-xl">
          <CardHeader>
            <CardTitle className="font-poppins">Foto de Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Avatar */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32 border-4 border-lilac-200 shadow-lg">
                <AvatarImage src={profile?.photo_url} />
                <AvatarFallback className="bg-gradient-to-br from-lilac-400 to-purple-500 text-white text-4xl font-poppins">
                  {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Upload Own Photo */}
            <div className="space-y-2">
              <Label htmlFor="photo-upload" className="text-base font-medium">
                Enviar sua própria foto
              </Label>
              <div className="flex gap-2">
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="flex-1"
                />
                <Button 
                  type="button"
                  disabled={isUploading}
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  className="bg-lilac-500 hover:bg-lilac-600"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Tamanho máximo: 2MB. Formatos: JPG, PNG, WEBP
              </p>
            </div>

            {/* Funny Avatars */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Avatares Engraçados</Label>
              <div className="grid grid-cols-3 gap-4">
                {funnyAvatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handlePresetAvatarSelect(avatar.url)}
                    disabled={isUploading}
                    className={`relative group transition-all ${
                      selectedAvatar === avatar.url 
                        ? 'ring-4 ring-lilac-500 rounded-full' 
                        : 'hover:ring-2 hover:ring-lilac-300 rounded-full'
                    }`}
                  >
                    <Avatar className="h-24 w-24 border-2 border-lilac-200">
                      <AvatarImage src={avatar.url} />
                    </Avatar>
                    {isUploading && selectedAvatar === avatar.url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Intellectual Avatars */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Avatares Intelectuais</Label>
              <div className="grid grid-cols-3 gap-4">
                {intellectualAvatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handlePresetAvatarSelect(avatar.url)}
                    disabled={isUploading}
                    className={`relative group transition-all ${
                      selectedAvatar === avatar.url 
                        ? 'ring-4 ring-lilac-500 rounded-full' 
                        : 'hover:ring-2 hover:ring-lilac-300 rounded-full'
                    }`}
                  >
                    <Avatar className="h-24 w-24 border-2 border-lilac-200">
                      <AvatarImage src={avatar.url} />
                    </Avatar>
                    {isUploading && selectedAvatar === avatar.url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

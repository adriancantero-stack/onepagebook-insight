import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  audioUrl: string;
  onEnded?: () => void;
}

const AudioPlayer = ({ audioUrl, onEnded }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Reset state when audioUrl changes (new summary loaded)
  useEffect(() => {
    console.log('🎵 [AudioPlayer] audioUrl changed:', audioUrl);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, [audioUrl]);

  // Setup audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio) setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      if (audio) setDuration(audio.duration);
    };

    const handleEnded = () => {
      console.log('🎵 [AudioPlayer] Audio playback finished');
      setIsPlaying(false);
      setCurrentTime(0);
      
      // Play completion sound
      const completionSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKzn77dnHQU7k9nyz3krBSl+zPLaizsKGGS56+mjUhELTKXh8bllHAU2jdXzx3YpBSh+0fHajzsKHGe88OWYUxELTKjj8rpnHwU7k9rzzXgrBSp/0fHbizsKHWi98OScUhEMTKrk8btoHwU8lNvzzXkrBSp/0vHbizsKH2q+7+OXUBEMTazl8LlnHwU9ltzzz3orBSuA0/HcjDsKIGy/7+OWTxEMTa/m77dnHwU+l970z3srBSuB1PHcjT0KImzA7+KUTBEMTrDm77dmHwU/mN/00H0tBSyC1fDcjT0KJG7C7+GSTBENTrHm7rVmHwVAmd/00H0tBSyC1vDdjj0KJXDC7+CRSxENT7Lm7rVmIAVBm+H00H0tBS2D1/DdjT0KJXHD7t+PSxEOULPm7bRlIAVCnOH00H0tBS2E1/DdjT0KJnHE7t6PSxEOULTm7LNkIAVDnOL00X4uBS2E2PDejj0KJ3LE7t6OSxEOUbXm67NkIQVDnuL00X4uBS6E2fDejj0KKHLF7t2OSxEOUrXm67JjIQVEn+L00X4uBS6F2fDejj4KKXLG7tyNShEOUrbl6rJjIgVEoOL00n4vBS6F2vDfjj4KKnPG7duNShEPU7jl6bFjIgVFoeP00n4vBS+G2vDfjj4KK3PH7duMShEPVLjk6LBiIgVGoOP00n4vBTCG2/DfjT4KLHbI7NqKSREPVbnk5q5hIgVHouP00n4vBTCH3PDfjT8KLXXK69eISREQV7rj5K1gIQVIpOT00n8wBTCH3fDfjT8KLnbL69eHSBEQWLvj46xfIQVJpeT01H8wBTGI3fDgjT8KL3fM6tWGRxERWbzj4apdIQVKpuX01H8wBTGJ3vDgjUAKMHnN6dSEBhERWr3j4KpcIgVLp+X01IAxBTKK3/Dgj0ALMXrO6NK9AxETW8Hj3qhbIgVMqOb01YAyBTKL4PDhkUALM3vP583xwEFGtM6H2qZZIQVNqef01oAzBTOL4fDhkUALNHzQ55fLZFBg03pOJjZqv92oWh8FTazo1YA0BTOM4vDhkkELNn3R5o2/Vh5V2qlsJjpr0OGlXCEGT63o1oE1BTSO4/DhkkILN37S5Y2+Uh5V3KtsJzprzuCjXSIGUK7p1oE2BTSP5PDhkkILOIDT5oy9UR5W3qxsKDps0N+iXiIGUbDp14I3BTSP5fDhkkQLOoHU5ou8UB5X4KxsKDpu0t+hXiMGU7Dp2II4BTUP5vDhk0QLO4LV5oq8Tx5Y4qxsKTpu1d6gXyMGVbHp2II5BTWQ5/Dik0ULPIPWy4e5TR5Z5KxsKjtv1t6fYCQGVrHp2II6BTWR6PDik0ULPIPXy4e5Sx5a5KxsKztw1t2eYCQGV7Lq2YI7BTWS6fDik0YLPYTYy4a4Sh5b5axsLD1x2NudYSUGWLLq2oI8BTWT6vDikkcLPoXZyoW4SR5c5qxsLT1y2dueYSUGWbPq24M9BTWS6/DjlEcLPoXay4S3SR5d56xsLj1z2tufYiYGWrPr24M+BTWT7PDjlEgLQIbbz4G3SR5e6KxsLz1029ygYyYGW7Tr3IQ/BTWS7fDjlUgLQYfcy4C2SR5f6axsMD522tyhYycGXLTs3YRABTaS7vDklUkLQojdy321SR5g66xsMT532tyjZCcGXbXs3oRBBTaS7/DklUoLQ4neyoC1SB5h66xsA0B6');
      completionSound.volume = 0.3;
      completionSound.play().catch(() => {
        // Ignore audio errors
      });
      
      if (onEnded) {
        console.log('🎵 [AudioPlayer] Calling onEnded callback');
        onEnded();
      }
    };

    const handleError = (e: Event) => {
      console.error('🚨 [AudioPlayer] Audio error:', e);
      console.error('🚨 [AudioPlayer] Current src:', audio?.src);
      console.error('🚨 [AudioPlayer] Error details:', audio?.error);
    };

    const handleLoadStart = () => {
      console.log('🎵 [AudioPlayer] Loading started for:', audio?.src);
    };

    const handleCanPlay = () => {
      console.log('✅ [AudioPlayer] Audio can play:', audio?.src);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [onEnded]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="flex items-center gap-4 mb-4">
        <Button
          onClick={togglePlay}
          variant="default"
          size="icon"
          className="h-12 w-12 bg-primary hover:bg-primary/90"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>

        <Button
          onClick={handleStop}
          variant="outline"
          size="icon"
          className="h-12 w-12"
        >
          <Square className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleProgressChange}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <Button
          onClick={changePlaybackRate}
          variant="outline"
          size="sm"
          className="min-w-[60px]"
        >
          {playbackRate}x
        </Button>

        <Volume2 className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
};

export default AudioPlayer;

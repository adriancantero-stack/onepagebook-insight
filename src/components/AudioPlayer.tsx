import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  audioSrc: string | string[];
  onEnded?: () => void;
}

const AudioPlayer = ({ audioSrc, onEnded }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const playlist = Array.isArray(audioSrc) ? audioSrc : [audioSrc];
  const currentAudioSrc = playlist[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      // Check if there are more tracks in the playlist
      if (currentTrackIndex < playlist.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
        setCurrentTime(0);
        // Keep playing if we were playing
        if (isPlaying && audio) {
          setTimeout(() => audio.play(), 100);
        }
      } else {
        // End of playlist
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentTrackIndex(0);
        if (onEnded) onEnded();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
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
      <audio ref={audioRef} src={currentAudioSrc} key={currentTrackIndex} />
      
      {playlist.length > 1 && (
        <div className="text-sm text-muted-foreground mb-2">
          Parte {currentTrackIndex + 1} de {playlist.length}
        </div>
      )}
      
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

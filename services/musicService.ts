// Music Service — Background Music Management
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MusicTrack {
  id: string;
  title: string;
  uri: string;
  isLocal: boolean;
  savedAt: number;
}

const TRACKS_KEY = 'swn_music_tracks';
const SELECTED_KEY = 'swn_selected_track';

const DEFAULT_TRACKS: MusicTrack[] = [
  {
    id: 'default_1',
    title: 'Studio Ambient (Default)',
    uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    isLocal: false,
    savedAt: Date.now(),
  },
];

export const musicService = {
  async getTracks(): Promise<MusicTrack[]> {
    try {
      const stored = await AsyncStorage.getItem(TRACKS_KEY);
      if (stored) return JSON.parse(stored);
      return DEFAULT_TRACKS;
    } catch {
      return DEFAULT_TRACKS;
    }
  },

  async saveTracks(tracks: MusicTrack[]): Promise<void> {
    await AsyncStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
  },

  async addTrack(track: Omit<MusicTrack, 'id' | 'savedAt'>): Promise<MusicTrack> {
    const tracks = await this.getTracks();
    if (tracks.length >= 10) {
      throw new Error('Maximum 10 tracks allowed');
    }
    const newTrack: MusicTrack = {
      ...track,
      id: `track_${Date.now()}`,
      savedAt: Date.now(),
    };
    tracks.push(newTrack);
    await this.saveTracks(tracks);
    return newTrack;
  },

  async removeTrack(id: string): Promise<void> {
    const tracks = await this.getTracks();
    await this.saveTracks(tracks.filter(t => t.id !== id));
  },

  async getSelectedTrack(): Promise<string | null> {
    return AsyncStorage.getItem(SELECTED_KEY);
  },

  async setSelectedTrack(id: string | null): Promise<void> {
    if (id) {
      await AsyncStorage.setItem(SELECTED_KEY, id);
    } else {
      await AsyncStorage.removeItem(SELECTED_KEY);
    }
  },
};

import Song from '@/types/song.types'
import { proxy } from 'valtio'
import { devtools } from 'valtio/utils'

const playerStore = proxy({
    currentSong: {} as Song,
    SongList: [] as Song[],
    Playing: false,
    // It will track if audio player is playing and based on that it will change the play/pause icon
    isAudioPlaying: false,
    volume: 1,
    playedSongs: [] as any[],
    shuffle: false,

    changeCurrentSong(song: Song) {
        if (this.currentSong.id !== song.id) this.currentSong = song
    },

    togglePlay() {
        this.Playing = !this.Playing
    },

    toggleVolume() {
        this.volume = this.volume !== 0 ? 0 : Number(localStorage.getItem('volume') || 1)
    },

    toggleShuffle() {
        this.shuffle = !this.shuffle
    },

    playPrevSong() {
        if (this.SongList.length <= 1) return
        const currentSongIndex = this.SongList.findIndex((song) => song.id === this.currentSong.id)
        //We want to play the last song if currentSong is the first song
        if (currentSongIndex === 0) {
            this.currentSong = this.SongList[this.SongList.length - 1]
            return
        }
        this.currentSong = this.SongList[currentSongIndex - 1]
    },

    playNextSong() {
        if (this.SongList.length <= 1) return
        const currentSongIndex = this.SongList.findIndex((song) => song.id === this.currentSong.id)
        //We want to play the first song if currentSong is the last song
        if (currentSongIndex === this.SongList.length - 1) {
            this.currentSong = this.SongList[0]
            return
        }
        this.currentSong = this.SongList[currentSongIndex + 1]
    },

    // this function decides what to do after a song is finished playing
    songEnded() {
        this.Playing = false
        if (this.SongList.length <= 1) return
        if (this.shuffle) {
            const playableSongs = this.SongList.filter((song) => !this.playedSongs.includes(song.id))
            // resetting playedSongs when there in no playable songs left
            if (playableSongs.length === 0) {
                this.playedSongs = []
                return
            }
            this.currentSong = playableSongs[Math.floor(Math.random() * playableSongs.length)]
            return
        }
        this.playNextSong()
    },

    addToPlayedSong(id: string) {
        if (!this.playedSongs.includes(id)) {
            this.playedSongs.push(id)
        }
    },
})
devtools(playerStore, { name: 'playerStore', enabled: true })
export default playerStore

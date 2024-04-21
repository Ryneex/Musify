import { proxy } from 'valtio'
import { devtools } from 'valtio/utils'
import getAllPlaylist from '@/actions/user/playlist/getAllPlaylist'
import createPlaylist from '@/actions/user/playlist/createPlaylist'
import callServerActionWithToast from '@/helpers/callServerActionWithToast'
import Action_addSongInPlaylist from '@/actions/user/playlist/addSongInPlaylist'
import Action_removeSongFromPlaylist from '@/actions/user/playlist/removeSongFromPlaylist'
import Action_editPlaylist from '@/actions/user/playlist/editPlaylist'
import removePlaylist from '@/actions/user/playlist/removePlaylist'

const playlistStore = proxy({
    playlists: null as unknown as { name: string; _id: string; songs: string[] }[],

    async setPlaylists() {
        const { playlists, error } = await getAllPlaylist()
        if (error) {
            this.setPlaylists()
            return
        }
        this.playlists = playlists
    },

    async createPlaylist(name: string) {
        const res = await createPlaylist(name)
        if (res.error) return { error: res.error }

        this.playlists?.push(res.playlist)
        return { success: 'Playlist created Successfully' }
    },

    async deletePlaylist(playlistId: string) {
        const res = await callServerActionWithToast(removePlaylist(playlistId))
        if (res.error) return { error: res.error }

        this.playlists = this.playlists.filter((e: any) => e._id !== playlistId)
        return { success: 'Playlist created Successfully' }
    },

    async editPlaylist(playlistId: string, name: string) {
        const res = await callServerActionWithToast(Action_editPlaylist(playlistId, name))
        if (res.error) return { error: res.error }

        const playListIndex = this.playlists.findIndex((e) => e._id === playlistId)
        this.playlists[playListIndex].name = name
        return { success: 'Name Changed Successfully' }
    },

    async addSongInPlaylist(playlistId: string, songId: string) {
        const playListIndex = this.playlists.findIndex((e) => e._id === playlistId)
        if (playListIndex === -1) return
        if (this.playlists[playListIndex]?.songs?.includes(songId)) {
            callServerActionWithToast(Promise.resolve({ error: 'Song already added' }))
            return { error: 'Song already added' }
        }
        this.playlists[playListIndex].songs?.push(songId)
        callServerActionWithToast(Action_addSongInPlaylist(playlistId, songId))
    },

    async removeSongFromPlaylist(playlistId: string, songId: string) {
        const playListIndex = this.playlists.findIndex((e) => e._id === playlistId)
        this.playlists[playListIndex].songs = this.playlists[playListIndex].songs.filter((e) => e !== songId)
        callServerActionWithToast(Action_removeSongFromPlaylist(playlistId, songId))
    },
})

devtools(playlistStore, { name: 'user', enabled: true })

export default playlistStore

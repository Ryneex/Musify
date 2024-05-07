import { proxy } from 'valtio'
import Cookie from 'js-cookie'
import getUserInfo from '@/actions/user/getUserInfo'
import { devtools } from 'valtio/utils'
import getSongsById from '@/actions/data/getSongsById'
import Song from '@/types/song.types'
import RemoveFavourites from '@/actions/user/favourites/removeFavourites'
import AddFavourite from '@/actions/user/favourites/addFavourites'
import callServerActionWithToast from '@/helpers/callServerActionWithToast'

const userStore = proxy({
    user: { name: null as null | string, email: null as null | string, favourites: [] as string[] },
    favourites: null as null | Song[],
    theme: null as null | 'light' | 'dark',

    async setUser() {
        const { user } = await getUserInfo()
        this.user = user
        const data = await getSongsById(user.favourites)
        this.favourites = data.songs || []
    },

    async addFavouriteSong(song: Song) {
        if (this.user.favourites.includes(song.id)) {
            callServerActionWithToast(Promise.resolve({ error: 'Song already added' }))
            return { error: 'Song already added' }
        }
        this.user.favourites.push(song.id)
        this.favourites?.push(song)
        callServerActionWithToast(AddFavourite(song.id))
    },

    removeFavouriteSong(songId: string) {
        this.favourites = this.favourites?.filter((song) => song.id !== songId) || []
        this.user.favourites = this.user.favourites.filter((id: string) => id !== songId) || []
        callServerActionWithToast(RemoveFavourites(songId))
    },

    toggleTheme() {
        if (Cookie.get('theme') === 'light') {
            Cookie.set('theme', 'dark')
            this.theme = 'dark'
            document.querySelector('html')!.className = 'dark h-full'
        } else {
            Cookie.set('theme', 'light')
            this.theme = 'light'
            document.querySelector('html')!.className = 'light h-full'
        }
    },
})

devtools(userStore, { name: 'user', enabled: true })

export default userStore

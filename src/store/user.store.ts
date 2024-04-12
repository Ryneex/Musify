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

    async setUser() {
        const { user, err } = await getUserInfo()
        if (err || !user) return { err: 'Something went wrong' }
        this.user = user
        if (err) {
            this.setUser()
            return
        }
        const data = await getSongsById(user.favourites)
        this.favourites = data.songs || []
    },

    async addFavouriteSong(song: Song) {
        if (this.user.favourites.includes(song.id)) {
            callServerActionWithToast(Promise.resolve({ err: 'Song already added' }))
            return { err: 'Song already added' }
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
            document.querySelector('html')!.className = 'dark'
        } else {
            Cookie.set('theme', 'light')
            document.querySelector('html')!.className = 'light'
        }
    },
})

devtools(userStore, { name: 'user', enabled: true })

export default userStore

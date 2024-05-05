'use client'

import userStore from '@/store/user.store'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BiAlbum, BiHeart } from 'react-icons/bi'
import { GoHome } from 'react-icons/go'
import { MdNightsStay, MdOutlineLightMode } from 'react-icons/md'
import ProfileButton from './ProfileButton'

export default function Sidebar() {
    const pathname = usePathname()

    const links = [
        { name: 'Discover', href: '/', icon: <GoHome /> },
        { name: 'My Playlists', href: '/myplaylists', icon: <BiAlbum /> },
        { name: 'Favourites', href: '/favourites', icon: <BiHeart /> },
    ]

    return (
        <div className="row-span-2 flex flex-col border-r border-black/20 px-1 py-3 backdrop-blur-md dark:border-white/20 lg:px-3">
            <div className="flex items-center gap-2 px-0.5 sm:px-0">
                <img className="mx-auto w-full lg:mx-0 lg:w-9" src="/logo.png" alt="" />
                <h1 className="hidden text-xl font-bold text-black/90 dark:text-white/90 lg:block">Musify</h1>
            </div>
            <div className=" mt-5 flex flex-col gap-1 font-medium text-black/70 dark:font-normal dark:text-white/70">
                {links.map((link, i) => (
                    <Link key={i} href={link.href} className={`flex h-8 items-center justify-center gap-2 rounded-md text-sm hover:bg-black/5 dark:hover:bg-white/5 lg:justify-start lg:px-2 ${pathname === link.href && 'bg-slate-200 hover:bg-slate-200 dark:bg-white/15 dark:hover:bg-white/15'}`}>
                        <div className="text-xl">{link.icon}</div>
                        <span className="hidden lg:block">{link.name}</span>
                    </Link>
                ))}
            </div>
            <div className="mt-auto flex flex-col items-center gap-2 px-0.5 sm:hidden">
                <div onClick={() => userStore.toggleTheme()} className="flex aspect-square w-full cursor-pointer select-none items-center justify-center rounded-full bg-black/5 text-2xl hover:bg-black/10 dark:bg-white/20 dark:hover:bg-white/30">
                    <MdNightsStay className="hidden dark:block" />
                    <MdOutlineLightMode className="block dark:hidden" />
                </div>
                <div className="aspect-square w-full shrink-0 sm:hidden">
                    <ProfileButton />
                </div>
            </div>
        </div>
    )
}

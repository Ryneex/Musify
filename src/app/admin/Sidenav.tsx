'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LuHome } from 'react-icons/lu'
import { MdOutlineSpaceDashboard, MdOutlineAirplaneTicket } from 'react-icons/md'
import { PiPlaylistBold } from 'react-icons/pi'
import { TbUsers } from 'react-icons/tb'

export default function Sidenav() {
    const links = [
        { name: 'Home', path: '/admin', icon: LuHome },
        { name: 'Users', path: '/admin/users', icon: TbUsers },
        { name: 'Playlists', path: '/admin/playlists', icon: PiPlaylistBold },
        { name: 'Sessions', path: '/admin/sessions', icon: MdOutlineAirplaneTicket },
    ]
    const pathname = usePathname()

    return (
        <nav className="flex w-60 shrink-0 flex-col gap-5 border-r border-slate-300 bg-white px-3 pt-3 dark:border-zinc-800 dark:bg-zinc-600/5">
            <div className="flex items-center gap-2 px-2.5 text-lg">
                <MdOutlineSpaceDashboard className="text-xl" /> <span className="font-bold">Dashboard</span>
            </div>
            <div className="flex flex-col">
                {links.map((link, i) => (
                    <Link href={link.path} key={i} className={`flex h-9 cursor-pointer items-center gap-3 rounded-md px-3 text-sm text-black/80 hover:text-black ${pathname === link.path && 'bg-slate-200/60 font-medium !text-black dark:bg-slate-50/10 dark:!text-white'} dark:text-white/70 hover:dark:text-white`}>
                        <link.icon className="text-base" /> {link.name}
                    </Link>
                ))}
            </div>
        </nav>
    )
}

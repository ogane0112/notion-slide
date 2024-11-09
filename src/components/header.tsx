'use client'

import { useState } from 'react'
import Link from "next/link"
import { Menu, X } from 'lucide-react'

type HeaderItem = {
    link: string;
    text: string;
}

const headerItems: HeaderItem[] = [
    {
        link: "/home",
        text: "ホーム"
    },
    {
        link: "/about",
        text: "このサイトについて"
    },
    {
        link: "/slide",
        text: "スライド"
    }
]

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <svg className="h-8 w-8 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                            <span className="ml-2 text-xl font-semibold text-gray-800">NotionSlides</span>
                        </Link>
                    </div>
                    <nav className="hidden md:block">
                        <ul className="flex space-x-1">
                            {headerItems.map((item) => (
                                <li key={item.link}>
                                    <Link 
                                        href={item.link} 
                                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 hover:text-primary hover:bg-gray-100 transition-colors duration-200 relative group underline"
                                    >
                                        {item.text}
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 transition-colors duration-200"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">メニューを開く</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {headerItems.map((item) => (
                            <Link
                                key={item.link}
                                href={item.link}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-primary hover:bg-gray-50 transition-colors duration-200 relative group"
                            >
                                {item.text}
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    )
}

  
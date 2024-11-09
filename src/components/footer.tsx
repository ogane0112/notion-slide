import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-8">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
              <svg className="h-8 w-8 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
              </svg>
                                   
                          
                <span className="font-bold text-gray-900">NotionSlides</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                プレゼンテーションをもっとシンプルに。
                <br />
                あなたのアイデアを、美しく伝える。
              </p>
            </div>

            {/* Links section */}
            <div className="grid grid-cols-2 gap-8 md:col-span-2">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">製品について</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      機能
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      料金プラン
                    </Link>
                  </li>
                  <li>
                    <Link href="/template" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      テンプレート
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">サポート</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      お問い合わせ
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      プライバシーポリシー
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      利用規約
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col-reverse md:flex-row justify-between items-center space-y-4 space-y-reverse md:space-y-0">
              <div className="text-sm text-gray-500">
                &copy; {currentYear} NotionSlides All rights reserved.
              </div>
              <div className="flex items-center space-x-6">
                <Link href="https://twitter.com" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="https://github.com" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
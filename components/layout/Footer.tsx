import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
                  <path d="M8 28 C8 28 10 16 20 14 C30 12 32 22 32 22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M6 28 Q20 36 34 28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M32 18 C36 14 38 10 34 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="text-accent font-bold text-lg font-serif">Sardar Ji</div>
                <div className="text-white/60 text-xs tracking-widest uppercase">Chaipatti Wale</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Premium Indian teas sourced from the finest gardens across the subcontinent. 
              Bringing the authentic taste of India to your cup since tradition.
            </p>
            <div className="flex gap-4">
              {/* Facebook */}
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-accent hover:text-dark rounded-full flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-accent hover:text-dark rounded-full flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round"/></svg>
              </a>
              {/* Twitter */}
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-accent hover:text-dark rounded-full flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
              </a>
              {/* YouTube */}
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-accent hover:text-dark rounded-full flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-accent font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Shop All Teas', href: '/products' },
                { label: 'About Us', href: '/about' },
                { label: 'Support & FAQ', href: '/support' },
                { label: 'My Account', href: '/account' },
                { label: 'Track Order', href: '/account/orders' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-accent transition-colors text-sm flex items-center gap-2">
                    <span className="text-accent/60">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-accent font-semibold text-lg mb-6">Stay Connected</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                hello@sardarjicha.com
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                +91 98765 43210
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Amritsar, Punjab, India
              </div>
            </div>
            <div>
              <p className="text-sm text-white/60 mb-3">Subscribe for exclusive deals &amp; tea tips:</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
                <button className="bg-accent text-dark px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">© 2024 Sardar Ji Chaipatti Wale. All rights reserved.</p>
          <p className="text-white/40 text-sm">Made with ❤️ in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}

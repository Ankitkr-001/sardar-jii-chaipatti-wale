import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Sardar Ji Chaipatti Wale — our story, mission, and commitment to bringing premium Indian teas from the finest gardens to your cup.',
};

const VALUES = [
  {
    icon: '🌱',
    title: 'Farm to Cup',
    description:
      'We source directly from tea gardens across Darjeeling, Assam, Nilgiri, and Kashmir — no middlemen, just the freshest leaves.',
  },
  {
    icon: '🤝',
    title: 'Fair Trade',
    description:
      'We maintain direct relationships with farmers, ensuring fair wages and sustainable agricultural practices.',
  },
  {
    icon: '✅',
    title: 'Quality Tested',
    description:
      'Every batch is meticulously evaluated by our master tea tasters to guarantee an exceptional experience in every sip.',
  },
  {
    icon: '🌍',
    title: 'Sustainability',
    description:
      'Eco-friendly packaging and responsible sourcing — we care about the planet as much as we care about great tea.',
  },
];

const MILESTONES = [
  { year: '2018', title: 'The Beginning', description: 'Founded in Amritsar with a passion for authentic Indian chai.' },
  { year: '2019', title: 'First 1,000 Customers', description: 'Reached our first thousand happy tea lovers across India.' },
  { year: '2021', title: 'Garden Partnerships', description: 'Established direct partnerships with 15+ tea gardens nationwide.' },
  { year: '2023', title: '50+ Premium Blends', description: 'Expanded our collection to over 50 curated tea blends.' },
  { year: '2024', title: '10K+ Community', description: 'Grew to a community of 10,000+ loyal customers and counting.' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary py-24 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-chai/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-widest mb-4">
            Our Story
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
            Brewing Excellence,<br />
            <span className="text-accent">One Cup at a Time</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            Sardar Ji Chaipatti Wale was born from a simple belief: everyone deserves a truly exceptional
            cup of tea. From the misty hills of Darjeeling to the lush valleys of Kashmir, we bring India&apos;s
            finest teas to your doorstep.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Decorative side */}
            <div className="relative">
              <div className="w-80 h-80 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                <div className="w-60 h-60 bg-primary/20 rounded-full flex items-center justify-center">
                  <div className="w-40 h-40 bg-primary rounded-full flex items-center justify-center shadow-2xl">
                    <svg viewBox="0 0 100 100" className="w-20 h-20" fill="none">
                      <path d="M15 55 C15 55 20 30 50 28 C80 26 85 50 85 50" stroke="#C9A227" strokeWidth="4" strokeLinecap="round" />
                      <path d="M10 55 Q50 75 90 55" stroke="#C9A227" strokeWidth="4" strokeLinecap="round" />
                      <path d="M85 48 C98 44 100 32 92 28" stroke="#C9A227" strokeWidth="3" strokeLinecap="round" />
                      <path d="M35 22 Q38 12 35 2" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                      <path d="M50 18 Q53 8 50 -2" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                      <path d="M65 22 Q68 12 65 2" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="absolute top-8 right-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-xl">🏆</div>
                <div>
                  <div className="text-xs text-gray-500">Award Winning</div>
                  <div className="text-sm font-bold text-dark">Premium Quality</div>
                </div>
              </div>
              <div className="absolute bottom-8 left-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-xl">🌿</div>
                <div>
                  <div className="text-xs text-gray-500">Sourced From</div>
                  <div className="text-sm font-bold text-dark">15+ Gardens</div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <span className="text-accent font-medium text-sm uppercase tracking-widest">Who We Are</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-dark mt-3 mb-6 font-serif leading-tight">
                A Passion for India&apos;s Tea Heritage
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Founded with a deep love for India&apos;s rich tea traditions, Sardar Ji Chaipatti Wale travels to the
                finest gardens — from the foggy slopes of Darjeeling to the pristine valleys of Kashmir — to bring
                you teas that tell a story in every sip.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our master tea tasters evaluate every batch with care, ensuring authentic taste and uncompromising
                quality. We work directly with farmers, championing sustainable practices while delivering the
                freshest teas to your doorstep.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you crave a bold Assam CTC for your morning chai or a delicate Silver Needle White Tea
                for a quiet afternoon, our growing collection of 50+ blends has something for every tea lover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-accent font-medium text-sm uppercase tracking-widest">What Drives Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mt-3 font-serif">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="text-center p-8 bg-background rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-dark text-lg mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey / Milestones */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-accent font-medium text-sm uppercase tracking-widest">Our Journey</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mt-3 font-serif">Milestones</h2>
          </div>
          <div className="space-y-8">
            {MILESTONES.map((m, idx) => (
              <div key={m.year} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {m.year}
                  </div>
                  {idx < MILESTONES.length - 1 && <div className="w-0.5 flex-1 bg-primary/20 mt-2" />}
                </div>
                <div className="pb-8">
                  <h3 className="font-bold text-dark text-lg">{m.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">Ready to Taste the Difference?</h2>
          <p className="text-white/70 mb-8 text-lg">
            Explore our collection of premium Indian teas and find your perfect cup today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="bg-accent text-dark px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-all shadow-xl"
            >
              Shop Now →
            </Link>
            <Link
              href="/support"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:border-white/60 hover:bg-white/5 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

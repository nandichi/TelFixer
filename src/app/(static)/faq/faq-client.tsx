'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';
import type { FaqGroup } from '@/lib/faq-content';

interface FaqClientProps {
  categories: FaqGroup[];
}

function renderAnswer(answer: string) {
  const lines = answer.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length <= 1) {
    return <p>{answer.trim()}</p>;
  }
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
}

export function FaqClient({ categories }: FaqClientProps) {
  const shouldReduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (questionId: string) => {
    const newOpen = new Set(openQuestions);
    if (newOpen.has(questionId)) {
      newOpen.delete(questionId);
    } else {
      newOpen.add(questionId);
    }
    setOpenQuestions(newOpen);
  };

  const query = searchQuery.toLowerCase();
  const filteredCategories = categories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full bg-copper/5 blur-3xl" />
        </div>
        <Container>
          <Reveal className="relative max-w-2xl mx-auto text-center">
            <span className="inline-block text-eyebrow mb-4">FAQ</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-soft-black leading-[1.06] tracking-tight">
              Veelgestelde{' '}
              <em className="not-italic text-gradient-primary">vragen</em>
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-slate leading-relaxed mb-10">
              Vind antwoorden op de meest gestelde vragen over TelFixer
            </p>

            {/* Zoekveld */}
            <div className="relative max-w-md mx-auto">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none"
                strokeWidth={1.75}
              />
              <input
                type="text"
                placeholder="Zoek in veelgestelde vragen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-13 pl-12 pr-4 rounded-2xl bg-white border border-sand text-soft-black placeholder:text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Vragen */}
      <section className="pb-16 sm:pb-20 lg:pb-24">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10 sm:space-y-12">
            {filteredCategories.map((category) => (
              <Reveal key={category.name}>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-soft-black mb-4 sm:mb-5">
                  {category.name}
                </h2>
                <div className="space-y-3">
                  {category.items.map((item) => {
                    const questionId = item.id;
                    const isOpen = openQuestions.has(questionId);

                    return (
                      <div
                        key={questionId}
                        className={cn(
                          'bg-white rounded-2xl border overflow-hidden transition-colors duration-200',
                          isOpen ? 'border-primary/30' : 'border-sand'
                        )}
                      >
                        <button
                          onClick={() => toggleQuestion(questionId)}
                          className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
                          aria-expanded={isOpen}
                        >
                          <span className="font-medium text-soft-black">
                            {item.question}
                          </span>
                          <span
                            className={cn(
                              'flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all duration-300',
                              isOpen
                                ? 'bg-primary text-white rotate-180'
                                : 'bg-cream text-muted'
                            )}
                          >
                            <ChevronDown className="h-4.5 w-4.5" strokeWidth={2} />
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={
                                shouldReduceMotion
                                  ? { opacity: 0 }
                                  : { height: 0, opacity: 0 }
                              }
                              animate={
                                shouldReduceMotion
                                  ? { opacity: 1 }
                                  : { height: 'auto', opacity: 1 }
                              }
                              exit={
                                shouldReduceMotion
                                  ? { opacity: 0 }
                                  : { height: 0, opacity: 0 }
                              }
                              transition={{
                                duration: 0.3,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 sm:px-5 pb-5 text-slate leading-relaxed">
                                {renderAnswer(item.answer)}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            ))}

            {filteredCategories.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-sand">
                <p className="text-muted">
                  Geen vragen gevonden voor &ldquo;{searchQuery}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <Reveal className="max-w-3xl mx-auto mt-12 sm:mt-16">
            <div className="relative overflow-hidden rounded-3xl bg-soft-black p-8 sm:p-12 text-center">
              <div className="absolute inset-0" aria-hidden="true">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#04201f] to-[#0c0c0c]" />
                <div className="absolute -top-24 right-1/4 w-[320px] h-[320px] rounded-full bg-primary/20 blur-3xl" />
              </div>
              <div className="relative">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/15 mb-5">
                  <MessageCircle
                    className="h-7 w-7 text-copper-light"
                    strokeWidth={1.5}
                  />
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                  Vraag niet gevonden?
                </h2>
                <p className="text-on-dark-muted mb-8">
                  Neem gerust contact met ons op. We helpen je graag verder.
                </p>
                <Link href="/contact">
                  <Button size="lg" variant="secondary">
                    Contact opnemen
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}

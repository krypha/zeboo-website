import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { JsonLd } from '@/components/json-ld';
import { env } from '@/config/env';
import { BudgetBand } from '@/features/landing/components/budget-band';
import { ComposeBand } from '@/features/landing/components/compose-band';
import { DiscoverBand } from '@/features/landing/components/discover-band';
import { DoorsBand } from '@/features/landing/components/doors-band';
import { DownloadBand } from '@/features/landing/components/download-band';
import { FiguresBand } from '@/features/landing/components/figures-band';
import { Hero } from '@/features/landing/components/hero';
import { PromisesBand } from '@/features/landing/components/promises-band';
import {
  QUESTIONS,
  QuestionsBand,
} from '@/features/landing/components/questions-band';
import { RoadBand } from '@/features/landing/components/road-band';
import { StepsBand } from '@/features/landing/components/steps-band';
import { TransportBand } from '@/features/landing/components/transport-band';
import { routing } from '@/i18n/routing';
import { languageAlternates, OPEN_GRAPH_LOCALE } from '@/lib/seo/alternates';
import { SHARE_IMAGE, shareImagePath } from '@/lib/seo/share-image';
import { landingGraph } from '@/lib/seo/structured-data';

// nothing on this page is read from the request: the bands are translations and the counter does its arithmetic in the browser, so the two locales are built once rather than rendered per visitor
export const dynamic = 'force-static';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  // the layout answers 404 for any other locale before this is read, so this only narrows the type
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: 'seo' });
  const title = t('title');
  const description = t('description');
  const image = {
    url: shareImagePath(locale),
    width: SHARE_IMAGE.width,
    height: SHARE_IMAGE.height,
    type: SHARE_IMAGE.type,
    alt: t('imageAlt'),
  };

  // the layout's template reaches only the segments below it and this page shares its segment, so the brand is appended here; the cards carry it as their site name instead
  return {
    title: { absolute: `${title} · Zeboo` },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: languageAlternates(),
    },
    openGraph: {
      type: 'website',
      siteName: 'Zeboo',
      url: `/${locale}`,
      title,
      description,
      locale: OPEN_GRAPH_LOCALE[locale],
      alternateLocale: routing.locales
        .filter((one) => one !== locale)
        .map((one) => OPEN_GRAPH_LOCALE[one]),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  };
}

// every band is a server component but the budget counter, which is the one thing on the page a visitor presses
export default async function LandingPage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale);

  const seo = await getTranslations('seo');
  const questions = await getTranslations('landing.questions');

  // the questions are read from the same catalogue the band draws, so the structured answers are the visible ones word for word
  const graph = landingGraph({
    site: env.NEXT_PUBLIC_SITE_URL,
    locale,
    title: seo('title'),
    description: seo('description'),
    faq: QUESTIONS.map(([question, answer]) => ({
      question: questions(question),
      answer: questions(answer),
    })),
  });

  return (
    <>
      <JsonLd graph={graph} />
      <Hero />
      <FiguresBand />
      <StepsBand />
      <BudgetBand />
      <ComposeBand />
      <DiscoverBand />
      <TransportBand />
      <RoadBand />
      <DoorsBand />
      <PromisesBand />
      <QuestionsBand />
      <DownloadBand />
    </>
  );
}

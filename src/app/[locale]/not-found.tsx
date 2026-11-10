import { useTranslations } from 'next-intl';

// drawn inside the locale layout, between its header and its footer, so it is a section of the page and not a main of its own; next adds the noindex on its own, a 404 being one
export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="mx-auto flex max-w-2xl flex-col justify-center gap-2 px-4 py-24">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        {t('title')}
      </h1>
      <p className="text-muted-foreground">{t('description')}</p>
    </div>
  );
}

import { serialiseGraph } from '@/lib/seo/structured-data';

// structured data is read, never run, which is why it is a plain script tag and not next/script
export function JsonLd({ graph }: { graph: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialiseGraph(graph) }}
    />
  );
}

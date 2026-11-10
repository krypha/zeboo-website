// the shared card's size and type, which the route draws at and the head announces, so a network can lay the card out before it has fetched the image
export const SHARE_IMAGE = {
  width: 1200,
  height: 630,
  type: 'image/png',
} as const;

export function shareImagePath(locale: string): string {
  return `/${locale}/og.png`;
}

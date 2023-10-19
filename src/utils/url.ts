export const slugify = (input: string) =>
  input
    .trim()
    .replaceAll('ö', 'o')
    .replace(/[åä]/gi, 'a')
    .replace(/[^a-z0-9]/gi, '-');

export const generateShortUrl = (uuid: string, length: number = 6): string => {
  return Buffer.from(uuid)
    .toString('base64')
    .replace(/=/g, '')
    .substring(0, length);
};

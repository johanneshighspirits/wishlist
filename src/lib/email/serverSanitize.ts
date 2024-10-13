import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const serverSanitizeUserInput = (input: string) => {
  return purify.sanitize(input);
};

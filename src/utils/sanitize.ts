import sanitizeHtml from "sanitize-html";

export default function sanitize(text: string) {
  return sanitizeHtml(text, {
    textFilter: (text: string) => text.replace(/&amp;/g, "&"),
  });
}
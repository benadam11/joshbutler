import sanitizeHtml from "sanitize-html";

export default function sanitize(text: string) {
  return sanitizeHtml(text, {
    textFilter: (text: string) => text.replace(/&amp;/g, "&"),
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "iframe"]),
    // allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
    allowedAttributes: {
      iframe: ["src"],
      a: ["href", "name", "target"],
    },
  });
}

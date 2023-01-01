import { convert } from "html-to-text";
import sanitize from "./sanitize";

export async function getPosts() {
  const posts = await fetch(
    "http://joshuaryanbutler.com/wp-json/wp/v2/posts?per_page=100"
  ).then((res) => res?.json());
  return posts.map((post: any) => ({
    ...post,
    title: sanitize(post.title.rendered),
    description: convert(post.excerpt.rendered),
    content: post.content.rendered,
    recentPosts: posts.slice(0, 4).map((post: any) => ({
      ...post,
      title: sanitize(post.title.rendered),
      content: post.content.rendered,
    })),
  }));
}


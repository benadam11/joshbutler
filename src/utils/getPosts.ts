import { convert } from "html-to-text";
import handleRequest from "./handleRequest";
import sanitize from "./sanitize";

export async function getPosts(ctx?: any) {
  let fetcher = ctx
    ? handleRequest(getPostsRequest(), ctx)
    : fetch(getPostsRequest());
  const posts = await fetcher.then((res) => res?.json());
  return posts.map((post: any) => ({
    ...post,
    title: sanitize(post.title.rendered),
    description: convert(post.excerpt.rendered),
    content: sanitize(post.content.rendered),
    recentPosts: posts.slice(0, 4).map((post: any) => ({
      ...post,
      title: sanitize(post.title.rendered),
      content: sanitize(post.content.rendered),
    })),
  }));
}

export function getPostsRequest() {
  return new Request(
    "http://joshuaryanbutler.com/wp-json/wp/v2/posts?per_page=100"
  );
}

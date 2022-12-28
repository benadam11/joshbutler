import handleRequest from "./handleRequest";

export async function getPosts(ctx: any) {
  const posts = await handleRequest(getPostsRequest(), ctx).then((res) =>
    res?.json()
  );
  if (posts) {
    return {
      posts: posts.map((post: any) => ({
        ...post,
        title: post.title.rendered,
        content: post.content.rendered,
      })),
      recentPosts: posts.slice(0, 4).map((post: any) => ({
        ...post,
        title: post.title.rendered,
        content: post.content.rendered,
      })),
    };
  }
}

export function getPostsRequest() {
  return new Request(
    "http://joshuaryanbutler.com/wp-json/wp/v2/posts?per_page=100"
  );
}

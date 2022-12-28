import { getPosts } from "./getPosts";

export default async function getPost(slug: string, ctx: any) {
  const postResp = await getPosts(ctx);
  if (!postResp) return null;
  const post = postResp.posts.find((post: any) => post.slug === slug);
  if (!post) return null;
  return { ...post, recentPosts: postResp.recentPosts };
}

import { getPosts } from "./getPosts";

export default async function getPost(slug: string) {
  const { posts, recentPosts } = await getPosts();
  const post = posts.find((post: any) => post.slug === slug);
  if(!post) return null;
  return { ...post, recentPosts };
}

export async function getPosts() {
  const posts = await fetch(
    "http://joshuaryanbutler.com/wp-json/wp/v2/posts?per_page=100"
  ).then((res) => res.json());

  return {
    posts: posts.map((post: any) => ({ ...post, title: post.title.rendered })),
    recentPosts: posts
      .slice(0, 4)
      .map((post: any) => ({ ...post, title: post.title.rendered })),
  };
}

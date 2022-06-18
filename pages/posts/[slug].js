import Head from "next/head";
import Image from "next/image";
import { GraphQLClient, gql } from "graphql-request";
import styles from "../../styles/Slug.module.css";
import Link from "next/link";

const graphcms = new GraphQLClient(
  "https://api-ap-northeast-1.graphcms.com/v2/cl4bze4em3gc501z63sms5b53/master"
);

const QUERY = gql`
  query Post($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      slug
      datePublished
      author {
        id
        name
        avatar {
          url
        }
      }
      content {
        html
      }
      photo {
        id
        url
      }
    }
  }
`;

const SLUGLIST = gql`
  {
    posts {
      slug
    }
  }
`;

export async function getStaticPaths() {
  const { posts } = await graphcms.request(SLUGLIST);
  return {
    paths:
      // { params: { slug: "next-graphql" } },
      // { params: { slug: "nextjs-ssg-ssr" } },
      posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

//SSG
export async function getStaticProps({ params }) {
  const slug = params.slug;
  const data = await graphcms.request(QUERY, { slug });
  const post = data.post;
  return {
    props: {
      post,
    },
  };
}

export default function Home({ post }) {
  return (
    <main className={styles.blog}>
      <h2>{post.title}</h2>
      <img src={post.photo.url} alt="" className={styles.photo} />
      <div className={styles.title}>
        <div className={styles.authorText}>
          <h6>By {post.author.name}</h6>
          <h6 className={styles.date}>{post.datePublished}</h6>
        </div>
      </div>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content.html }}
      ></div>
      <div className={styles.backButton}>
        <Link href="/">
          <span>←もどる</span>
        </Link>
      </div>
    </main>
  );
}

import { getArticleBySlug, getArticlesSlugs } from '../../api-helpers/articles';
import { HTTPNotFound } from '../../api-helpers/errors';
import { DEFAULT_ARTICLES } from '../../api-helpers/general-feed';
import { closeConnection, openConnection } from '../../api-helpers/prisma/db';
import { ArticleSection } from '../../components/ArticleSection/ArticleSection';
import { Layout } from '../../components/Layout';
import { addSanitizedDescriptionToArticle } from '../../utils/sanitize-utils';

import type { InferGetStaticPropsContext, InferGetStaticPropsType2 } from '../../types';

export type ArticlePageProps = InferGetStaticPropsType2<typeof getStaticProps>;

export default function ArticlePage({ article }: ArticlePageProps) {
  return (
    <Layout title={article.title}>
      <ArticleSection article={article} />
    </Layout>
  );
}

export const getStaticProps = async ({
  params,
}: InferGetStaticPropsContext<typeof getStaticPaths>) => {
  if (!params) {
    return { props: undefined, notFound: true as const };
  }

  try {
    const prisma = openConnection();

    const article = await getArticleBySlug(prisma, params.slug);

    return {
      props: {
        article: addSanitizedDescriptionToArticle(article),
      },
    };
  } catch (err) {
    if (err instanceof HTTPNotFound) {
      return { props: undefined, notFound: true as const };
    }

    throw err;
  } finally {
    await closeConnection();
  }
};

export const getStaticPaths = async () => {
  try {
    const prisma = openConnection();

    const articles = await getArticlesSlugs(prisma, DEFAULT_ARTICLES);

    return {
      paths: articles.map(({ slug }) => ({
        params: {
          slug,
        },
      })),
      fallback: 'blocking' as const,
    };
  } finally {
    await closeConnection();
  }
};
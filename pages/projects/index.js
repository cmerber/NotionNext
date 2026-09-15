import BLOG from '@/blog.config'
import ProjectGallery from '@/components/projects/ProjectGallery'
import { siteConfig } from '@/lib/config'
import { cleanPostSummaries, fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { buildPublicProjects } from '@/lib/projects/projectCatalog'
import Head from 'next/head'

export default function ProjectsPage({ projects, siteInfo }) {
  const siteTitle = siteInfo?.title || '橙子星球'
  const canonical = `${siteConfig('LINK', 'https://qcode.im').replace(/\/$/, '')}/projects`

  return (
    <>
      <Head>
        <title>{`作品与项目 | ${siteTitle}`}</title>
        <meta name='description' content='橙子星球作品馆：集中展示工具、教学、实训、学习与研究项目。' />
        <link rel='canonical' href={canonical} />
      </Head>
      <ProjectGallery projects={projects} />
    </>
  )
}

export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'projects', locale })
  const projects = buildPublicProjects(cleanPostSummaries(props.allPages) || [])
  delete props.allPages

  return {
    props: { ...props, projects },
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig('NEXT_REVALIDATE_SECOND', BLOG.NEXT_REVALIDATE_SECOND, props.NOTION_CONFIG)
  }
}


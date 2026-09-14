import BLOG from '@/blog.config'
import AdventurerProfile from '@/components/profile/AdventurerProfile'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { getAdventurerProfile } from '@/lib/profile/notionProfile'
import Head from 'next/head'

export default function ProfilePage({ profile, siteInfo }) {
  const siteTitle = siteInfo?.title || '橙子星球'
  const canonical = `${siteConfig('LINK', 'https://qcode.im').replace(/\/$/, '')}/profile`

  return (
    <>
      <Head>
        <title>{`冒险者档案 | ${siteTitle}`}</title>
        <meta
          name='description'
          content='橙子星球冒险者档案：从成长记录汇总等级、经验值、六维能力与成就。'
        />
        <link rel='canonical' href={canonical} />
      </Head>
      <AdventurerProfile profile={profile} />
    </>
  )
}

export async function getStaticProps({ locale }) {
  const [props, profile] = await Promise.all([
    fetchGlobalAllData({ from: 'profile', locale }),
    getAdventurerProfile()
  ])
  delete props.allPages

  return {
    props: { ...props, profile },
    revalidate: process.env.EXPORT
      ? undefined
      : Math.min(
          900,
          siteConfig(
            'NEXT_REVALIDATE_SECOND',
            BLOG.NEXT_REVALIDATE_SECOND,
            props.NOTION_CONFIG
          )
        )
  }
}

import BLOG from '@/blog.config'
import DaVinciToolbox from '@/components/tools/DaVinciToolbox'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import Head from 'next/head'

export default function ToolsPage({ siteInfo }) {
  const siteTitle = siteInfo?.title || '橙子星球'
  const canonical = `${siteConfig('LINK', 'https://qcode.im').replace(/\/$/, '')}/tools`

  return (
    <>
      <Head>
        <title>{`达闻西实用工具箱 | ${siteTitle}`}</title>
        <meta
          name='description'
          content='免费、无需登录的实用工具：网络子网计算、密码生成、图片压缩、文件转换、教学百宝箱、视频下载和饮食热量估算。'
        />
        <link rel='canonical' href={canonical} />
      </Head>
      <DaVinciToolbox />
    </>
  )
}

export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'tools', locale })
  delete props.allPages

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

import Head from 'next/head'
import MusicRoom from '@/components/music/MusicRoom'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import catalog from '@/public/music/catalog.json'

export default function MusicPage() {
  return (
    <>
      <Head>
        <title>小岛声场 · 晴岑来的音乐 | 橙子星球</title>
        <meta
          name='description'
          content='晴岑来的小岛声场。在线收听《晚点也没关系》《羊光正好》，跟着歌词听歌，下载音乐，分享生活里的旋律。'
        />
        <link rel='canonical' href='https://qcode.im/music' />
        <meta property='og:title' content='小岛声场 · 晴岑来' />
        <meta property='og:description' content='把日子，写成诗，也唱成歌。' />
        <meta
          property='og:image'
          content='https://qcode.im/music/wan-dian.jpg'
        />
      </Head>
      <MusicRoom catalog={catalog} />
    </>
  )
}

export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'music', locale })
  delete props.allPages
  return { props, revalidate: process.env.EXPORT ? undefined : 900 }
}

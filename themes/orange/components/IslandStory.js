import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { IslandStoryStyle } from '../islandStoryStyle'

const corners = [
  {
    number: '01',
    icon: '▤',
    title: '文字与灵感',
    href: '/archive',
    text: '从粒计算与粒球计算，到网页设计、网站实训和教育技术，留下学习与实践的笔记。'
  },
  {
    number: '02',
    icon: '⌘',
    title: '实用工具',
    href: '/tools',
    text: '图片压缩、格式转换、子网计算、课堂小工具……把日常反复遇到的小事，做得顺手一点。'
  },
  {
    number: '03',
    icon: '✧',
    title: '冒险档案',
    href: '/profile',
    text: '把行动积累成经验与能力，用等级、徽章和成长曲线，看见一步一步走过的路。'
  }
]

export default function IslandStory({ full = false }) {
  return (
    <section
      id='orange-story'
      className={`orange-island-story ${full ? 'orange-story-full' : ''}`}
      aria-label='关于我与橙子星球'
    >
      <IslandStoryStyle />
      {full && (
        <header className='orange-about-heading'>
          <p className='orange-eyebrow'>NICE TO MEET YOU / 欢迎来坐坐</p>
          <h1>
            <span>关于我，</span>
            <span>也关于这座小岛。</span>
          </h1>
          <p>
            一个写代码、做研究，也认真记录生活的人，和一个慢慢长大的个人网站。
          </p>
        </header>
      )}
      <div className='orange-host-note'>
        <div className='orange-host-portrait'>
          <div className='orange-host-orbit' aria-hidden='true' />
          <LazyImage
            src='/orange/avatar-reference.webp'
            alt='橙子星球的小主人，棕发黑色上衣的成'
          />
          <span>QCODE / 成</span>
          <i aria-hidden='true'>✳</i>
        </div>
        <div className='orange-host-copy'>
          <p className='orange-eyebrow'>01 / 关于我</p>
          <h2>你好，我是成。</h2>
          <p>
            我是橙子星球的维护者。写代码、做研究，也把学习和动手实践的过程记录在这里。
          </p>
          <p>
            我关心的，是一个想法怎样变成真正能用的东西：一篇说明白问题的笔记，一个能在浏览器里运行的页面，或者一个省下重复操作的小工具。
          </p>
          <p>
            这里的书架里，有粒计算与粒球计算的学习笔记，也有网页设计、网站实训和教育技术相关内容。把零散的理解写下来，既方便以后回看，也希望能给路过的你一点启发。
          </p>
          <div className='orange-host-interests' aria-label='我在探索的方向'>
            <span>编程与网页</span>
            <span>研究与学习</span>
            <span>实用小工具</span>
          </div>
          {!full && (
            <SmartLink href='/about' className='orange-text-link'>
              再多认识我一点 ↗
            </SmartLink>
          )}
        </div>
      </div>
      <div className='orange-island-letter'>
        <div className='orange-island-intro'>
          <p className='orange-eyebrow'>02 / 关于小岛</p>
          <h2>
            给好奇心，
            <br />
            留一个可以落脚的地方。
          </h2>
          <span className='orange-letter-stamp' aria-hidden='true'>
            🍊<small>QCODE.IM</small>
          </span>
        </div>
        <div className='orange-island-copy'>
          <p>
            橙子星球是我的个人网站，也是一个持续搭建的小工作室。它把文章、工具和成长档案放在同一个地方，收纳那些值得留下来的知识、尝试与小作品。
          </p>
          <p>
            首页的小岛，是这些内容的一张地图：书架通向文章，电脑连接工具，档案柜记录成长，会客厅留给自我介绍。你可以先逛一圈，也可以直接打开一篇笔记，慢慢读。
          </p>
          <p>
            我希望这里有一点用处，也有一点温度。不必一次看完；如果某篇文章帮你想通了一个问题，或某个工具恰好省下一点时间，这座小岛就有了意义。
          </p>
        </div>
      </div>
      <div className='orange-island-corners' aria-label='小岛里的内容'>
        {corners.map(corner => (
          <SmartLink key={corner.href} href={corner.href}>
            <span className='orange-corner-meta'>
              <small>{corner.number} / EXPLORE</small>
              <i aria-hidden='true'>{corner.icon}</i>
            </span>
            <h3>
              {corner.title}
              <span aria-hidden='true'>↗</span>
            </h3>
            <p>{corner.text}</p>
          </SmartLink>
        ))}
      </div>
      <div className='orange-island-signoff'>
        <span aria-hidden='true'>✳</span>
        <p>
          慢慢探索，认真生活。<small>谢谢你，来到橙子星球。</small>
        </p>
        <SmartLink href={full ? '/' : '#orange-notes'}>
          {full ? '回到小岛逛逛' : '去书架，读点什么'} ↗
        </SmartLink>
      </div>
    </section>
  )
}

import { useEffect, useId, useState } from 'react'
import { radarRatio, radarScale } from '@/lib/profile/radar'
import styles from './AdventurerProfile.module.css'

const number = value => new Intl.NumberFormat('zh-CN').format(value || 0)

function SectionTitle({ index, eyebrow, title, children }) {
  return (
    <div className={styles.sectionHeading}>
      <div>
        <div className={styles.eyebrow}>
          <span>{index}</span> {eyebrow}
        </div>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  )
}

export function RadarChart({ dimensions, recent = false }) {
  const id = useId().replace(/:/g, '')
  const values = dimensions.map(item => (recent ? item.recentXp : item.xp))
  const scale = radarScale(values)
  const center = [300, 235]
  const radius = 168
  const point = (index, distance) => {
    const angle = (Math.PI * 2 * index) / dimensions.length - Math.PI / 2
    return [
      center[0] + Math.cos(angle) * distance,
      center[1] + Math.sin(angle) * distance
    ]
  }
  const polygon = factor =>
    dimensions.map((_, i) => point(i, radius * factor).join(',')).join(' ')
  const data = values.map((value, i) =>
    point(i, radius * radarRatio(value, scale))
  )
  return (
    <figure className={styles.radar}>
      <div className={styles.chartMeta}>
        <span>
          <i />
          {recent ? '近 30 天经验' : '累计能力经验'}
        </span>
        <span>外圈 {number(scale)} XP</span>
      </div>
      <svg
        viewBox='0 0 600 480'
        role='img'
        aria-labelledby={`${id}-title ${id}-desc`}
      >
        <title id={`${id}-title`}>六维能力雷达图</title>
        <desc id={`${id}-desc`}>
          {recent ? '近30天' : '累计'}经验，共用刻度0至{scale} XP。
          {dimensions
            .map(
              (item, i) => `${item.label} ${values[i]} XP，等级${item.level}`
            )
            .join('；')}
        </desc>
        <defs>
          <linearGradient id={`${id}-fill`} x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stopColor='#f3b878' stopOpacity='.48' />
            <stop offset='100%' stopColor='#cd6d3c' stopOpacity='.12' />
          </linearGradient>
        </defs>
        {[1, 0.8, 0.6, 0.4, 0.2].map(factor => (
          <polygon
            key={factor}
            points={polygon(factor)}
            className={styles.radarGrid}
          />
        ))}
        {dimensions.map((item, i) => {
          const [x, y] = point(i, radius)
          return (
            <line
              key={item.key}
              x1={center[0]}
              y1={center[1]}
              x2={x}
              y2={y}
              className={styles.radarAxis}
            />
          )
        })}
        {[0.2, 0.4, 0.6, 0.8, 1].map(factor => (
          <text
            key={factor}
            x={center[0] + 8}
            y={center[1] - radius * factor + 4}
            className={styles.radarTick}
          >
            {number(scale * factor)}
          </text>
        ))}
        <polygon
          points={data.map(p => p.join(',')).join(' ')}
          fill={`url(#${id}-fill)`}
          className={styles.radarShape}
        />
        {dimensions.map((item, i) => {
          const [x, y] = data[i]
          const [labelX, labelY] = point(i, 207)
          return (
            <g key={item.key}>
              <circle
                cx={x}
                cy={y}
                r={values[i] ? 5 : 3}
                fill={item.color}
                className={styles.radarDot}
              >
                <title>
                  {item.label}：{number(values[i])} XP · Lv.{item.level}
                </title>
              </circle>
              <text
                x={labelX}
                y={labelY - 2}
                textAnchor='middle'
                className={styles.radarLabel}
              >
                {item.label}
              </text>
              <text
                x={labelX}
                y={labelY + 20}
                textAnchor='middle'
                className={styles.radarValue}
              >
                {number(values[i])} XP
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption>
        共用 XP 刻度，随经验范围调整；等级与累计经验独立计算。
      </figcaption>
    </figure>
  )
}

function MonthlyTrend({ months }) {
  const maximum = Math.max(1, ...months.map(item => item.xp))
  return (
    <div
      className={styles.trend}
      role='img'
      aria-label={`近六个月经验：${months.map(item => `${item.label} ${item.xp} XP`).join('，')}`}
    >
      {months.map((item, i) => (
        <div
          key={item.key}
          className={styles.trendColumn}
          data-current={i === months.length - 1}
        >
          <span className={styles.trendValue}>
            {item.xp ? number(item.xp) : '—'}
          </span>
          <div className={styles.trendTrack}>
            <div style={{ height: `${(item.xp / maximum) * 100}%` }} />
          </div>
          <span className={styles.trendMonth}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdventurerProfile({ profile }) {
  const [recent, setRecent] = useState(false)
  const preview = profile.source !== 'notion'
  const updated = profile.generatedAt
    ? new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date(profile.generatedAt))
    : ''
  useEffect(() => {
    try {
      const key = 'qcode-adventurer-level'
      const previous = Number(window.localStorage.getItem(key) || 0)
      const message =
        previous > 0 && profile.level > previous
          ? `升级啦！现在是 Lv.${profile.level} 🎉`
          : `冒险者档案已就绪，当前 Lv.${profile.level} 🧭`
      window.localStorage.setItem(key, String(profile.level))
      window.dispatchEvent(
        new CustomEvent('qcode:pet-message', { detail: message })
      )
    } catch {
      // The profile remains usable when browser storage is unavailable.
    }
  }, [profile.level])
  return (
    <div className={`${styles.page} qcode-profile-page`}>
      <div className={styles.pageMeta}>
        <span>
          橙子星球 <i>/</i> 成长档案
        </span>
        <span className={styles.sync}>
          <i data-preview={preview} />
          {preview
            ? '示例数据 · Notion 暂未连接'
            : `Notion 成长记录${updated ? ` · ${updated} 更新` : ''}`}
        </span>
      </div>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>
            <span>✳</span> THE ADVENTURE CONTINUES
          </div>
          <h1>
            冒险者档案<span>每一次行动，都有回响。</span>
          </h1>
          <p>
            写代码、做研究、站上讲台，也认真生活。
            <br />
            把探索留下来，让成长有迹可循。
          </p>
          <div className={styles.heroTags}>
            <span>
              当前专精 <strong>{profile.strongest}</strong>
            </span>
            <span>
              <i />
              {profile.active} 项冒险进行中
            </span>
          </div>
        </div>
        <div className={styles.levelCard}>
          <div className={styles.levelTop}>
            <span>ADVENTURER LEVEL</span>
            <span>✳</span>
          </div>
          <div className={styles.levelValue}>
            <span>Lv.</span>
            {String(profile.level).padStart(2, '0')}
            <small>持续探索中</small>
          </div>
          <div className={styles.levelTotal}>
            累计获得 <strong>{number(profile.totalXp)}</strong> XP
          </div>
          <div
            className={styles.levelTrack}
            role='progressbar'
            aria-label='当前等级进度'
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={profile.levelXp}
          >
            <div style={{ width: `${profile.levelXp}%` }} />
          </div>
          <div className={styles.levelFoot}>
            <span>本级 {profile.levelXp} / 100 XP</span>
            <span>
              距 Lv.{profile.level + 1} 还差 {profile.xpToNext} XP
            </span>
          </div>
        </div>
      </header>
      <section className={styles.stats} aria-label='成长概览'>
        {[
          {
            label: '留下成长记录',
            value: profile.records,
            unit: '条',
            note: '每一条都是走过的路'
          },
          {
            label: '完成冒险',
            value: profile.completed,
            unit: '项',
            note: '把想法变成实际成果'
          },
          {
            label: '正在探索',
            value: profile.active,
            unit: '项',
            note: '故事还在继续'
          },
          {
            label: '近 30 天获得',
            value: `+${number(profile.momentum30)}`,
            unit: 'XP',
            note: '一点一滴，积累成进步'
          }
        ].map(item => (
          <div key={item.label} className={styles.stat}>
            <span>{item.label}</span>
            <div>
              <strong>{item.value}</strong>
              <small>{item.unit}</small>
            </div>
            <p>{item.note}</p>
          </div>
        ))}
      </section>
      <section
        className={styles.abilitySection}
        aria-labelledby='ability-heading'
      >
        <SectionTitle
          index='01'
          eyebrow='ABILITY ATLAS'
          title='成长，有自己的形状'
        >
          <div
            className={styles.segmented}
            role='group'
            aria-label='能力图表时间范围'
          >
            <button
              type='button'
              aria-pressed={!recent}
              onClick={() => setRecent(false)}
            >
              累计能力
            </button>
            <button
              type='button'
              aria-pressed={recent}
              onClick={() => setRecent(true)}
            >
              近 30 天
            </button>
          </div>
        </SectionTitle>
        <div className={styles.abilityGrid}>
          <RadarChart dimensions={profile.dimensions} recent={recent} />
          <div className={styles.abilityDetails}>
            <div className={styles.detailsHeading}>
              <h3 id='ability-heading'>六维能力画像</h3>
              <span>每 100 XP 升一级</span>
            </div>
            {profile.dimensions.map(item => (
              <div key={item.key} className={styles.abilityRow}>
                <div className={styles.abilityName}>
                  <span
                    className={styles.abilityIcon}
                    style={{ color: item.color }}
                  >
                    {item.icon}
                  </span>
                  <strong>{item.label}</strong>
                  <span className={styles.abilityLevel}>Lv.{item.level}</span>
                  <span className={styles.abilityXp}>
                    {number(item.xp)}
                    <small>XP</small>
                  </span>
                </div>
                <div
                  className={styles.abilityTrack}
                  role='progressbar'
                  aria-label={`${item.label}本级进度`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={item.levelXp}
                >
                  <div
                    style={{
                      width: `${item.levelXp}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
                <div className={styles.abilityFoot}>
                  <span>
                    近 30 天{' '}
                    <b>{item.recentXp ? `+${item.recentXp}` : '0'} XP</b>
                  </span>
                  <span>距升级 {item.xpToNext} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.growthGrid} aria-label='成长趋势与近况'>
        <div className={styles.panel}>
          <SectionTitle
            index='02'
            eyebrow='GROWTH JOURNAL'
            title='时间，留下了这些'
          >
            <span className={styles.unit}>近六个月 · XP</span>
          </SectionTitle>
          <MonthlyTrend months={profile.monthlyTrend} />
          <p className={styles.chartNote}>
            按任务记录日期汇总；未填写日期的经验不计入月度趋势。
          </p>
        </div>
        <div className={`${styles.panel} ${styles.report}`}>
          <div className={styles.reportHeading}>
            <span className={styles.eyebrow}>THE LAST 30 DAYS</span>
            <span>↗</span>
          </div>
          <h2>最近的成长动能</h2>
          <div className={styles.reportValue}>
            +{number(profile.momentum30)}
            <span>XP</span>
          </div>
          <p>
            {profile.momentumDelta >= 0
              ? '比前 30 天多获得'
              : '比前 30 天少获得'}{' '}
            <strong>{number(Math.abs(profile.momentumDelta))} XP</strong>
          </p>
          <div className={styles.reportBottom}>
            <div>
              <span>提升最快</span>
              <strong>{profile.fastestGrowing?.label || '等待新的探索'}</strong>
            </div>
            <div>
              <span>近 90 天</span>
              <strong>{profile.recent90} 条记录</strong>
            </div>
          </div>
        </div>
      </section>
      <section className={`${styles.panel} ${styles.achievements}`}>
        <SectionTitle index='03' eyebrow='MILESTONES' title='那些被点亮的瞬间'>
          <span className={styles.unit}>
            {profile.badges.length} 枚成长印记
          </span>
        </SectionTitle>
        {profile.badges.length ? (
          <div className={styles.badges}>
            {profile.badges.map(badge => (
              <div key={badge.name} className={styles.badge}>
                <span className={styles.badgeIcon}>{badge.icon}</span>
                <div>
                  <h3>{badge.name}</h3>
                  <p>{badge.note}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>第一条成长记录，会点亮你的第一枚印记。</p>
        )}
        <div className={styles.questSummary}>
          <span>冒险足迹</span>
          {profile.questTypes.map(item => (
            <span key={item.name}>
              {item.name} <strong>{item.count}</strong>
            </span>
          ))}
        </div>
      </section>
      <footer className={styles.footer}>
        <span>✳ 慢慢探索，认真生活。</span>
        <p>仅展示成长汇总，任务名称与复盘保留在私人 Notion 中。</p>
      </footer>
    </div>
  )
}

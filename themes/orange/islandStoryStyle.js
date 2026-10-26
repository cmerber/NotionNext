export function IslandStoryStyle() {
  return (
    <style jsx global>{`
      #theme-orange .orange-island-story {
        width: 100%;
        max-width: 1500px;
        margin: 0 auto;
        padding: 100px clamp(20px, 5vw, 75px) 0;
        scroll-margin-top: 30px;
      }
      #theme-orange .orange-story-full {
        padding: 50px 0 0;
      }
      #theme-orange .orange-about-heading {
        max-width: 850px;
        margin-bottom: 75px;
      }
      #theme-orange .orange-about-heading h1 {
        font:
          400 clamp(32px, 4.3vw, 60px)/1.4 'Songti SC',
          'SimSun',
          Georgia,
          serif;
        letter-spacing: -0.03em;
        margin: 18px 0;
      }
      #theme-orange .orange-about-heading > p:last-child {
        color: var(--orange-muted);
        max-width: 590px;
        line-height: 1.9;
      }
      #theme-orange .orange-about-heading h1 span {
        display: inline-block;
      }
      #theme-orange .orange-host-note {
        display: grid;
        grid-template-columns: 0.8fr 1.2fr;
        align-items: center;
        gap: clamp(35px, 7vw, 110px);
        padding: 25px 0 85px;
      }
      #theme-orange .orange-host-portrait {
        position: relative;
        padding: 28px;
        max-width: 330px;
        width: 100%;
        margin: 0 auto;
      }
      #theme-orange .orange-host-portrait img {
        display: block;
        width: 100%;
        height: auto;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 46% 46% 40% 40%;
        border: 9px solid var(--orange-surface);
        box-shadow: 10px 12px 0 var(--orange-soft);
        transform: rotate(-5deg);
      }
      #theme-orange .orange-host-orbit {
        position: absolute;
        inset: 5% -8%;
        border: 1px solid var(--orange-line);
        border-radius: 50%;
        transform: rotate(-25deg) scaleY(0.7);
        pointer-events: none;
      }
      #theme-orange .orange-host-portrait > span {
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%) rotate(3deg);
        background: var(--orange-soft);
        color: var(--orange-ink);
        border: 1px solid var(--orange-line);
        padding: 6px 20px;
        font-size: 10px;
        letter-spacing: 0.16em;
        white-space: nowrap;
      }
      #theme-orange .orange-host-portrait > i {
        position: absolute;
        right: -8px;
        top: 15%;
        color: var(--orange-accent);
        font:
          normal 65px/1 Georgia,
          serif;
      }
      #theme-orange .orange-host-copy h2,
      #theme-orange .orange-island-intro h2 {
        font:
          400 clamp(29px, 3.1vw, 44px)/1.5 'Songti SC',
          'SimSun',
          Georgia,
          serif;
        letter-spacing: -0.02em;
        margin: 12px 0 22px;
      }
      #theme-orange .orange-host-copy > p:not(.orange-eyebrow),
      #theme-orange .orange-island-copy p {
        line-height: 2.05;
        font-size: 14px;
        margin: 0 0 17px;
        max-width: 620px;
      }
      #theme-orange .orange-host-interests {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 22px 0;
      }
      #theme-orange .orange-host-interests span {
        padding: 5px 11px;
        border: 1px solid var(--orange-line);
        border-radius: 30px;
        font-size: 10px;
        color: var(--orange-muted);
      }
      #theme-orange .orange-host-copy .orange-text-link {
        font-size: 12px;
      }
      #theme-orange .orange-island-letter {
        display: grid;
        grid-template-columns: 0.8fr 1.2fr;
        gap: clamp(30px, 6vw, 90px);
        padding: clamp(28px, 4vw, 60px);
        background: var(--orange-surface);
        border: 1px solid var(--orange-line);
        border-radius: 24px;
        box-shadow: 6px 7px 0 var(--orange-soft);
      }
      #theme-orange .orange-island-intro h2 {
        font-size: clamp(26px, 2.8vw, 37px);
      }
      #theme-orange .orange-letter-stamp {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        border: 1px dashed var(--orange-line);
        padding: 15px;
        margin-top: 14px;
        transform: rotate(-8deg);
        font-size: 28px;
      }
      #theme-orange .orange-letter-stamp small {
        font-size: 7px;
        letter-spacing: 0.16em;
        color: var(--orange-muted);
      }
      #theme-orange .orange-island-copy p:last-child {
        margin-bottom: 0;
      }
      #theme-orange .orange-island-corners {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 24px;
        margin-top: 50px;
      }
      #theme-orange .orange-island-corners > a {
        padding: 25px 0;
        border-top: 1px solid var(--orange-line);
        transition: transform 0.2s;
      }
      #theme-orange .orange-island-corners > a:hover {
        transform: translateY(-4px);
      }
      #theme-orange .orange-corner-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--orange-muted);
      }
      #theme-orange .orange-corner-meta small {
        font-size: 8px;
        letter-spacing: 0.15em;
      }
      #theme-orange .orange-corner-meta i {
        color: var(--orange-accent);
        font-style: normal;
        font-size: 22px;
      }
      #theme-orange .orange-island-corners h3 {
        font:
          400 22px/1.5 'Songti SC',
          'SimSun',
          Georgia,
          serif;
        margin: 15px 0 12px;
      }
      #theme-orange .orange-island-corners h3 span {
        float: right;
        font: 16px/2 sans-serif;
        color: var(--orange-accent);
      }
      #theme-orange .orange-island-corners p {
        color: var(--orange-muted);
        font-size: 12px;
        line-height: 1.95;
        margin: 0;
      }
      #theme-orange .orange-island-signoff {
        display: flex;
        align-items: center;
        gap: 18px;
        border-bottom: 1px solid var(--orange-line);
        padding: 30px 0 45px;
      }
      #theme-orange .orange-island-signoff > span {
        font-size: 36px;
        color: var(--orange-accent);
      }
      #theme-orange .orange-island-signoff p {
        font:
          400 20px/1.6 'Songti SC',
          'SimSun',
          Georgia,
          serif;
        margin: 0;
      }
      #theme-orange .orange-island-signoff small {
        display: block;
        color: var(--orange-muted);
        font: 11px/1.8 sans-serif;
        margin-top: 5px;
      }
      #theme-orange .orange-island-signoff a {
        margin-left: auto;
        font-size: 12px;
        white-space: nowrap;
      }
      @media (max-width: 760px) {
        #theme-orange .orange-island-story {
          padding-top: 65px;
        }
        #theme-orange .orange-story-full {
          padding: 30px 0 0;
        }
        #theme-orange .orange-about-heading {
          margin-bottom: 40px;
        }
        #theme-orange .orange-host-note {
          grid-template-columns: 1fr;
          gap: 36px;
          padding: 0 0 45px;
        }
        #theme-orange .orange-host-portrait {
          max-width: 245px;
          padding: 20px;
        }
        #theme-orange .orange-host-portrait > i {
          font-size: 45px;
          right: 2px;
        }
        #theme-orange .orange-island-letter {
          grid-template-columns: 1fr;
          gap: 22px;
          padding: 28px 24px;
          border-radius: 18px;
        }
        #theme-orange .orange-island-intro {
          position: relative;
        }
        #theme-orange .orange-island-intro h2 {
          font-size: 27px;
          margin-bottom: 0;
        }
        #theme-orange .orange-letter-stamp {
          position: absolute;
          top: -4px;
          right: -5px;
          margin: 0;
          padding: 7px;
          font-size: 20px;
        }
        #theme-orange .orange-letter-stamp small {
          font-size: 6px;
        }
        #theme-orange .orange-island-corners {
          grid-template-columns: 1fr;
          gap: 0;
          margin-top: 38px;
        }
        #theme-orange .orange-island-corners > a {
          padding: 22px 0;
        }
        #theme-orange .orange-island-corners h3 {
          margin: 8px 0;
        }
        #theme-orange .orange-island-signoff {
          flex-wrap: wrap;
          gap: 12px;
          padding: 18px 0 32px;
        }
        #theme-orange .orange-island-signoff a {
          width: 100%;
          margin: 5px 0 0 48px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        #theme-orange .orange-island-corners > a:hover {
          transform: none;
        }
      }
    `}</style>
  )
}

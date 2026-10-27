export function ExperienceStyle() {
  return (
    <style jsx global>{`
      #theme-orange {
        --orange-radius: 22px;
        --orange-ink: #30493f;
        --orange-soft: #dfe7db;
        transition:
          background-color 0.25s,
          color 0.25s;
        background-image: radial-gradient(
          ellipse at 98% 8%,
          #d9e2d488,
          transparent 48%
        );
      }
      .dark #theme-orange {
        --orange-ink: #dfebdc;
        --orange-soft: #34473e;
        background-image: radial-gradient(
          ellipse at 98% 8%,
          #48625733,
          transparent 48%
        );
      }
      #theme-orange .orange-header {
        min-height: 96px;
      }
      #theme-orange .orange-brand {
        letter-spacing: -0.02em;
        font-size: 21px;
      }
      #theme-orange .orange-brand small {
        letter-spacing: 0.2em;
        font-size: 7px;
      }
      #theme-orange .orange-header nav > a[aria-current='page'] {
        color: var(--orange-accent);
      }
      #theme-orange
        .orange-header
        nav
        > a[aria-current='page']:not(.orange-round-button)::after {
        content: '';
        display: block;
        margin: 5px auto -7px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: currentColor;
      }
      #theme-orange .orange-footer {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
        align-items: center;
      }
      #theme-orange .orange-footer-motto {
        text-align: center;
      }
      #theme-orange .orange-footer-credit {
        justify-self: end;
        text-align: right;
      }
      @media (max-width: 760px) {
        #theme-orange .orange-footer {
          grid-template-columns: 1fr;
          justify-items: center;
          gap: 12px;
          text-align: center;
        }
        #theme-orange .orange-footer-credit {
          justify-self: center;
          text-align: center;
        }
      }
      #theme-orange .qcode-toolbox-page,
      #theme-orange .qcode-profile-page {
        --heo-color-primary: #54745f;
        --heo-color-card-dark: var(--orange-surface);
      }
      #theme-orange .qcode-toolbox-page > header {
        background: linear-gradient(125deg, #365347, #71866b 70%, #b49a73);
        box-shadow: 0 12px 35px #30493f15;
        border-radius: 22px;
      }
      #theme-orange .qcode-profile-page > section:first-child {
        background: linear-gradient(
          130deg,
          var(--orange-surface),
          var(--orange-soft)
        );
        border-color: var(--orange-line);
        box-shadow: 5px 6px 0 var(--orange-soft);
      }
      #theme-orange .qcode-profile-page [class*='text-indigo-'] {
        color: var(--orange-accent);
      }
      #theme-orange .qcode-profile-page h1 [class*='bg-clip-text'] {
        background-image: linear-gradient(110deg, #54745f, #ba7750);
      }
      #theme-orange .qcode-toolbox-page section {
        border-color: var(--orange-line);
        background: var(--orange-surface);
      }
      #theme-orange .orange-page-heading {
        position: relative;
        padding: 45px 0 48px;
        margin-bottom: 30px;
        border-bottom: 1px solid var(--orange-line);
      }
      #theme-orange .orange-page-heading::after {
        content: '✳';
        position: absolute;
        right: 2%;
        top: 20px;
        font-size: clamp(70px, 12vw, 145px);
        color: var(--orange-ink);
        opacity: 0.16;
        line-height: 1;
        transform: rotate(-16deg);
      }
      #theme-orange .orange-page-heading h1 {
        font-family: 'Songti SC', 'SimSun', Georgia, serif;
        font-size: clamp(34px, 4vw, 62px);
        font-weight: 400;
        letter-spacing: -0.04em;
      }
      #theme-orange .orange-section-heading h2 {
        font-family: 'Songti SC', 'SimSun', Georgia, serif;
        font-size: clamp(30px, 3vw, 44px);
        font-weight: 400;
      }
      #theme-orange .orange-post-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 26px;
      }
      #theme-orange .orange-post-card {
        border: 1px solid var(--orange-line);
        border-radius: 20px;
        background: var(--orange-surface);
        overflow: hidden;
        box-shadow: 0 6px 24px #30493f05;
        transition:
          transform 0.35s ease,
          box-shadow 0.35s ease;
      }
      #theme-orange .orange-post-card:hover {
        transform: perspective(1000px) translateY(-7px)
          rotateX(var(--card-x, 0deg)) rotateY(var(--card-y, 0deg));
        box-shadow: 0 16px 36px #30493f12;
      }
      #theme-orange .orange-post-cover {
        display: block;
        position: relative;
        aspect-ratio: 1.65;
        overflow: hidden;
        border-bottom: 1px solid var(--orange-line);
        background: #dce5d8;
      }
      #theme-orange .orange-post-card[data-cover-tone='1'] .orange-post-cover {
        background: #ead7bf;
      }
      #theme-orange .orange-post-card[data-cover-tone='2'] .orange-post-cover {
        background: #d4dfde;
      }
      #theme-orange .orange-cover-placeholder {
        position: absolute;
        inset: 0;
        overflow: hidden;
        display: block;
        background: linear-gradient(140deg, #ffffff28, transparent);
        color: #344c40;
      }
      #theme-orange .orange-cover-placeholder strong {
        position: absolute;
        left: 22px;
        bottom: 30px;
        font:
          italic 72px Georgia,
          serif;
        font-weight: 400;
        letter-spacing: -0.09em;
        opacity: 0.75;
      }
      #theme-orange .orange-cover-placeholder i {
        position: absolute;
        right: 12%;
        top: 4%;
        font:
          normal 115px Georgia,
          serif;
        text-shadow: 10px 15px 0 #ffffff38;
        transform: rotate(-12deg);
        transition: transform 0.7s;
      }
      #theme-orange .orange-post-card:hover .orange-cover-placeholder i {
        transform: rotate(18deg) translateY(-4px);
      }
      #theme-orange .orange-cover-placeholder small {
        position: absolute;
        bottom: 16px;
        left: 24px;
        font-size: 8px;
        letter-spacing: 0.2em;
      }
      #theme-orange .orange-cover-orbit {
        position: absolute;
        width: 70%;
        height: 150%;
        right: 0;
        top: -30%;
        border: 1px solid #344c4030;
        border-radius: 50%;
        transform: rotate(40deg);
      }
      #theme-orange .orange-post-copy {
        padding: 24px;
      }
      #theme-orange .orange-post-copy h3 {
        font-size: 20px;
        line-height: 1.6;
        letter-spacing: -0.035em;
        font-weight: 600;
        margin: 14px 0 12px;
      }
      #theme-orange .orange-post-copy > p {
        font-size: 13px;
        line-height: 1.9;
        color: var(--orange-muted);
      }
      #theme-orange .orange-read-link {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid var(--orange-line);
        padding-top: 16px;
        margin-top: 22px;
        font-size: 11px;
        letter-spacing: 0.08em;
      }
      #theme-orange .orange-card-tags,
      #theme-orange .orange-story-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        font-size: 11px;
        color: var(--orange-muted);
      }
      #theme-orange .orange-card-tags a,
      #theme-orange .orange-story-tags a {
        padding: 3px 10px;
        border: 1px solid var(--orange-line);
        border-radius: 30px;
      }
      #theme-orange .orange-archive {
        display: grid;
        grid-template-columns: 140px 1fr;
        gap: 0 36px;
        padding: 28px 0;
        border-top: 1px solid var(--orange-line);
      }
      #theme-orange .orange-archive h2 {
        grid-column: 1;
        grid-row: 1 / span 100;
        font:
          italic 28px Georgia,
          serif;
        color: var(--orange-muted);
      }
      #theme-orange .orange-archive a {
        grid-column: 2;
        padding: 19px 0;
        border-bottom: 1px dashed var(--orange-line);
        transition: padding 0.25s;
      }
      #theme-orange .orange-archive a:hover {
        padding-left: 10px;
      }
      #theme-orange .orange-collection a {
        border-radius: 16px;
        padding: 28px;
        background: var(--orange-surface);
        box-shadow: 5px 6px 0 var(--orange-soft);
        transition: transform 0.25s;
      }
      #theme-orange .orange-collection a:hover {
        transform: translateY(-4px);
      }
      #theme-orange .orange-reading-room {
        max-width: 1320px;
        margin: 30px auto 100px;
      }
      #theme-orange .orange-reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: transparent;
        z-index: 100;
      }
      #theme-orange .orange-reading-progress > span {
        display: block;
        height: 100%;
        background: var(--orange-accent);
        transition: width 0.12s linear;
      }
      #theme-orange .orange-breadcrumb {
        display: flex;
        gap: 12px;
        font-size: 11px;
        color: var(--orange-muted);
        margin: 24px 0 36px;
      }
      #theme-orange .orange-story-hero {
        display: grid;
        grid-template-columns: 1fr 32%;
        gap: 5%;
        align-items: center;
        min-height: 340px;
        padding: 44px 0 54px;
        border-bottom: 1px solid var(--orange-line);
        margin-bottom: 55px;
      }
      #theme-orange .orange-story-heading h1 {
        font-family: 'Songti SC', 'Noto Serif SC', 'SimSun', Georgia, serif;
        font-weight: 500;
        font-size: clamp(30px, 3.3vw, 54px);
        line-height: 1.5;
        letter-spacing: -0.035em;
        margin: 20px 0;
        text-wrap: pretty;
      }
      #theme-orange .orange-story-deck {
        color: var(--orange-muted);
        font-size: 14px;
        line-height: 1.9;
        max-width: 620px;
      }
      #theme-orange .orange-story-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px 18px;
        font-size: 11px;
        color: var(--orange-muted);
        margin-top: 26px;
      }
      #theme-orange .orange-story-meta a {
        border-bottom: 1px solid var(--orange-line);
      }
      #theme-orange .orange-story-art {
        position: relative;
        height: 285px;
        border-radius: 50% 50% 40% 40%;
        background: radial-gradient(
          ellipse at 50% 40%,
          #dce6d6,
          transparent 70%
        );
        perspective: 800px;
      }
      #theme-orange .orange-story-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 18px;
        transform: rotate(3deg);
        box-shadow: 12px 12px 0 var(--orange-soft);
      }
      #theme-orange .orange-paper-book {
        position: absolute;
        width: 150px;
        height: 195px;
        left: calc(50% - 75px);
        top: 36px;
        padding: 25px;
        border-radius: 4px 12px 12px 4px;
        background: #54745f;
        color: #f3e9d2;
        box-shadow:
          -6px 6px 0 #b6c0a5,
          -11px 11px 0 #fff6e6,
          -15px 15px 0 #b6c0a5,
          18px 30px 25px #30493f25;
        transform: rotateY(-23deg) rotateX(10deg) rotateZ(-14deg);
        transition: transform 0.8s;
        border-left: 8px solid #365747;
      }
      #theme-orange .orange-story-art:hover .orange-paper-book {
        transform: rotateY(-8deg) rotateX(4deg) rotateZ(-5deg) translateY(-8px);
      }
      #theme-orange .orange-paper-book > span {
        display: block;
        font:
          19px/1.5 Georgia,
          serif;
        letter-spacing: 0.1em;
      }
      #theme-orange .orange-paper-book i {
        display: block;
        font-style: normal;
        font-size: 47px;
        margin-top: 15px;
      }
      #theme-orange .orange-art-orbit {
        position: absolute;
        width: 95%;
        height: 40%;
        border: 1px solid #6c877144;
        border-radius: 50%;
        top: 33%;
        left: 2%;
        transform: rotate(-25deg);
      }
      #theme-orange .orange-art-sun {
        position: absolute;
        color: #c7854e;
        top: 10px;
        right: 16%;
        font-size: 42px;
      }
      #theme-orange .orange-art-caption {
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        font-size: 7px;
        letter-spacing: 0.24em;
        color: var(--orange-muted);
      }
      #theme-orange .orange-reading-layout {
        display: grid;
        grid-template-columns: 210px minmax(0, 1fr);
        gap: clamp(30px, 5vw, 80px);
        align-items: start;
      }
      #theme-orange .orange-reading-aside {
        position: sticky;
        top: 30px;
        min-width: 0;
      }
      #theme-orange .orange-reading-compass {
        padding: 0 0 28px;
        border-bottom: 1px solid var(--orange-line);
        margin-bottom: 22px;
      }
      #theme-orange .orange-reading-compass > span {
        font-size: 8px;
        letter-spacing: 0.14em;
        color: var(--orange-muted);
      }
      #theme-orange .orange-reading-compass p {
        font:
          26px/1.6 'Songti SC',
          'SimSun',
          serif;
        margin: 16px 0;
      }
      #theme-orange .orange-reading-compass > a {
        font-size: 11px;
        color: var(--orange-accent);
      }
      #theme-orange .orange-toc summary {
        cursor: pointer;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
      }
      #theme-orange .orange-toc summary > span {
        font:
          italic 13px Georgia,
          serif;
        color: var(--orange-muted);
      }
      #theme-orange .orange-toc nav {
        display: grid;
        max-height: 46vh;
        overflow-y: auto;
        gap: 2px;
        border-left: 1px solid var(--orange-line);
        margin: 15px 0;
      }
      #theme-orange .orange-toc a {
        display: block;
        font-size: 12px;
        color: var(--orange-muted);
        padding: 7px 12px;
        line-height: 1.7;
        border-left: 2px solid transparent;
        margin-left: -1px;
      }
      #theme-orange .orange-toc a[aria-current] {
        color: var(--orange-accent);
        border-left-color: var(--orange-accent);
        background: var(--orange-soft);
      }
      #theme-orange .orange-toc a.orange-toc-sub {
        padding-left: 23px;
      }
      #theme-orange .orange-reading-settings {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 24px;
      }
      #theme-orange .orange-reading-settings button {
        font-size: 10px;
        border: 1px solid var(--orange-line);
        border-radius: 20px;
        padding: 7px 10px;
        background: transparent;
      }
      #theme-orange .orange-reading-paper {
        min-width: 0;
        padding: clamp(24px, 4vw, 64px);
        background: var(--orange-surface);
        border: 1px solid var(--orange-line);
        border-radius: 4px 24px 24px 4px;
        box-shadow: 7px 7px 0 var(--orange-soft);
      }
      #theme-orange .orange-reading-wide .orange-reading-layout {
        grid-template-columns: 180px minmax(0, 1fr);
        gap: 25px;
      }
      #theme-orange .orange-reading-wide .orange-reading-paper {
        padding-left: 28px;
        padding-right: 28px;
      }
      #theme-orange .orange-reading-paper .notion {
        font-size: 16px;
        line-height: 2;
        font-family: inherit;
      }
      #theme-orange .orange-reading-paper .notion-page {
        padding: 0;
        max-width: none;
      }
      #theme-orange .orange-reading-paper .notion-h {
        scroll-margin-top: 65px;
        font-family: 'Songti SC', 'SimSun', serif;
        line-height: 1.6;
        color: var(--orange-ink);
        margin-top: 2em;
      }
      #theme-orange .orange-reading-paper .notion-h1 {
        font-size: 29px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--orange-line);
      }
      #theme-orange .orange-reading-paper .notion-h2 {
        font-size: 24px;
      }
      #theme-orange .orange-reading-paper .notion-h3 {
        font-size: 20px;
      }
      #theme-orange .orange-reading-paper .notion-text {
        padding: 8px 0;
      }
      #theme-orange .orange-reading-paper .notion-quote {
        margin: 26px 0;
        padding: 18px 24px;
        background: var(--orange-soft);
        border-left: 3px solid var(--orange-accent);
        border-radius: 0 12px 12px 0;
        font-size: 17px;
      }
      #theme-orange .orange-reading-paper .notion-callout {
        background: var(--orange-soft);
        border: 1px solid var(--orange-line);
        border-radius: 14px;
        padding: 20px;
      }
      #theme-orange .orange-reading-paper .notion-link {
        border-bottom-color: var(--orange-accent);
        color: var(--orange-accent);
      }
      #theme-orange .orange-reading-paper .notion-code {
        border: 1px solid var(--orange-line);
        border-radius: 14px;
        margin: 24px 0;
        max-width: 100%;
        overflow-x: auto;
        font-size: 13px;
      }
      #theme-orange .orange-reading-paper figure {
        margin: 26px 0;
        max-width: 100%;
      }
      #theme-orange .orange-reading-paper figure img {
        border-radius: 12px;
      }
      #theme-orange .orange-reading-paper .notion-table {
        overflow-x: auto;
        max-width: 100%;
        display: block;
      }
      #theme-orange .orange-reading-paper .notion-equation-block {
        max-width: 100%;
        overflow-x: auto;
      }
      #theme-orange .orange-story-end {
        text-align: center;
        padding: 54px 0 36px;
        margin-top: 38px;
        border-top: 1px solid var(--orange-line);
      }
      #theme-orange .orange-story-end > span {
        font-size: 35px;
        color: var(--orange-accent);
      }
      #theme-orange .orange-story-end p {
        font:
          24px 'Songti SC',
          'SimSun',
          serif;
        margin: 16px 0 10px;
      }
      #theme-orange .orange-story-end small {
        font-size: 11px;
        color: var(--orange-muted);
      }
      #theme-orange .orange-story-tags {
        justify-content: center;
        margin-top: 25px;
      }
      #theme-orange .orange-adjacent {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 14px;
        border-top: 1px solid var(--orange-line);
        padding: 28px 0;
      }
      #theme-orange .orange-adjacent a {
        padding: 20px;
        background: var(--orange-soft);
        border-radius: 12px;
        display: grid;
        gap: 10px;
      }
      #theme-orange .orange-adjacent small {
        font-size: 10px;
        color: var(--orange-muted);
      }
      #theme-orange .orange-adjacent strong {
        font-size: 14px;
        font-weight: 500;
      }
      #theme-orange .orange-lock-room {
        padding: 55px;
        text-align: center;
        max-width: 680px;
        border-radius: 24px;
      }
      #theme-orange .orange-lock-symbol {
        font-size: 60px;
        color: var(--orange-accent);
      }
      #theme-orange .orange-lock-room .orange-search {
        text-align: left;
        margin-top: 32px;
      }
      #theme-orange .orange-immersive .orange-world-title h1 {
        font-size: clamp(32px, 3vw, 58px);
        line-height: 1.5;
      }
      #theme-orange .orange-immersive .orange-world-title {
        top: 19%;
        left: 5%;
      }
      #theme-orange .orange-world-coordinate {
        letter-spacing: 0.16em;
      }
      #theme-orange .orange-world-sky {
        background:
          radial-gradient(ellipse at 75% 25%, #eed4a0 0, transparent 48%),
          radial-gradient(ellipse at 12% 65%, #a8c4b8 0, transparent 55%),
          linear-gradient(155deg, #dfe4d5, #bed2c5 53%, #dec2a7);
      }
      #theme-orange .orange-environment-control {
        position: absolute;
        top: 104px;
        left: 5%;
        z-index: 4;
      }
      #theme-orange .orange-environment-picker {
        display: flex;
        align-items: center;
        width: fit-content;
        height: 44px;
        padding: 0 14px;
        gap: 10px;
        border: 1px solid #fff7;
        border-radius: 24px;
        background: #faf7ec99;
        box-shadow: 0 5px 20px #30493f09;
        color: var(--orange-ink);
        cursor: pointer;
        transition: background-color 0.3s;
      }
      #theme-orange .orange-environment-picker:focus-within {
        outline: 2px solid var(--orange-accent);
        outline-offset: 4px;
      }
      #theme-orange .orange-environment-picker select {
        appearance: none;
        background: transparent;
        color: inherit;
        font-size: 12px;
        letter-spacing: 0.08em;
        border: 0;
        border-radius: 0;
        padding: 0;
        height: 100%;
        min-width: 82px;
        outline: none;
        cursor: pointer;
      }
      #theme-orange .orange-environment-picker option {
        background: var(--orange-surface);
        color: var(--orange-ink);
      }
      #theme-orange .orange-environment-note {
        margin: 9px 0 0 4px;
        font-size: 10px;
        letter-spacing: 0.12em;
        color: var(--orange-muted);
      }
      .dark #theme-orange .orange-environment-picker {
        background: #223a3fbb;
        border-color: #dce8e344;
      }
      #theme-orange [data-environment='rain'] .orange-world-sky {
        background:
          radial-gradient(ellipse at 70% 15%, #d6d4ba77, transparent 48%),
          linear-gradient(150deg, #c7d5d5, #9cb8b8 55%, #a4b5be);
      }
      #theme-orange [data-environment='snow'] .orange-world-sky {
        background:
          radial-gradient(ellipse at 75% 20%, #fff0cf, transparent 45%),
          linear-gradient(155deg, #e3edef, #c9dce2 55%, #d5d7e7);
      }
      #theme-orange [data-environment='desert'] .orange-world-sky {
        background:
          radial-gradient(ellipse at 75% 20%, #ffe2a4, transparent 50%),
          linear-gradient(155deg, #e8d7af, #e4bd8e 55%, #d29e80);
      }
      .dark #theme-orange [data-environment='rain'] .orange-world-sky {
        background:
          radial-gradient(ellipse at 70% 20%, #576177, transparent 65%),
          linear-gradient(150deg, #1a343b, #2f4a53, #3d465a);
      }
      .dark #theme-orange [data-environment='snow'] .orange-world-sky {
        background:
          radial-gradient(ellipse at 75% 20%, #67627c, transparent 60%),
          linear-gradient(150deg, #253d51, #455870, #5c5d76);
      }
      .dark #theme-orange [data-environment='desert'] .orange-world-sky {
        background:
          radial-gradient(ellipse at 75% 20%, #99747466, transparent 60%),
          linear-gradient(150deg, #3e3d56, #6e5364, #886550);
      }
      #theme-orange .compat-weather {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
        z-index: 2;
      }
      #theme-orange .compat-weather i {
        position: absolute;
        top: -10%;
        width: 1px;
        height: 24px;
        background: #e1f0f7bb;
        animation: orange-weather-fall linear infinite;
      }
      #theme-orange [data-environment='snow'] .compat-weather i {
        width: 5px;
        height: 5px;
        background: #fffef4;
        border-radius: 50%;
      }
      #theme-orange .orange-compat[data-ambience='false'] .compat-weather {
        display: none;
      }
      @keyframes orange-weather-fall {
        to {
          transform: translate(-35px, 110vh);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        #theme-orange .compat-weather {
          display: none;
        }
      }
      #theme-orange .orange-island-pass {
        position: absolute;
        left: 5%;
        top: 50%;
        width: 202px;
        z-index: 3;
        pointer-events: none;
      }
      #theme-orange .orange-island-pass > p {
        font-size: 8px;
        letter-spacing: 0.16em;
        color: var(--orange-muted);
        margin-bottom: 12px;
      }
      #theme-orange .orange-pass-stamps {
        display: flex;
        gap: 8px;
      }
      #theme-orange .orange-pass-stamps span {
        width: 30px;
        height: 30px;
        border: 1px dashed currentColor;
        color: #53705b80;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-size: 14px;
        transition: all 0.4s;
      }
      #theme-orange .orange-pass-stamps span[data-found='true'] {
        background: #526d58;
        color: #fff1d8;
        border: 1px solid #526d58;
        transform: rotate(-12deg);
      }
      .dark #theme-orange .orange-pass-stamps span {
        color: #b9c9b5;
      }
      .dark #theme-orange .orange-pass-stamps span[data-found='true'] {
        color: #fff1d8;
      }
      #theme-orange .orange-pass-action {
        pointer-events: auto;
        margin-top: 18px;
        padding: 9px 14px;
        background: #f9f2e8bb;
        border: 1px solid #ffffff66;
        border-radius: 30px;
        font-size: 11px;
        color: #4c624f;
        transition: transform 0.25s;
      }
      #theme-orange .orange-pass-action:hover {
        transform: translateY(-3px);
      }
      #theme-orange .orange-souvenir {
        pointer-events: auto;
        width: 235px;
        margin-top: 16px;
        padding: 20px;
        background: var(--orange-surface);
        border: 1px solid var(--orange-line);
        border-radius: 16px;
        box-shadow: 0 12px 40px #30493f18;
        animation: orange-note-arrive 0.5s ease both;
      }
      #theme-orange .orange-souvenir > span {
        color: var(--orange-accent);
        font-size: 10px;
      }
      #theme-orange .orange-souvenir p {
        font:
          20px/1.5 'Songti SC',
          'SimSun',
          serif;
        margin: 10px 0;
      }
      #theme-orange .orange-souvenir a {
        display: block;
        font-size: 11px;
        line-height: 1.8;
        color: var(--orange-muted);
      }
      #theme-orange .orange-souvenir button {
        display: block;
        padding: 0;
        border: 0;
        background: none;
        margin-top: 12px;
        font-size: 10px;
        color: var(--orange-accent);
      }
      #theme-orange .orange-immersive .orange-focus-card {
        border-radius: 20px;
        box-shadow: 0 15px 45px #30493f18;
        border: 1px solid #fff7;
      }
      #theme-orange .orange-immersive .orange-focus-card > p {
        font-size: 11px;
        color: var(--orange-muted);
        margin: 12px 0;
      }
      #theme-orange .orange-compat-notice {
        font-size: 9px;
        opacity: 0.8;
      }
      #theme-orange .orange-performance-toggle {
        position: absolute;
        top: 104px;
        right: 5%;
        z-index: 3;
        padding: 9px 14px;
        border-radius: 24px;
        background: #f9f2e866;
        border: 1px solid #fff5;
        font-size: 10px;
        color: var(--orange-muted);
      }
      #theme-orange .compat-gift {
        position: absolute;
        top: 40%;
        right: 25%;
        z-index: 2;
        border: 1px solid #fff8;
        background: #fff2d955;
        border-radius: 50%;
        width: 46px;
        height: 46px;
        font-size: 25px;
        box-shadow: 0 10px 30px #97714722;
        transition: transform 0.4s;
      }
      #theme-orange .compat-gift:hover {
        transform: translateY(-6px) rotate(-15deg);
      }
      #theme-orange .orange-studio[data-harvested='true'] .compat-gift {
        transform: scale(0.8) rotate(20deg);
      }
      @keyframes orange-note-arrive {
        from {
          opacity: 0;
          transform: translateY(12px) rotate(-3deg);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      @media (min-width: 1600px) {
        #theme-orange .orange-reading-room {
          max-width: 1390px;
        }
        #theme-orange .orange-reading-paper {
          padding: 60px 80px;
        }
      }
      @media (max-width: 1100px) {
        #theme-orange .orange-post-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        #theme-orange .orange-island-pass {
          top: 45%;
          width: 170px;
        }
        #theme-orange .orange-reading-layout {
          grid-template-columns: 170px minmax(0, 1fr);
          gap: 30px;
        }
      }
      @media (max-width: 760px) {
        #theme-orange:not(:has(.orange-immersive)) .orange-header {
          position: relative;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 17px 0;
          padding: 22px 0 18px;
          min-height: 0;
        }
        #theme-orange:not(:has(.orange-immersive))
          .orange-header
          .orange-brand {
          grid-column: 1 / -1;
          max-width: calc(100% - 80px);
          font-size: 18px;
        }
        #theme-orange:not(:has(.orange-immersive))
          .orange-header
          .orange-brand
          > span:first-child {
          font-size: 28px;
        }
        #theme-orange:not(:has(.orange-immersive)) .orange-header nav {
          display: flex;
          grid-column: 1 / -1;
          grid-row: 2;
          flex-wrap: nowrap;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
          max-width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
        }
        #theme-orange:not(:has(.orange-immersive))
          .orange-header
          nav
          > a:not(.orange-round-button) {
          grid-row: 2;
          font-size: 11px;
          flex-shrink: 0;
          white-space: nowrap;
          text-align: center;
        }
        #theme-orange:not(:has(.orange-immersive))
          .orange-header
          .orange-round-button {
          position: absolute;
          width: 32px;
          height: 32px;
          top: 25px;
          right: 0;
        }
        #theme-orange:not(:has(.orange-immersive))
          .orange-header
          a.orange-round-button {
          right: 40px;
        }
        #theme-orange .orange-header {
          min-height: 90px;
        }
        #theme-orange .orange-post-grid {
          grid-template-columns: 1fr;
          gap: 22px;
        }
        #theme-orange .orange-post-copy {
          padding: 22px;
        }
        #theme-orange .orange-post-cover {
          aspect-ratio: 1.85;
        }
        #theme-orange .orange-page-heading {
          padding: 24px 0 34px;
        }
        #theme-orange .orange-archive {
          grid-template-columns: 1fr;
          gap: 10px;
        }
        #theme-orange .orange-archive h2 {
          grid-row: auto;
        }
        #theme-orange .orange-archive a {
          grid-column: 1;
        }
        #theme-orange .orange-reading-room {
          margin: 14px auto 55px;
        }
        #theme-orange .orange-breadcrumb {
          margin: 16px 0 25px;
        }
        #theme-orange .orange-story-hero {
          grid-template-columns: 1fr;
          padding: 12px 0 25px;
          gap: 20px;
          margin-bottom: 25px;
          min-height: 0;
        }
        #theme-orange .orange-story-heading h1 {
          font-size: 31px;
          line-height: 1.5;
        }
        #theme-orange .orange-story-art {
          height: 195px;
          max-width: 300px;
          width: 100%;
          margin: auto;
        }
        #theme-orange .orange-paper-book {
          scale: 0.72;
          top: -15px;
        }
        #theme-orange .orange-reading-layout,
        #theme-orange .orange-reading-wide .orange-reading-layout {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        #theme-orange .orange-reading-aside {
          position: static;
          width: 100%;
        }
        #theme-orange .orange-reading-compass {
          display: none;
        }
        #theme-orange .orange-toc {
          border: 1px solid var(--orange-line);
          border-radius: 12px;
          padding: 8px 16px;
          background: var(--orange-surface);
        }
        #theme-orange .orange-toc nav {
          max-height: 220px;
        }
        #theme-orange .orange-reading-settings {
          margin-top: 12px;
        }
        #theme-orange .orange-reading-paper,
        #theme-orange .orange-reading-wide .orange-reading-paper {
          width: 100%;
          padding: 25px 19px;
          border-radius: 16px;
          box-shadow: 4px 5px 0 var(--orange-soft);
        }
        #theme-orange .orange-reading-paper .notion {
          font-size: 15px;
          line-height: 1.95;
        }
        #theme-orange .orange-reading-paper .notion-h1 {
          font-size: 25px;
        }
        #theme-orange .orange-reading-paper .notion-h2 {
          font-size: 22px;
        }
        #theme-orange .orange-story-end {
          margin-top: 30px;
          padding-top: 35px;
        }
        #theme-orange .orange-immersive .orange-world-title {
          left: 7%;
          top: 148px;
        }
        #theme-orange .orange-environment-control {
          top: 82px;
          left: 7%;
        }
        #theme-orange .orange-environment-note {
          display: none;
        }
        #theme-orange .orange-immersive .orange-world-title h1 {
          font-size: 29px;
        }
        #theme-orange .orange-island-pass {
          top: auto;
          bottom: 150px;
          left: 18px;
          width: auto;
        }
        #theme-orange .orange-performance-toggle {
          top: 82px;
          font-size: 9px;
          padding: 7px 10px;
        }
        #theme-orange .orange-island-pass > p,
        #theme-orange .orange-pass-stamps {
          display: none;
        }
        #theme-orange .orange-pass-action {
          background: var(--orange-surface);
          border-color: var(--orange-line);
          box-shadow: 0 5px 18px #30493f10;
        }
        #theme-orange .orange-souvenir {
          position: absolute;
          bottom: 50px;
          left: 0;
          width: 240px;
        }
        #theme-orange .compat-gift {
          top: 34%;
          right: 23%;
          width: 40px;
          height: 40px;
          font-size: 22px;
        }
        #theme-orange .orange-lock-room {
          padding: 30px 22px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        #theme-orange *,
        #theme-orange *::before,
        #theme-orange *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `}</style>
  )
}

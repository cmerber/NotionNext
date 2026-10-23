import { siteConfig } from '@/lib/config'
import CONFIG from './config'

export function Style() {
  const value = key => siteConfig(key, CONFIG[key], CONFIG)
  return (
    <style jsx global>{`
      #theme-orange {
        --orange-bg: ${value('ORANGE_COLOR_BG')};
        --orange-surface: ${value('ORANGE_COLOR_SURFACE')};
        --orange-text: ${value('ORANGE_COLOR_TEXT')};
        --orange-accent: ${value('ORANGE_COLOR_ACCENT')};
        --orange-muted: #73796e;
        --orange-line: #dcded1;
        --orange-stage: #e7ebde;
        background: var(--orange-bg);
        color: var(--orange-text);
        min-height: 100vh;
        font-family:
          -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
          'Microsoft YaHei', sans-serif;
        font-size: 15px;
        line-height: 1.7;
        padding: 0 5%;
        transition:
          background-color 1s ease,
          color 0.6s ease;
      }
      .dark #theme-orange {
        --orange-bg: ${value('ORANGE_COLOR_BG_DARK')};
        --orange-surface: ${value('ORANGE_COLOR_SURFACE_DARK')};
        --orange-text: ${value('ORANGE_COLOR_TEXT_DARK')};
        --orange-accent: ${value('ORANGE_COLOR_ACCENT_DARK')};
        --orange-muted: #adb8a9;
        --orange-line: #465448;
        --orange-stage: #2b3e34;
      }
      #theme-orange .orange-menu {
        position: relative;
      }
      #theme-orange .orange-menu summary {
        cursor: pointer;
      }
      #theme-orange .orange-menu > div {
        position: absolute;
        top: 100%;
        right: 0;
        min-width: 170px;
        padding: 12px;
        z-index: 20;
        background: var(--orange-surface);
        border: 1px solid var(--orange-line);
        border-radius: 8px;
        box-shadow: 0 10px 25px #0001;
      }
      #theme-orange .orange-menu > div a {
        display: block;
        padding: 6px;
      }
      #theme-orange * {
        box-sizing: border-box;
      }
      #theme-orange a {
        color: inherit;
        text-decoration: none;
      }
      #theme-orange button {
        font: inherit;
        color: inherit;
        cursor: pointer;
      }
      #theme-orange button:disabled {
        cursor: default;
        opacity: 0.55;
      }
      #theme-orange a:focus-visible,
      #theme-orange button:focus-visible,
      #theme-orange input:focus-visible {
        outline: 3px solid var(--orange-accent);
        outline-offset: 5px;
      }
      #theme-orange a:hover {
        color: var(--orange-accent);
      }
      #theme-orange .orange-skip {
        position: fixed;
        top: -100px;
        left: 20px;
        z-index: 100;
        padding: 12px 20px;
        background: var(--orange-surface);
      }
      #theme-orange .orange-skip:focus {
        top: 10px;
      }
      #theme-orange .orange-header {
        max-width: 1500px;
        margin: auto;
        min-height: 112px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        border-bottom: 1px solid var(--orange-line);
      }
      #theme-orange .orange-brand {
        display: flex;
        align-items: center;
        gap: 13px;
        font-size: 22px;
        font-weight: 650;
        letter-spacing: 2px;
      }
      #theme-orange .orange-brand > span:first-child {
        font-size: 35px;
      }
      #theme-orange .orange-brand small {
        display: block;
        font-size: 8px;
        font-weight: 500;
        letter-spacing: 2px;
        color: var(--orange-muted);
        margin-top: 2px;
      }
      #theme-orange .orange-header nav {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 26px;
        font-size: 13px;
      }
      #theme-orange .orange-round-button {
        background: transparent;
        border: 1px solid var(--orange-line);
        border-radius: 50%;
        width: 34px;
        height: 34px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 21px;
      }
      #theme-orange #orange-main {
        max-width: 1500px;
        margin: auto;
        min-height: 60vh;
      }
      #theme-orange .orange-studio {
        display: grid;
        grid-template-columns: minmax(0, 1.95fr) minmax(270px, 1fr);
        margin-top: 38px;
        column-gap: 5%;
      }
      #theme-orange .orange-stage {
        position: relative;
        height: clamp(450px, 43vw, 640px);
        border: 1px solid var(--orange-line);
        border-radius: 24px;
        overflow: hidden;
        background: radial-gradient(
          ellipse at 45% 45%,
          var(--orange-surface),
          var(--orange-stage) 78%
        );
        box-shadow:
          0 22px 65px -38px #75846e70,
          inset 0 1px 0 #ffffff90;
      }
      #theme-orange .orange-stage::before {
        content: '';
        position: absolute;
        width: 210px;
        height: 210px;
        border-radius: 50%;
        background: #fff0d6;
        filter: blur(45px);
        opacity: 0.65;
        right: 4%;
        top: 8%;
        pointer-events: none;
      }
      .dark #theme-orange .orange-stage::before {
        background: #a7b8dc;
        opacity: 0.12;
      }
      #theme-orange .orange-host-intro {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 28px;
      }
      #theme-orange .orange-host-intro img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 3px solid var(--orange-surface);
        box-shadow: 0 4px 12px #302c2310;
      }
      #theme-orange .orange-host-intro > span {
        font-size: 12px;
      }
      #theme-orange .orange-host-intro small {
        display: block;
        margin-top: 3px;
        font-size: 10px;
        color: var(--orange-muted);
      }
      #theme-orange .orange-host-intro .orange-host-status {
        font-size: 9px;
        margin-left: auto;
        color: var(--orange-muted);
        writing-mode: vertical-rl;
        letter-spacing: 2px;
      }
      #theme-orange .orange-welcome-bubble {
        position: absolute;
        z-index: 5;
        left: 50%;
        top: 12%;
        transform: translateX(-50%);
        text-align: center;
        white-space: nowrap;
        border: 1px solid var(--orange-line);
        background: var(--orange-surface);
        border-radius: 20px 20px 20px 4px;
        padding: 14px 22px;
        box-shadow: 0 12px 30px #293c2420;
        font-size: 13px;
        pointer-events: none;
      }
      #theme-orange .orange-welcome-bubble span {
        color: var(--orange-muted);
        font-size: 11px;
      }
      #theme-orange .orange-welcome-bubble[hidden] {
        display: none;
      }
      #theme-orange .orange-stage-label {
        position: absolute;
        top: 22px;
        left: 24px;
        right: 24px;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 8px;
        font: 9px monospace;
        letter-spacing: 1.1px;
        pointer-events: none;
      }
      #theme-orange .orange-stage-label > span:last-child {
        margin-left: auto;
        font: 11px sans-serif;
        letter-spacing: 1px;
        color: var(--orange-muted);
      }
      #theme-orange .orange-live-dot {
        display: inline-block;
        height: 6px;
        width: 6px;
        background: #63855d;
        border-radius: 50%;
      }
      #theme-orange .orange-canvas {
        position: absolute;
        inset: 30px 0 45px;
        cursor: grab;
      }
      #theme-orange .orange-canvas canvas {
        display: block;
        width: 100%;
        height: 100%;
      }
      #theme-orange .orange-scene-message {
        height: 100%;
        display: grid;
        place-items: center;
        color: var(--orange-muted);
      }
      #theme-orange .orange-scene-caption {
        position: absolute;
        bottom: 73px;
        left: 10px;
        right: 10px;
        text-align: center;
        color: var(--orange-muted);
        font-size: 10px;
        letter-spacing: 1px;
        pointer-events: none;
      }
      #theme-orange .orange-scene-controls {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 58px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border-top: 1px solid var(--orange-line);
        background: var(--orange-surface);
        z-index: 3;
      }
      #theme-orange .orange-scene-controls button {
        background: none;
        border: 0;
        padding: 6px 10px;
        border-radius: 5px;
        font-size: 11px;
      }
      #theme-orange .orange-scene-controls button:hover {
        background: var(--orange-bg);
        color: var(--orange-accent);
      }
      #theme-orange .orange-studio-note {
        display: flex;
        flex-direction: column;
        padding-top: 24px;
      }
      #theme-orange .orange-eyebrow {
        color: var(--orange-muted);
        letter-spacing: 2px;
        font: 9px/1.8 monospace;
        margin: 0 0 16px;
      }
      #theme-orange .orange-studio-note h1 {
        text-wrap: balance;
        font-family: 'Songti SC', 'SimSun', Georgia, serif;
        font-size: clamp(30px, 3vw, 47px);
        line-height: 1.6;
        letter-spacing: 1px;
        font-weight: 500;
        max-width: 340px;
        margin: 17px 0 20px;
      }
      #theme-orange .orange-intro {
        color: var(--orange-muted);
        max-width: 310px;
        font-size: 13px;
        line-height: 2;
      }
      #theme-orange .orange-place-note {
        border-top: 1px solid var(--orange-line);
        margin-top: auto;
        padding: 24px 0 0;
      }
      #theme-orange .orange-place-number {
        color: var(--orange-accent);
        font: 9px monospace;
        letter-spacing: 2px;
      }
      #theme-orange .orange-place-note h2 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 21px;
        font-weight: 550;
        margin: 13px 0 8px;
      }
      #theme-orange .orange-place-note h2 span {
        color: var(--orange-accent);
        font-size: 28px;
      }
      #theme-orange .orange-place-note p {
        color: var(--orange-muted);
        font-size: 12px;
        margin-bottom: 16px;
      }
      #theme-orange .orange-latest-note {
        display: block;
        font-size: 11px;
        color: var(--orange-muted);
        margin-bottom: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      #theme-orange .orange-text-link {
        display: inline-flex;
        gap: 26px;
        align-items: center;
        font-size: 12px;
        border-bottom: 1px solid var(--orange-accent);
        padding-bottom: 5px;
        color: var(--orange-accent);
      }
      #theme-orange .orange-handnote {
        font-family: 'Songti SC', Georgia, serif;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: var(--orange-muted);
        margin: 25px 0 0;
      }
      #theme-orange .orange-handnote span {
        font-size: 28px;
        color: var(--orange-accent);
      }
      #theme-orange .orange-place-nav {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        margin-top: 26px;
        border: 1px solid var(--orange-line);
        border-radius: 12px;
        overflow: hidden;
      }
      #theme-orange .orange-place-nav button {
        background: none;
        border: 0;
        border-right: 1px solid var(--orange-line);
        display: flex;
        gap: 16px;
        align-items: center;
        text-align: left;
        padding: 21px 24px;
        transition: background 0.2s;
        min-height: 92px;
      }
      #theme-orange .orange-place-nav button:last-child {
        border-right: 0;
      }
      #theme-orange .orange-place-nav button[aria-pressed='true'],
      #theme-orange .orange-place-nav button:hover {
        background: var(--orange-surface);
      }
      #theme-orange .orange-nav-icon {
        font-size: 27px;
        color: var(--orange-accent);
      }
      #theme-orange .orange-place-nav small {
        display: block;
        font-size: 9px;
        color: var(--orange-muted);
        margin-bottom: 4px;
        letter-spacing: 0.5px;
      }
      #theme-orange .orange-place-nav strong {
        font-size: 14px;
        font-weight: 550;
      }
      #theme-orange .orange-nav-arrow {
        margin-left: auto;
        color: var(--orange-muted);
      }
      #theme-orange .orange-journal-section {
        margin: 65px 0;
      }
      #theme-orange .orange-section-heading {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 28px;
      }
      #theme-orange .orange-section-heading h2 {
        font:
          500 28px 'Songti SC',
          'SimSun',
          Georgia,
          serif;
        margin: 0;
      }
      #theme-orange .orange-section-heading h2 span {
        color: var(--orange-accent);
        padding-left: 14px;
      }
      #theme-orange .orange-section-heading .orange-eyebrow {
        margin-bottom: 12px;
      }
      #theme-orange .orange-post-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 28px;
      }
      #theme-orange .orange-post-card {
        min-width: 0;
        border: 1px solid var(--orange-line);
        border-radius: 10px;
        background: var(--orange-surface);
        overflow: hidden;
        transition:
          transform 0.3s ease,
          box-shadow 0.3s ease;
      }
      #theme-orange .orange-post-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 38px -20px #42664640;
      }
      #theme-orange .orange-post-cover {
        display: block;
        height: 190px;
        overflow: hidden;
        background: var(--orange-stage);
      }
      #theme-orange .orange-post-cover > *,
      #theme-orange .orange-cover-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      #theme-orange .orange-cover-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font:
          70px Georgia,
          serif;
        color: var(--orange-accent);
        background: radial-gradient(
          circle at 30% 10%,
          var(--orange-surface),
          transparent
        );
      }
      #theme-orange .orange-cover-placeholder small {
        font: 8px monospace;
        letter-spacing: 3px;
        padding-top: 18px;
      }
      #theme-orange .orange-post-copy {
        padding: 22px;
      }
      #theme-orange .orange-post-meta {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        color: var(--orange-muted);
        font-size: 10px;
      }
      #theme-orange .orange-post-meta > span {
        color: var(--orange-accent);
      }
      #theme-orange .orange-post-copy h3 {
        font-size: 18px;
        line-height: 1.7;
        margin: 13px 0 12px;
        font-weight: 550;
      }
      #theme-orange .orange-post-copy > p {
        color: var(--orange-muted);
        font-size: 12px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      #theme-orange .orange-read-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 24px;
        font-size: 11px;
      }
      #theme-orange .orange-read-link span {
        font-size: 17px;
        color: var(--orange-accent);
      }
      #theme-orange .orange-page-heading {
        margin: 50px 0 32px;
      }
      #theme-orange .orange-page-heading h1 {
        font:
          500 36px/1.6 'Songti SC',
          'SimSun',
          Georgia,
          serif;
        margin: 12px 0;
      }
      #theme-orange .orange-page-heading > p:last-child {
        color: var(--orange-muted);
      }
      #theme-orange .orange-pagination {
        display: flex;
        justify-content: center;
        gap: 28px;
        align-items: center;
        padding: 35px 0;
        font-size: 13px;
      }
      #theme-orange .orange-button {
        display: inline-block;
        background: var(--orange-accent);
        color: var(--orange-bg);
        border: 0;
        padding: 12px 24px;
        border-radius: 7px;
        font-size: 13px;
      }
      #theme-orange a.orange-button:hover {
        color: var(--orange-bg);
        opacity: 0.85;
      }
      #theme-orange .orange-more {
        display: block;
        margin: 30px auto;
      }
      #theme-orange .orange-search {
        max-width: 740px;
        margin: 25px 0 40px;
      }
      #theme-orange .orange-search label {
        font-size: 12px;
        color: var(--orange-muted);
      }
      #theme-orange .orange-search > div {
        display: flex;
        gap: 12px;
        margin-top: 10px;
      }
      #theme-orange .orange-search input {
        border: 1px solid var(--orange-line);
        border-radius: 7px;
        padding: 13px;
        flex: 1;
        min-width: 0;
        background: var(--orange-surface);
        color: var(--orange-text);
      }
      #theme-orange .orange-archive {
        max-width: 900px;
        margin: 35px 0;
      }
      #theme-orange .orange-archive h2 {
        color: var(--orange-accent);
        font:
          20px Georgia,
          serif;
      }
      #theme-orange .orange-archive a {
        display: flex;
        gap: 20px;
        justify-content: space-between;
        padding: 16px 0;
        border-bottom: 1px solid var(--orange-line);
      }
      #theme-orange .orange-collection {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      #theme-orange .orange-collection a {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        padding: 25px;
        background: var(--orange-surface);
        border: 1px solid var(--orange-line);
        border-radius: 8px;
      }
      #theme-orange .orange-collection small {
        color: var(--orange-muted);
      }
      #theme-orange .orange-reading {
        max-width: 900px;
        margin: 60px auto 80px;
        padding: 40px;
        background: var(--orange-surface);
        border: 1px solid var(--orange-line);
        border-radius: 12px;
      }
      #theme-orange .orange-article-heading {
        margin: 40px 0;
        border-bottom: 1px solid var(--orange-line);
        padding-bottom: 25px;
      }
      #theme-orange .orange-article-heading h1 {
        font-size: 34px;
        line-height: 1.6;
        font-weight: 600;
      }
      #theme-orange .orange-article-heading > p:last-child {
        font-size: 12px;
        color: var(--orange-muted);
      }
      #theme-orange .notion {
        color: var(--orange-text);
      }
      #theme-orange .notion-page {
        width: 100%;
        padding: 0;
      }
      #theme-orange .orange-empty {
        padding: 60px 20px;
        color: var(--orange-muted);
      }
      #theme-orange .orange-lost {
        text-align: center;
        padding: 100px 20px;
      }
      #theme-orange .orange-lost > span {
        font:
          80px Georgia,
          serif;
        color: var(--orange-accent);
      }
      #theme-orange .orange-lost h1 {
        font-size: 28px;
        color: var(--orange-text);
      }
      #theme-orange .orange-lost .orange-button {
        margin-top: 24px;
      }
      #theme-orange .orange-footer {
        max-width: 1500px;
        margin: auto;
        padding: 30px 0;
        border-top: 1px solid var(--orange-line);
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 15px;
        color: var(--orange-muted);
        font-size: 10px;
        letter-spacing: 0.6px;
      }
      #theme-orange .orange-flat-scene {
        height: calc(100% - 60px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 50px 24px;
        text-align: center;
      }
      #theme-orange .orange-flat-orbit {
        font-size: 70px;
      }
      #theme-orange .orange-flat-scene h2 {
        font:
          24px 'Songti SC',
          Georgia,
          serif;
      }
      #theme-orange .orange-flat-scene p {
        color: var(--orange-muted);
        font-size: 12px;
        max-width: 360px;
      }
      #theme-orange .orange-flat-places {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 18px;
      }
      #theme-orange .orange-flat-places button {
        border: 1px solid var(--orange-line);
        border-radius: 6px;
        background: var(--orange-surface);
        padding: 12px;
        font-size: 11px;
      }
      #theme-orange .orange-flat-places button span {
        display: block;
        font-size: 24px;
        color: var(--orange-accent);
      }
      @media (min-width: 1600px) {
        #theme-orange {
          padding: 0 7%;
        }
      }
      @media (max-width: 1050px) {
        #theme-orange {
          padding: 0 4%;
        }
        #theme-orange .orange-header nav {
          gap: 14px;
        }
        #theme-orange .orange-studio {
          column-gap: 4%;
          grid-template-columns: minmax(0, 1.65fr) minmax(240px, 1fr);
        }
        #theme-orange .orange-stage {
          height: 480px;
        }
        #theme-orange .orange-studio-note {
          padding-top: 5px;
        }
        #theme-orange .orange-studio-note h1 {
          font-size: 31px;
          margin-top: 10px;
        }
        #theme-orange .orange-place-nav button {
          padding: 17px 14px;
          gap: 10px;
        }
        #theme-orange .orange-place-nav small {
          font-size: 8px;
        }
        #theme-orange .orange-nav-arrow {
          display: none;
        }
        #theme-orange .orange-post-grid {
          gap: 18px;
        }
      }
      @media (max-width: 760px) {
        #theme-orange {
          padding: 0 16px calc(76px + env(safe-area-inset-bottom));
        }
        body:has(#theme-orange) #draggableBox {
          position: absolute;
          left: auto !important;
          top: 24px !important;
          right: 16px;
          bottom: auto;
          border-radius: 50%;
        }
        body:has(#theme-orange) #draggableBox [data-drag-handle],
        body:has(#theme-orange) #draggableBox #themeSelect ~ button,
        body:has(#theme-orange) #themeSelect > span:last-child {
          display: none;
        }
        body:has(#theme-orange) #themeSelect {
          width: 44px;
          height: 44px;
          padding: 0;
          justify-content: center;
          border-radius: 50%;
        }
        #theme-orange .orange-header {
          min-height: 100px;
          padding: 17px 0;
          flex-wrap: wrap;
          gap: 17px;
        }
        #theme-orange .orange-brand {
          max-width: calc(100% - 64px);
          font-size: 19px;
        }
        #theme-orange .orange-brand small {
          font-size: 7px;
        }
        #theme-orange .orange-header nav {
          width: 100%;
          justify-content: flex-start;
          gap: 12px;
          font-size: 12px;
        }
        #theme-orange .orange-header nav > a {
          display: inline-flex;
          align-items: center;
          min-height: 44px;
        }
        #theme-orange .orange-header .orange-round-button {
          width: 44px;
          height: 44px;
          font-size: 18px;
        }
        #theme-orange .orange-studio {
          display: flex;
          flex-direction: column;
          margin-top: 16px;
        }
        #theme-orange .orange-stage {
          height: clamp(400px, 108vw, 520px);
          order: 1;
          margin-top: 16px;
        }
        #theme-orange .orange-studio-note {
          display: contents;
        }
        #theme-orange .orange-studio-note > div:first-child {
          order: 0;
        }
        #theme-orange .orange-studio-note h1 {
          max-width: none;
          margin: 5px 0 10px;
          font-size: 28px;
          line-height: 1.4;
        }
        #theme-orange .orange-intro {
          max-width: none;
          margin: 0;
          font-size: 12px;
        }
        #theme-orange .orange-studio-note .orange-eyebrow {
          display: none;
        }
        #theme-orange .orange-place-note {
          order: 3;
          padding-top: 20px;
          margin-top: 22px;
        }
        #theme-orange .orange-handnote {
          display: none;
        }
        #theme-orange .orange-place-nav {
          order: 2;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 18px;
        }
        #theme-orange .orange-place-nav button:nth-child(2) {
          border-right: 0;
        }
        #theme-orange .orange-place-nav button:nth-child(-n + 2) {
          border-bottom: 1px solid var(--orange-line);
        }
        #theme-orange .orange-scene-controls {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          padding: 8px;
          min-height: 108px;
          height: auto;
          gap: 4px;
        }
        #theme-orange .orange-canvas {
          bottom: 108px;
        }
        #theme-orange .orange-scene-caption {
          bottom: 120px;
          font-size: 10px;
        }
        #theme-orange .orange-host-intro {
          margin-bottom: 12px;
        }
        #theme-orange .orange-host-intro .orange-host-status {
          writing-mode: horizontal-tb;
          max-width: 75px;
          text-align: right;
          line-height: 1.7;
          letter-spacing: 1px;
        }
        #theme-orange .orange-welcome-bubble {
          max-width: calc(100% - 24px);
          white-space: normal;
          width: max-content;
          padding: 10px 14px;
          font-size: 12px;
          top: 15%;
        }
        #theme-orange .orange-welcome-bubble span {
          font-size: 10px;
        }
        #theme-orange .orange-scene-controls button {
          min-height: 44px;
          font-size: 11px;
          padding: 8px;
        }
        #theme-orange .orange-place-nav button {
          min-height: 76px;
        }
        #theme-orange .orange-journal-section {
          margin: 40px 0;
        }
        #theme-orange .orange-section-heading h2 {
          font-size: 23px;
        }
        #theme-orange .orange-post-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        #theme-orange .orange-post-cover {
          height: 160px;
        }
        #theme-orange .orange-post-copy {
          padding: 16px;
        }
        #theme-orange .orange-post-copy h3 {
          font-size: 16px;
        }
        #theme-orange .orange-collection {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        #theme-orange .orange-reading {
          margin: 25px auto 40px;
          padding: 22px 16px;
        }
        #theme-orange .orange-article-heading h1 {
          font-size: 27px;
        }
        #theme-orange .orange-footer {
          flex-direction: column;
          gap: 8px;
        }
      }
      @media (max-width: 430px) {
        #theme-orange .orange-post-grid,
        #theme-orange .orange-collection {
          grid-template-columns: 1fr;
        }
        #theme-orange .orange-stage-label {
          left: 15px;
          right: 15px;
          font-size: 8px;
        }
        #theme-orange .orange-post-cover {
          height: 195px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        #theme-orange *,
        #theme-orange *::before,
        #theme-orange *::after {
          transition: none !important;
          animation: none !important;
          scroll-behavior: auto !important;
        }
      }
    `}</style>
  )
}

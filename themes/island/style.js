import { siteConfig } from '@/lib/config'
import CONFIG from './config'

export function Style() {
  return (
    <style jsx global>{`
      #theme-island {
        --island-bg: ${siteConfig('ISLAND_COLOR_BG', CONFIG.ISLAND_COLOR_BG, CONFIG)};
        --island-ink: ${siteConfig('ISLAND_COLOR_INK', CONFIG.ISLAND_COLOR_INK, CONFIG)};
        --island-accent: ${siteConfig('ISLAND_COLOR_ACCENT', CONFIG.ISLAND_COLOR_ACCENT, CONFIG)};
        --island-surface: ${siteConfig('ISLAND_COLOR_SURFACE', CONFIG.ISLAND_COLOR_SURFACE, CONFIG)};
        --island-muted: #7c8475;
        --island-border: rgba(65, 82, 61, 0.16);
        background: var(--island-bg);
        color: var(--island-ink);
        min-height: 100vh;
        font-family: Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .dark #theme-island {
        --island-bg: #1b2b2d;
        --island-ink: #ece8d7;
        --island-surface: #243638;
        --island-muted: #b1bbae;
        --island-border: rgba(224, 230, 207, 0.18);
        --island-accent: #b9c5a4;
      }
      #theme-island * {
        box-sizing: border-box;
      }
      #theme-island button,
      #theme-island input {
        font: inherit;
      }
      #theme-island a {
        color: inherit;
        text-decoration: none;
      }
      #theme-island button {
        cursor: pointer;
      }
      #theme-island button:disabled {
        opacity: 0.35;
        cursor: default;
      }
      #theme-island :focus-visible {
        outline: 2px solid #b88a49;
        outline-offset: 5px;
      }
      #theme-island h1,
      #theme-island h2,
      #theme-island h3,
      #theme-island p {
        margin: 0;
      }
      #theme-island h1,
      #theme-island h2 {
        font-family: Georgia, 'Songti SC', 'Noto Serif SC', SimSun, serif;
        font-weight: 400;
      }
      #theme-island .island-eyebrow {
        font:
          10px/1.8 Arial,
          sans-serif;
        letter-spacing: 0.2em;
        color: var(--island-muted);
      }
      #theme-island .island-skip {
        position: fixed;
        top: 8px;
        left: 8px;
        z-index: 150;
        transform: translateY(-160%);
        background: var(--island-surface);
        padding: 14px;
      }
      #theme-island .island-skip:focus {
        transform: none;
      }
      #theme-island .island-header {
        height: 100px;
        padding: 0 4.5%;
        display: flex;
        align-items: center;
        gap: 32px;
        position: relative;
        z-index: 25;
        border-bottom: 1px solid var(--island-border);
      }
      #theme-island:has(.island-explore) .island-header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        border: 0;
      }
      #theme-island .island-brand {
        display: flex;
        align-items: center;
        gap: 13px;
        margin-right: auto;
        font-size: 19px;
        font-weight: 600;
        white-space: nowrap;
      }
      #theme-island .island-brand small {
        display: block;
        font-size: 8px;
        letter-spacing: 0.21em;
        margin-top: 6px;
        font-weight: 400;
      }
      #theme-island .island-brand-symbol {
        position: relative;
        font:
          42px Georgia,
          serif;
        color: #748667;
      }
      #theme-island .island-brand-symbol i {
        font: 18px Georgia;
        position: absolute;
        right: -6px;
        top: -2px;
        color: #b68b47;
      }
      #theme-island .island-header nav {
        display: flex;
        gap: 28px;
        font-size: 12px;
      }
      #theme-island .island-header nav a {
        position: relative;
        padding: 12px 0;
      }
      #theme-island .island-header nav a:after {
        content: '';
        position: absolute;
        bottom: 4px;
        left: 0;
        width: 0;
        height: 1px;
        background: currentColor;
        transition: width 0.25s;
      }
      #theme-island .island-header nav a:hover:after,
      #theme-island .island-header nav a[aria-current]:after {
        width: 100%;
      }
      #theme-island .island-header-actions {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      #theme-island .island-header-actions > button,
      #theme-island .island-header-actions > a {
        display: grid;
        place-items: center;
        width: 38px;
        height: 38px;
        border: 1px solid var(--island-border);
        border-radius: 50%;
        background: transparent;
        font-size: 20px;
        transition: background 0.2s;
      }
      #theme-island .island-header-actions > button:hover,
      #theme-island .island-header-actions > a:hover {
        background: rgba(255, 255, 255, 0.25);
      }
      #theme-island .island-header-actions > .island-menu-toggle {
        display: none;
      }
      #theme-island .island-explore {
        position: relative;
        width: 100%;
        height: max(790px, 100svh);
        overflow: hidden;
        isolation: isolate;
        background:
          radial-gradient(ellipse at 82% 20%, #e9dab0 0, transparent 47%),
          radial-gradient(ellipse at 15% 80%, #c7d5c5 0, transparent 60%),
          #eeeade;
      }
      .dark #theme-island .island-explore {
        background:
          radial-gradient(ellipse at 82% 20%, #3c5260 0, transparent 47%),
          radial-gradient(ellipse at 15% 80%, #304b46 0, transparent 60%),
          #253941;
      }
      #theme-island .island-canvas {
        position: absolute;
        inset: 0;
        touch-action: pan-y pinch-zoom;
        cursor: grab;
      }
      #theme-island .island-canvas:active {
        cursor: grabbing;
      }
      #theme-island .island-canvas canvas {
        display: block;
        width: 100%;
        height: 100%;
      }
      #theme-island .island-intro {
        position: absolute;
        top: 23%;
        left: 5.4%;
        width: 260px;
        pointer-events: none;
        transition:
          opacity 0.5s,
          transform 0.5s;
      }
      #theme-island .island-intro-away {
        opacity: 0;
        transform: translateX(-15px);
        visibility: hidden;
      }
      #theme-island .island-live-dot {
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #748a66;
        margin-right: 7px;
      }
      #theme-island .island-intro .island-eyebrow {
        font-size: 8px;
        letter-spacing: 0.17em;
      }
      #theme-island .island-intro h1 {
        font-size: clamp(34px, 3.4vw, 65px);
        line-height: 1.6;
        letter-spacing: 0.03em;
        margin: 25px 0 20px;
        max-width: 5em;
        text-wrap: balance;
      }
      #theme-island .island-intro h1 span {
        display: block;
        white-space: nowrap;
      }
      #theme-island .island-intro-deck {
        font-size: 12px;
        line-height: 2.1;
        color: var(--island-muted);
      }
      #theme-island .island-explore-cta {
        margin-top: 30px;
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 28px;
        background: var(--island-ink);
        color: var(--island-bg);
        border: 0;
        border-radius: 30px;
        font-size: 12px;
        padding: 14px 20px;
        transition: transform 0.2s;
      }
      #theme-island .island-explore-cta:hover {
        transform: translateY(-3px);
      }
      #theme-island .island-passport {
        margin-top: 65px;
      }
      #theme-island .island-passport > span {
        font-size: 8px;
        letter-spacing: 0.2em;
        color: var(--island-muted);
      }
      #theme-island .island-passport > div {
        display: flex;
        gap: 8px;
        margin: 12px 0;
      }
      #theme-island .island-passport button {
        pointer-events: auto;
        width: 29px;
        height: 29px;
        border: 1px dashed var(--island-border);
        border-radius: 50%;
        font: 9px Georgia;
        background: transparent;
      }
      #theme-island .island-passport button[aria-pressed='true'] {
        background: var(--island-accent);
        color: var(--island-bg);
        border-style: solid;
      }
      #theme-island .island-passport small {
        font-size: 9px;
        color: var(--island-muted);
      }
      #theme-island .island-world-label {
        position: absolute;
        top: 21%;
        right: 5%;
        text-align: right;
        pointer-events: none;
      }
      #theme-island .island-world-label > span {
        font-size: 11px;
        letter-spacing: 0.2em;
      }
      #theme-island .island-world-label small {
        display: block;
        font-size: 7px;
        letter-spacing: 0.2em;
        margin: 9px 0 25px;
        color: var(--island-muted);
      }
      #theme-island .island-world-label i {
        font: italic 18px Georgia;
        color: var(--island-muted);
      }
      #theme-island .island-markers {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      #theme-island .island-markers button {
        position: absolute;
        left: 0;
        top: 0;
        visibility: hidden;
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 8px;
        border: 0;
        background: transparent;
        padding: 8px;
      }
      #theme-island .island-markers button > span {
        width: 28px;
        height: 28px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(255, 253, 236, 0.7);
        border-radius: 50%;
        background: rgba(247, 243, 227, 0.87);
        font: 10px Georgia;
        color: #445a43;
        box-shadow: 0 2px 12px #35472c16;
      }
      #theme-island .island-markers strong {
        width: 0;
        opacity: 0;
        overflow: hidden;
        white-space: nowrap;
        font-size: 11px;
        font-weight: 400;
        transition: opacity 0.2s;
        background: var(--island-surface);
        border-radius: 20px;
      }
      #theme-island .island-markers button:hover strong,
      #theme-island .island-markers button:focus-visible strong {
        width: auto;
        padding: 8px 12px;
        opacity: 1;
      }
      #theme-island .island-controls {
        position: absolute;
        top: 43%;
        right: 3%;
        display: flex;
        flex-direction: column;
        gap: 7px;
        padding: 8px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        background: rgba(255, 253, 242, 0.22);
        border-radius: 28px;
        backdrop-filter: blur(12px);
      }
      #theme-island .island-controls button {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: transparent;
        border: 0;
        font-size: 19px;
        transition: background 0.2s;
      }
      #theme-island .island-controls button:hover {
        background: rgba(255, 255, 255, 0.4);
      }
      #theme-island .island-controls > span {
        height: 1px;
        background: var(--island-border);
        margin: 2px 6px;
      }
      #theme-island .island-dock-wrap {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 30px;
        width: min(660px, 90%);
        text-align: center;
      }
      #theme-island .island-dock-wrap > p {
        font-size: 9px;
        color: var(--island-muted);
        letter-spacing: 0.08em;
        margin-bottom: 14px;
      }
      #theme-island .island-dock {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        padding: 7px;
        border: 1px solid rgba(255, 255, 255, 0.65);
        border-radius: 25px;
        background: rgba(255, 253, 245, 0.53);
        box-shadow: 0 10px 45px #42513c08;
        backdrop-filter: blur(16px);
      }
      .dark #theme-island .island-dock,
      .dark #theme-island .island-controls {
        background: rgba(26, 44, 45, 0.55);
        border-color: var(--island-border);
      }
      #theme-island .island-dock button {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: center;
        min-height: 58px;
        border: 0;
        border-radius: 19px;
        background: transparent;
        transition: background 0.3s;
      }
      #theme-island .island-dock button > span {
        font-size: 23px;
        color: #a3885c;
      }
      #theme-island .island-dock strong {
        font-weight: 400;
        font-size: 11px;
      }
      #theme-island .island-dock small {
        font: 8px Georgia;
        color: var(--island-muted);
      }
      #theme-island .island-dock button:hover,
      #theme-island .island-dock button[aria-pressed='true'] {
        background: rgba(255, 255, 255, 0.6);
      }
      .dark #theme-island .island-dock button:hover,
      .dark #theme-island .island-dock button[aria-pressed='true'] {
        background: #ffffff16;
      }
      #theme-island .island-dock-wrap > a {
        display: inline-block;
        font-size: 9px;
        color: var(--island-muted);
        margin-top: 20px;
      }
      #theme-island .island-dock-wrap > a span {
        margin-left: 15px;
      }
      #theme-island .island-place-card {
        position: absolute;
        left: 5%;
        top: 28%;
        width: 290px;
        padding: 30px;
        border: 1px solid rgba(255, 255, 255, 0.6);
        border-radius: 5px 30px 5px 30px;
        background: var(--island-surface);
        box-shadow: 0 20px 70px #3e4e3012;
        animation: island-note-in 0.5s both;
      }
      #theme-island .island-close {
        position: absolute;
        top: 12px;
        right: 12px;
        display: grid;
        place-items: center;
        width: 30px;
        height: 30px;
        font-size: 20px;
        border: 0;
        background: transparent;
      }
      #theme-island .island-place-card .island-eyebrow {
        font-size: 8px;
        letter-spacing: 0.16em;
        margin: 12px 0 20px;
      }
      #theme-island .island-place-card h2 {
        font-size: 28px;
        display: flex;
        align-items: center;
        gap: 14px;
      }
      #theme-island .island-place-card h2 > span {
        font-size: 25px;
        color: #ab8857;
      }
      #theme-island .island-place-card > p:not(.island-eyebrow) {
        font-size: 12px;
        line-height: 2;
        color: var(--island-muted);
        margin: 20px 0;
      }
      #theme-island .island-text-link {
        display: inline-block;
        font-size: 12px;
        padding: 6px 0;
        border: 0;
        border-bottom: 1px solid #a58a5b;
        background: transparent;
        color: var(--island-ink);
      }
      #theme-island .island-card-notes {
        border-top: 1px solid var(--island-border);
        margin-top: 24px;
        padding-top: 8px;
      }
      #theme-island .island-card-notes a {
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: space-between;
        font-size: 11px;
        line-height: 1.8;
        margin-top: 14px;
      }
      #theme-island .island-card-notes a > span {
        color: #a58a5b;
      }
      #theme-island .island-arrival {
        position: absolute;
        inset: 0;
        z-index: 20;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: var(--island-bg);
        transition:
          opacity 0.7s,
          visibility 0.7s;
      }
      #theme-island .island-arrived {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
      }
      #theme-island .island-arrival-emblem {
        position: relative;
        font: 80px Georgia;
        line-height: 1;
        color: #839075;
        margin-bottom: 40px;
      }
      #theme-island .island-arrival-emblem i {
        font: 27px Georgia;
        position: absolute;
        top: -8px;
        right: -13px;
        color: #b99a61;
      }
      #theme-island .island-arrival h2 {
        font-size: 28px;
        margin: 22px 0 16px;
      }
      #theme-island .island-arrival > p[role] {
        color: var(--island-muted);
        font-size: 11px;
      }
      #theme-island .island-arrival-line {
        display: block;
        width: 190px;
        height: 1px;
        background: var(--island-border);
        margin: 30px;
        overflow: hidden;
      }
      #theme-island .island-arrival-line i {
        display: block;
        width: 40%;
        height: 100%;
        background: #9c956e;
        animation: island-arrival 1.7s ease-in-out infinite;
      }
      #theme-island .island-arrival > button {
        border: 0;
        background: transparent;
        color: var(--island-muted);
        font-size: 10px;
        padding: 12px;
      }
      #theme-island .island-map {
        position: absolute;
        inset: 12% 10% 18% 22%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      #theme-island .island-map svg {
        width: 100%;
        min-height: 0;
        max-height: 80%;
      }
      #theme-island .island-map-links {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
      }
      #theme-island .island-map-links button {
        background: var(--island-surface);
        border: 1px solid var(--island-border);
        border-radius: 20px;
        padding: 10px 14px;
        font-size: 11px;
      }
      #theme-island .island-map > p {
        margin: 12px;
        font-size: 10px;
        color: var(--island-muted);
      }
      #theme-island .island-journal,
      #theme-island .island-content {
        width: min(1180px, 89%);
        margin: 0 auto;
        padding: 95px 0 110px;
      }
      #theme-island .island-section-heading {
        display: flex;
        justify-content: space-between;
        align-items: end;
        margin-bottom: 40px;
      }
      #theme-island .island-section-heading h2 {
        font-size: 38px;
        margin-top: 16px;
      }
      #theme-island .island-post-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 36px 30px;
      }
      #theme-island .island-post-card {
        border-bottom: 1px solid var(--island-border);
        padding-bottom: 26px;
        min-width: 0;
      }
      #theme-island .island-post-cover {
        display: block;
        aspect-ratio: 1.55;
        overflow: hidden;
        border-radius: 3px 25px 3px 3px;
      }
      #theme-island .island-post-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s;
      }
      #theme-island .island-post-card:hover .island-post-cover img {
        transform: scale(1.04);
      }
      #theme-island .island-note-art {
        width: 100%;
        height: 100%;
        display: block;
        position: relative;
        background: #dce2d0;
        padding: 23px;
        overflow: hidden;
        color: #5b725c;
      }
      #theme-island .island-note-art[data-tone='1'] {
        background: #e9ddc5;
        color: #a58455;
      }
      #theme-island .island-note-art[data-tone='2'] {
        background: #d8dfdf;
        color: #6d838c;
      }
      #theme-island .island-note-art i {
        position: absolute;
        font: 150px Georgia;
        right: 25px;
        bottom: -30px;
        transform: rotate(-12deg);
        opacity: 0.45;
      }
      #theme-island .island-note-art strong {
        font: 60px Georgia;
        position: relative;
      }
      #theme-island .island-note-art small {
        display: block;
        font-size: 7px;
        letter-spacing: 0.18em;
        margin-top: 8px;
      }
      #theme-island .island-post-meta {
        margin: 22px 0 15px;
        display: flex;
        justify-content: space-between;
        gap: 12px;
        font-size: 9px;
        color: var(--island-muted);
      }
      #theme-island .island-post-copy h3 {
        font:
          22px/1.65 Georgia,
          'Songti SC',
          SimSun,
          serif;
        font-weight: 400;
        margin-bottom: 13px;
      }
      #theme-island .island-post-copy > p:not(.island-post-meta) {
        font-size: 12px;
        line-height: 1.95;
        color: var(--island-muted);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      #theme-island .island-post-copy .island-text-link {
        font-size: 10px;
        margin-top: 20px;
      }
      #theme-island .island-page-heading {
        padding: 15px 0 55px;
        border-bottom: 1px solid var(--island-border);
        margin-bottom: 45px;
      }
      #theme-island .island-page-heading h1 {
        font-size: clamp(34px, 4vw, 60px);
        line-height: 1.5;
        margin: 18px 0;
      }
      #theme-island .island-page-heading > p:last-child:not(.island-eyebrow) {
        font-size: 14px;
        line-height: 2;
        color: var(--island-muted);
      }
      #theme-island .island-archive-layout {
        display: grid;
        grid-template-columns: 230px 1fr;
        gap: 60px;
      }
      #theme-island .island-archive-layout > aside {
        padding-top: 30px;
      }
      #theme-island .island-archive-layout > aside > span {
        font: 70px Georgia;
        color: #97a184;
      }
      #theme-island .island-archive-layout > aside h2 {
        font-size: 28px;
        margin: 20px 0;
      }
      #theme-island .island-archive-layout > aside p {
        font-size: 13px;
        line-height: 2;
        margin-bottom: 25px;
        color: var(--island-muted);
      }
      #theme-island .island-archive {
        margin-bottom: 45px;
      }
      #theme-island .island-archive h2 {
        font: italic 32px Georgia;
        margin: 0 0 24px;
        color: var(--island-muted);
      }
      #theme-island .island-archive > a {
        display: flex;
        gap: 24px;
        padding: 25px 0;
        border-bottom: 1px solid var(--island-border);
        align-items: center;
        font-size: 16px;
        line-height: 1.8;
      }
      #theme-island .island-archive > a small {
        font: 12px Georgia;
        color: var(--island-muted);
      }
      #theme-island .island-archive > a i {
        margin-left: auto;
        color: #a58a5b;
      }
      #theme-island .island-collection {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
      #theme-island .island-collection a {
        display: flex;
        flex-direction: column;
        gap: 25px;
        background: var(--island-surface);
        border: 1px solid var(--island-border);
        padding: 30px;
        border-radius: 3px 24px 3px 3px;
      }
      #theme-island .island-collection small {
        color: var(--island-muted);
      }
      #theme-island .island-search {
        margin-bottom: 55px;
      }
      #theme-island .island-search label {
        display: block;
        font-size: 12px;
        color: var(--island-muted);
        margin-bottom: 12px;
      }
      #theme-island .island-search > div {
        display: flex;
        gap: 14px;
      }
      #theme-island .island-search input {
        border: 1px solid var(--island-border);
        padding: 16px 20px;
        background: var(--island-surface);
        border-radius: 4px;
        width: min(530px, 100%);
        min-width: 0;
      }
      #theme-island .island-button {
        display: inline-block;
        border: 0;
        border-radius: 4px;
        background: var(--island-ink);
        color: var(--island-bg);
        padding: 16px 24px;
        font-size: 13px;
        white-space: nowrap;
      }
      #theme-island .island-more {
        display: block;
        margin: 45px auto 0;
      }
      #theme-island .island-pagination {
        display: flex;
        justify-content: center;
        gap: 30px;
        align-items: center;
        font-size: 12px;
        padding-top: 50px;
      }
      #theme-island .island-empty {
        padding: 100px 0;
        text-align: center;
      }
      #theme-island .island-about-layout {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 85px;
      }
      #theme-island .island-about-art {
        background: #d4ddc6;
        color: #50664e;
        min-height: 380px;
        border-radius: 50% 50% 4px 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        align-self: start;
      }
      #theme-island .island-about-art > span {
        font: 150px Georgia;
      }
      #theme-island .island-about-art strong {
        font: 16px Georgia;
        letter-spacing: 0.15em;
        margin: 20px 0;
      }
      #theme-island .island-about-art small {
        font-size: 7px;
        letter-spacing: 0.16em;
      }
      #theme-island .island-about-layout p {
        font-size: 15px;
        line-height: 2.2;
        margin: 0 0 26px;
      }
      #theme-island .island-about-layout h2 {
        font-size: 30px;
        margin: 45px 0 25px;
      }
      #theme-island .island-about-links {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        padding-top: 20px;
      }
      #theme-island .island-about-links a {
        border-bottom: 1px solid var(--island-border);
        padding: 10px 0;
        font-size: 12px;
      }
      #theme-island .island-footer {
        padding: 35px 5%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        border-top: 1px solid var(--island-border);
        font-size: 11px;
        gap: 20px;
      }
      #theme-island .island-footer > span {
        text-align: center;
        color: var(--island-muted);
      }
      #theme-island .island-footer > a:last-child {
        text-align: right;
        color: var(--island-muted);
        font-size: 10px;
      }
      #theme-island .island-reading-room {
        width: min(1250px, 90%);
        margin: auto;
        padding: 45px 0 100px;
      }
      #theme-island .island-reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        z-index: 70;
      }
      #theme-island .island-reading-progress span {
        display: block;
        height: 100%;
        background: #a58a5b;
        transition: width 0.2s;
      }
      #theme-island .island-breadcrumb {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 10px;
        color: var(--island-muted);
      }
      #theme-island .island-story-hero {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 70px;
        align-items: center;
        padding: 60px 0 75px;
      }
      #theme-island .island-story-heading h1 {
        font-size: clamp(30px, 3.2vw, 54px);
        line-height: 1.55;
        margin: 20px 0;
        text-wrap: balance;
      }
      #theme-island .island-story-deck {
        color: var(--island-muted);
        font-size: 14px;
        line-height: 2;
      }
      #theme-island .island-story-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        font-size: 10px;
        color: var(--island-muted);
        margin-top: 26px;
      }
      #theme-island .island-story-art {
        height: 290px;
        background: #dbe1ce;
        color: #566e50;
        position: relative;
        border-radius: 50% 50% 3px 3px;
        overflow: hidden;
        display: grid;
        place-items: center;
      }
      #theme-island .island-story-art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      #theme-island .island-paper-book {
        background: #7c8d6a;
        color: #f2ead2;
        padding: 28px;
        width: 135px;
        height: 185px;
        border-left: 7px solid #57694b;
        transform: rotate(-12deg);
        box-shadow: 12px 12px 0 #b8c2a7;
        font: 21px/1.3 Georgia;
      }
      #theme-island .island-paper-book i {
        display: block;
        margin-top: 15px;
        font: 40px Georgia;
      }
      #theme-island .island-art-sun {
        position: absolute;
        right: 30px;
        top: 25px;
        color: #ac9b65;
        font: 50px Georgia;
      }
      #theme-island .island-art-caption {
        position: absolute;
        bottom: 20px;
        font-size: 7px;
        letter-spacing: 0.19em;
      }
      #theme-island .island-reading-layout {
        display: grid;
        grid-template-columns: 200px minmax(0, 1fr);
        gap: 65px;
        align-items: start;
      }
      #theme-island .island-reading-aside {
        position: sticky;
        top: 30px;
        padding: 25px 0;
      }
      #theme-island .island-reading-compass > span {
        font-size: 8px;
        letter-spacing: 0.15em;
        color: var(--island-muted);
      }
      #theme-island .island-reading-compass p {
        font:
          24px/1.8 Georgia,
          SimSun,
          serif;
        margin: 18px 0;
      }
      #theme-island .island-reading-compass a {
        font-size: 10px;
        border-bottom: 1px solid var(--island-border);
        padding-bottom: 8px;
      }
      #theme-island .island-toc {
        margin-top: 45px;
        border-top: 1px solid var(--island-border);
        padding-top: 20px;
      }
      #theme-island .island-toc summary {
        font-size: 11px;
        cursor: pointer;
      }
      #theme-island .island-toc summary > span {
        color: var(--island-muted);
        margin-left: 14px;
      }
      #theme-island .island-toc nav {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 20px;
        max-height: 40vh;
        overflow: auto;
        font-size: 11px;
        color: var(--island-muted);
        line-height: 1.7;
      }
      #theme-island .island-toc a[aria-current] {
        color: var(--island-ink);
        border-left: 2px solid #a58a5b;
        padding-left: 8px;
      }
      #theme-island .island-toc .island-toc-sub {
        padding-left: 12px;
      }
      #theme-island .island-toc nav a {
        min-width: 0;
        overflow-wrap: anywhere;
      }
      #theme-island .island-reading-settings {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 30px;
        align-items: start;
      }
      #theme-island .island-reading-settings button {
        border: 0;
        border-bottom: 1px solid var(--island-border);
        background: transparent;
        padding: 8px 0;
        font-size: 10px;
        color: var(--island-muted);
      }
      #theme-island .island-reading-paper {
        min-width: 0;
        background: var(--island-surface);
        padding: 50px clamp(25px, 5vw, 75px);
        border: 1px solid var(--island-border);
        border-radius: 3px 25px 3px 3px;
      }
      #theme-island .island-reading-wide .island-reading-layout {
        grid-template-columns: 160px minmax(0, 1fr);
        gap: 35px;
      }
      #theme-island .island-reading-wide .island-reading-paper {
        padding-left: 30px;
        padding-right: 30px;
      }
      #theme-island .notion {
        background: transparent;
        color: var(--island-ink);
        font-size: 16px;
        line-height: 1.95;
      }
      #theme-island .notion-page {
        width: 100%;
        padding: 0;
      }
      #theme-island .notion-h {
        scroll-margin-top: 35px;
      }
      #theme-island .notion h2,
      #theme-island .notion h3 {
        font-family: inherit;
        font-weight: 600;
      }
      #theme-island .notion-link {
        border-bottom: 1px solid #a58a5b;
        opacity: 1;
      }
      #theme-island .notion-callout {
        border: 1px solid var(--island-border);
        border-radius: 10px;
        background: #a4b18a0d;
        padding: 20px;
      }
      #theme-island .notion pre {
        border-radius: 10px;
      }
      #theme-island .island-story-end {
        text-align: center;
        border-top: 1px solid var(--island-border);
        padding: 55px 0 35px;
        margin-top: 45px;
      }
      #theme-island .island-story-end > span {
        font: 35px Georgia;
        color: #a58a5b;
      }
      #theme-island .island-story-end p {
        font:
          22px Georgia,
          SimSun,
          serif;
        margin: 15px 0;
      }
      #theme-island .island-story-end small {
        font-size: 11px;
        color: var(--island-muted);
      }
      #theme-island .island-story-tags {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 25px;
        font-size: 11px;
      }
      #theme-island .island-adjacent {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 25px;
        border-top: 1px solid var(--island-border);
        padding: 30px 0;
      }
      #theme-island .island-adjacent a {
        display: flex;
        flex-direction: column;
        gap: 14px;
        font-size: 13px;
        line-height: 1.9;
      }
      #theme-island .island-adjacent small {
        font-size: 10px;
        color: var(--island-muted);
      }
      #theme-island .island-adjacent strong {
        font-weight: 400;
      }
      #theme-island .island-lock-room {
        width: min(600px, 90%);
        margin: auto;
        padding: 110px 0;
        text-align: center;
      }
      #theme-island .island-lock-symbol {
        font: 70px Georgia;
        color: #a58a5b;
      }
      #theme-island .island-lock-room h1 {
        font-size: 35px;
        margin: 20px 0;
      }
      #theme-island .island-lock-room > p {
        margin: 20px 0;
      }
      #theme-island .island-lock-room form {
        margin-top: 40px;
        text-align: left;
      }
      #theme-island .qcode-toolbox-page,
      #theme-island .qcode-profile-page {
        --heo-color-primary: var(--island-accent);
        --heo-color-card-dark: var(--island-surface);
        width: min(1180px, 90%);
        margin: auto;
        --qcode-bg: var(--island-bg);
        --qcode-text: var(--island-ink);
        --qcode-card: var(--island-surface);
        background: var(--island-bg);
        color: var(--island-ink);
        padding-top: 60px;
      }
      #theme-island .qcode-toolbox-page > header,
      #theme-island .qcode-profile-page > section:first-child {
        background: var(--island-surface);
        color: var(--island-ink);
        box-shadow: none;
        border: 1px solid var(--island-border);
        border-radius: 3px 30px 3px 3px;
      }
      #theme-island .qcode-toolbox-page > header [class*='text-white'],
      #theme-island .qcode-profile-page [class*='text-gray-9'],
      #theme-island .qcode-toolbox-page [class*='text-gray-9'] {
        color: var(--island-ink);
      }
      #theme-island .qcode-toolbox-page h1,
      #theme-island .qcode-profile-page h1 {
        font-weight: 400;
        font-family: Georgia, 'Songti SC', SimSun, serif;
      }
      #theme-island .qcode-profile-page h1 [class*='bg-clip-text'] {
        background: none;
        color: var(--island-accent);
      }
      #theme-island .qcode-toolbox-page [class*='text-indigo-'],
      #theme-island .qcode-profile-page [class*='text-indigo-'],
      #theme-island .qcode-toolbox-page [class*='text-sky-'] {
        color: var(--island-accent);
      }
      #theme-island .qcode-toolbox-page [class*='bg-white'],
      #theme-island .qcode-toolbox-page button[aria-pressed='false'],
      #theme-island .qcode-profile-page [class*='bg-white'] {
        background-color: var(--island-surface);
      }
      #theme-island .qcode-toolbox-page [class*='bg-indigo-'],
      #theme-island .qcode-toolbox-page [class*='bg-sky-'] {
        background-color: #a5b58e24;
      }
      #theme-island .qcode-toolbox-page button[aria-pressed='true'] {
        border-color: var(--island-accent);
      }
      #theme-island .qcode-toolbox-page > header .absolute {
        display: none;
      }
      #theme-island .qcode-profile-page [class*='bg-gradient-'] {
        background-image: linear-gradient(125deg, #c4d2b6, #e5dfc8);
      }
      #theme-island .qcode-toolbox-page [class*='rounded'],
      #theme-island .qcode-profile-page [class*='rounded'] {
        border-color: var(--island-border);
      }
      @keyframes island-arrival {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(350%);
        }
      }
      @keyframes island-note-in {
        from {
          opacity: 0;
          transform: translateY(12px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      @media (min-width: 1800px) {
        #theme-island .island-intro {
          left: 6%;
          top: 27%;
          width: 340px;
        }
        #theme-island .island-intro h1 {
          font-size: 64px;
        }
        #theme-island .island-intro-deck {
          font-size: 15px;
        }
        #theme-island .island-place-card {
          left: 7%;
          width: 330px;
        }
      }
      @media (max-width: 1000px) {
        #theme-island .island-header {
          gap: 18px;
        }
        #theme-island .island-header nav {
          gap: 16px;
          font-size: 11px;
        }
        #theme-island .island-header-actions {
          gap: 7px;
        }
        #theme-island .island-intro {
          width: 195px;
          left: 4%;
          top: 21%;
        }
        #theme-island .island-intro h1 {
          font-size: 36px;
        }
        #theme-island .island-world-label {
          display: none;
        }
        #theme-island .island-passport {
          margin-top: 40px;
        }
        #theme-island .island-place-card {
          left: 4%;
          width: 250px;
          padding: 25px;
        }
        #theme-island .island-post-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        #theme-island .island-reading-layout {
          grid-template-columns: 160px minmax(0, 1fr);
          gap: 30px;
        }
        #theme-island .island-story-hero {
          gap: 35px;
        }
      }
      @media (max-width: 700px) {
        #theme-island .island-header {
          height: 86px;
          padding: 0 6%;
          gap: 12px;
          flex-wrap: wrap;
          align-content: center;
        }
        #theme-island .island-brand {
          font-size: 15px;
          gap: 10px;
        }
        #theme-island .island-brand small {
          font-size: 6px;
          letter-spacing: 0.12em;
          margin-top: 4px;
        }
        #theme-island .island-brand-symbol {
          font-size: 33px;
        }
        #theme-island .island-header nav {
          display: none;
        }
        #theme-island .island-header-actions > .island-menu-toggle {
          display: grid;
        }
        #theme-island .island-header nav[data-open='true'] {
          display: flex;
          position: absolute;
          top: 75px;
          left: 5%;
          right: 5%;
          padding: 20px 25px;
          flex-direction: column;
          gap: 8px;
          border: 1px solid var(--island-border);
          border-radius: 5px 20px 5px 5px;
          background: var(--island-surface);
          box-shadow: 0 15px 45px #243d2917;
          font-size: 13px;
        }
        #theme-island .island-header-actions > button,
        #theme-island .island-header-actions > a {
          width: 32px;
          height: 32px;
          font-size: 18px;
        }
        #theme-island .island-explore {
          height: max(800px, 100svh);
        }
        #theme-island .island-intro {
          top: 125px;
          left: 7%;
          width: 85%;
        }
        #theme-island .island-intro h1 {
          font-size: 34px;
          line-height: 1.5;
          max-width: none;
          margin: 15px 0 10px;
        }
        #theme-island .island-intro .island-eyebrow {
          font-size: 7px;
        }
        #theme-island .island-intro-deck {
          font-size: 11px;
          line-height: 1.9;
        }
        #theme-island .island-intro-deck br {
          display: none;
        }
        #theme-island .island-explore-cta {
          margin-top: 16px;
          padding: 10px 15px;
          font-size: 10px;
          gap: 20px;
        }
        #theme-island .island-passport {
          display: none;
        }
        #theme-island .island-markers {
          display: none;
        }
        #theme-island .island-controls {
          top: auto;
          bottom: 152px;
          right: auto;
          left: 50%;
          transform: translateX(-50%);
          flex-direction: row;
          padding: 5px;
          gap: 3px;
        }
        #theme-island .island-controls button {
          width: 44px;
          height: 44px;
          font-size: 17px;
        }
        #theme-island .island-dock-wrap {
          bottom: 24px;
          width: 92%;
        }
        #theme-island .island-dock-wrap > p {
          display: none;
        }
        #theme-island .island-controls > span {
          display: none;
        }
        #theme-island .island-dock {
          padding: 5px;
          border-radius: 22px;
        }
        #theme-island .island-dock button {
          flex-direction: column;
          gap: 4px;
          min-height: 66px;
          border-radius: 16px;
        }
        #theme-island .island-dock button > span {
          font-size: 21px;
        }
        #theme-island .island-dock strong {
          font-size: 9px;
        }
        #theme-island .island-dock small {
          display: none;
        }
        #theme-island .island-dock-wrap > a {
          font-size: 8px;
          margin-top: 17px;
        }
        #theme-island .island-place-card {
          left: 6%;
          right: 6%;
          top: 105px;
          width: auto;
          padding: 22px 25px;
          max-height: 245px;
          overflow: auto;
          border-radius: 4px 22px 4px 22px;
        }
        #theme-island .island-place-card .island-eyebrow {
          font-size: 7px;
          margin: 0 0 10px;
        }
        #theme-island .island-place-card h2 {
          font-size: 24px;
        }
        #theme-island .island-place-card > p:not(.island-eyebrow) {
          font-size: 11px;
          margin: 10px 0;
          line-height: 1.9;
        }
        #theme-island .island-card-notes {
          display: none;
        }
        #theme-island .island-map {
          inset: 32% 2% 19%;
        }
        #theme-island .island-map-links {
          gap: 5px;
        }
        #theme-island .island-map-links button {
          padding: 8px;
          font-size: 9px;
        }
        #theme-island .island-map > p {
          font-size: 8px;
        }
        #theme-island .island-arrival h2 {
          font-size: 25px;
        }
        #theme-island .island-arrival .island-eyebrow {
          font-size: 8px;
        }
        #theme-island .island-journal,
        #theme-island .island-content {
          width: 86%;
          padding: 65px 0 75px;
        }
        #theme-island .island-section-heading {
          display: block;
          margin-bottom: 28px;
        }
        #theme-island .island-section-heading h2 {
          font-size: 30px;
          margin-bottom: 18px;
        }
        #theme-island .island-eyebrow {
          font-size: 8px;
        }
        #theme-island .island-post-grid {
          grid-template-columns: 1fr;
          gap: 35px;
        }
        #theme-island .island-post-copy h3 {
          font-size: 22px;
        }
        #theme-island .island-page-heading {
          padding-bottom: 35px;
          margin-bottom: 30px;
        }
        #theme-island .island-page-heading h1 {
          font-size: 35px;
        }
        #theme-island .island-page-heading > p:last-child:not(.island-eyebrow) {
          font-size: 12px;
        }
        #theme-island .island-archive-layout {
          display: block;
        }
        #theme-island .island-archive-layout > aside {
          display: none;
        }
        #theme-island .island-archive > a {
          font-size: 14px;
          gap: 16px;
          padding: 22px 0;
        }
        #theme-island .island-archive h2 {
          font-size: 29px;
        }
        #theme-island .island-collection {
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        #theme-island .island-collection a {
          padding: 22px 18px;
          font-size: 13px;
        }
        #theme-island .island-search > div {
          gap: 8px;
        }
        #theme-island .island-button {
          padding: 15px;
          font-size: 12px;
        }
        #theme-island .island-about-layout {
          display: flex;
          flex-direction: column;
          gap: 35px;
        }
        #theme-island .island-about-art {
          width: 100%;
          min-height: 280px;
        }
        #theme-island .island-about-art > span {
          font-size: 110px;
        }
        #theme-island .island-about-layout p {
          font-size: 14px;
          line-height: 2.1;
        }
        #theme-island .island-footer {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 18px;
          padding: 30px 5%;
          font-size: 10px;
        }
        #theme-island .island-footer > span {
          width: 100%;
          order: 1;
        }
        #theme-island .island-footer > a:last-child {
          font-size: 9px;
        }
        #theme-island .island-reading-room {
          width: 88%;
          padding-top: 28px;
        }
        #theme-island .island-story-hero {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 30px;
          padding: 35px 0 30px;
        }
        #theme-island .island-story-heading h1 {
          font-size: 30px;
        }
        #theme-island .island-story-deck {
          font-size: 12px;
        }
        #theme-island .island-story-art {
          height: 180px;
          border-radius: 3px 22px 3px 3px;
        }
        #theme-island .island-paper-book {
          transform: rotate(-12deg) scale(0.7);
        }
        #theme-island .island-reading-layout,
        #theme-island .island-reading-wide .island-reading-layout {
          display: block;
        }
        #theme-island .island-reading-aside {
          position: static;
          padding: 0 0 25px;
        }
        #theme-island .island-reading-compass,
        #theme-island .island-reading-settings {
          display: none;
        }
        #theme-island .island-toc {
          margin-top: 0;
          padding: 15px;
          border: 1px solid var(--island-border);
          border-radius: 8px;
        }
        #theme-island .island-toc nav {
          max-height: 150px;
        }
        #theme-island .island-reading-paper {
          padding: 30px 20px;
          border-radius: 3px 20px 3px 3px;
          margin: 0 -3%;
        }
        #theme-island .notion {
          font-size: 15px;
          line-height: 1.9;
        }
        #theme-island .island-adjacent {
          gap: 18px;
          font-size: 12px;
        }
        #theme-island .island-story-end p {
          font-size: 20px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        #theme-island *,
        #theme-island *:before,
        #theme-island *:after {
          animation: none !important;
          transition: none !important;
          scroll-behavior: auto !important;
        }
      }
    `}</style>
  )
}

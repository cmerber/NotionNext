export function ArrivalStyle() {
  return (
    <style jsx global>{`
      /* Lift the loading stage above the sibling header; remove the stacking
       level as soon as the cover exits, leaving the WebGL parent untouched. */
      #theme-orange .orange-immersive:has(.orange-scene-arrival) {
        z-index: 20;
      }
      #theme-orange .orange-scene-arrival {
        --arrival-sun: #edc38d;
        --arrival-leaf: #becab0;
        --arrival-ground: #e7e7d5;
        --arrival-stone: #d5d8bd;
        --arrival-house: #fffaf0;
        --arrival-roof: #c5ceb9;
        --arrival-window: #efcf97;
        --arrival-accent: #ba8450;
        position: fixed;
        inset: 0;
        z-index: 30;
        display: grid;
        place-items: center;
        background: #f5f2e9;
        background-image: radial-gradient(
          ellipse at 50% 42%,
          #fffdf5 0,
          #f5f2e9 65%
        );
        color: #3d5145;
        padding: 76px 24px;
        overflow: auto;
        overscroll-behavior: contain;
        transition: opacity 0.45s ease;
      }
      .dark #theme-orange .orange-scene-arrival {
        --arrival-sun: #bd9365;
        --arrival-leaf: #637d69;
        --arrival-ground: #5a6e5d;
        --arrival-stone: #3c5144;
        --arrival-house: #718477;
        --arrival-roof: #485f51;
        --arrival-window: #edc68f;
        --arrival-accent: #c8a177;
        background: #202e29;
        background-image: radial-gradient(
          ellipse at 50% 42%,
          #31433a,
          #202e29 70%
        );
        color: #e8ebdf;
      }
      #theme-orange .orange-scene-arrival[data-ready='true'] {
        opacity: 0;
        pointer-events: none;
      }
      #theme-orange .orange-arrival-brand {
        position: absolute;
        left: 5%;
        top: 30px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 11px;
        letter-spacing: 0.15em;
      }
      #theme-orange .orange-arrival-brand > span:first-child {
        font-size: 25px;
      }
      #theme-orange .orange-arrival-brand i {
        font-style: normal;
        opacity: 0.35;
        margin: 0 8px;
      }
      #theme-orange .orange-arrival-center {
        width: min(100%, 440px);
        text-align: center;
      }
      #theme-orange .orange-arrival-kicker {
        font-size: 8px;
        letter-spacing: 0.26em;
        opacity: 0.5;
      }
      #theme-orange .orange-arrival-drawing {
        width: min(100%, 360px);
        margin: 0 auto 12px;
      }
      #theme-orange .orange-arrival-drawing svg {
        width: 100%;
        overflow: visible;
        stroke: #7f9076;
        stroke-width: 1.3;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .dark #theme-orange .orange-arrival-drawing svg {
        stroke: #a4b49b;
      }
      #theme-orange .orange-arrival-islet {
        animation: orange-arrival-float 4s ease-in-out infinite;
      }
      #theme-orange .orange-arrival-orbit {
        stroke-dasharray: 3 6;
        opacity: 0.4;
      }
      #theme-orange .orange-arrival-cloud {
        opacity: 0.55;
      }
      #theme-orange .orange-arrival-center h2 {
        font:
          28px/1.6 'Songti SC',
          'SimSun',
          Georgia,
          serif;
        margin: 0 0 10px;
        letter-spacing: 0.07em;
        font-weight: 400;
      }
      #theme-orange .orange-arrival-center p {
        font-size: 11px;
        opacity: 0.6;
        letter-spacing: 0.1em;
        margin: 0;
      }
      #theme-orange .orange-arrival-progress {
        width: min(100%, 285px);
        margin: 30px auto 0;
      }
      #theme-orange .orange-arrival-step-label {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        letter-spacing: 0.1em;
      }
      #theme-orange .orange-arrival-step-label i {
        font-style: normal;
        opacity: 0.4;
      }
      #theme-orange .orange-arrival-progress progress {
        appearance: none;
        display: block;
        width: 100%;
        height: 3px;
        margin: 12px 0 13px;
        border: 0;
        border-radius: 3px;
        color: #78916d;
        background: #9baf8b33;
        overflow: hidden;
      }
      #theme-orange .orange-arrival-progress progress::-webkit-progress-bar {
        background: #9baf8b33;
      }
      #theme-orange .orange-arrival-progress progress::-webkit-progress-value {
        background: #78916d;
        transition: width 0.25s ease;
      }
      #theme-orange .orange-arrival-progress progress::-moz-progress-bar {
        background: #78916d;
      }
      #theme-orange .orange-arrival-progress ol {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0;
        justify-content: space-between;
        gap: 10px;
      }
      #theme-orange .orange-arrival-progress li {
        font-size: 9px;
        opacity: 0.35;
      }
      #theme-orange .orange-arrival-progress li[data-active='true'] {
        opacity: 0.85;
      }
      #theme-orange .orange-arrival-progress b {
        font-weight: 400;
        margin-right: 5px;
      }
      #theme-orange .orange-arrival-skip {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        min-height: 44px;
        padding: 0 10px;
        margin-top: 21px;
        font-size: 10px;
        color: inherit;
        opacity: 0.65;
        text-decoration: none;
      }
      #theme-orange .orange-arrival-skip:hover {
        opacity: 1;
      }
      #theme-orange .orange-arrival-skip:focus-visible {
        outline: 2px solid var(--arrival-accent);
        outline-offset: 3px;
        border-radius: 6px;
      }
      #theme-orange .orange-arrival-foot {
        position: absolute;
        bottom: 25px;
        left: 20px;
        right: 20px;
        text-align: center;
        font-size: 9px;
        letter-spacing: 0.16em;
        opacity: 0.35;
      }
      #theme-orange .orange-scene-arrival[data-ready='true'] * {
        animation-play-state: paused;
      }
      @keyframes orange-arrival-float {
        50% {
          transform: translateY(-6px);
        }
      }
      @media (max-width: 760px) {
        #theme-orange .orange-arrival-center h2 {
          font-size: 24px;
        }
        #theme-orange .orange-arrival-brand {
          left: 7%;
          top: 24px;
        }
        #theme-orange .orange-arrival-drawing {
          width: min(100%, 300px);
        }
      }
      @media (max-height: 650px) {
        #theme-orange .orange-scene-arrival {
          padding: 60px 20px 35px;
        }
        #theme-orange .orange-arrival-drawing {
          width: 220px;
          margin-bottom: 0;
        }
        #theme-orange .orange-arrival-progress {
          margin-top: 15px;
        }
        #theme-orange .orange-arrival-skip {
          margin-top: 8px;
        }
        #theme-orange .orange-arrival-foot {
          display: none;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        #theme-orange .orange-arrival-islet {
          animation: none;
        }
        #theme-orange .orange-scene-arrival,
        #theme-orange
          .orange-arrival-progress
          progress::-webkit-progress-value {
          transition: none;
        }
      }
    `}</style>
  )
}

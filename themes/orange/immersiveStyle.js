export function ImmersiveStyle() {
  return (
    <style jsx global>{`
      #theme-orange:has(.orange-immersive) {
        position: relative;
      }
      #theme-orange:has(.orange-immersive) .orange-header {
        position: absolute;
        top: 0;
        left: 5%;
        right: 5%;
        z-index: 10;
        max-width: none;
        min-height: 100px;
        border: 0;
        padding: 0;
      }
      #theme-orange:has(.orange-immersive) .orange-brand {
        font-size: 20px;
        gap: 10px;
      }
      #theme-orange:has(.orange-immersive) .orange-brand > span:first-child {
        font-size: 32px;
      }
      #theme-orange:has(.orange-immersive) .orange-brand small {
        font-size: 8px;
        letter-spacing: 0.25em;
      }
      #theme-orange:has(.orange-immersive) .orange-header nav {
        font-size: 13px;
        gap: 26px;
      }
      #theme-orange:has(.orange-immersive) .orange-header .orange-round-button {
        width: 40px;
        height: 40px;
      }
      #theme-orange .orange-immersive {
        position: relative;
        isolation: isolate;
        display: block;
        max-width: none;
        height: max(780px, 100svh);
        margin: 0 -5.556%;
        padding: 0;
        background: #e9e8de;
        overflow: hidden;
      }
      .dark #theme-orange .orange-immersive {
        background: #202d38;
        color: #f5eddf;
      }
      #theme-orange .orange-world-sky {
        position: absolute;
        inset: 0;
        z-index: -1;
        background:
          radial-gradient(ellipse at 73% 26%, #ffedca 0, transparent 43%),
          radial-gradient(ellipse at 18% 65%, #d7e3da 0, transparent 50%),
          linear-gradient(165deg, #f4f0e6 5%, #d9e3de 48%, #f2dfcf 100%);
        transition: background 1.5s;
      }
      .dark #theme-orange .orange-world-sky {
        background:
          radial-gradient(ellipse at 75% 25%, #62607566, transparent 40%),
          radial-gradient(ellipse at 25% 70%, #486e6c55, transparent 55%),
          linear-gradient(160deg, #172836, #344652 65%, #6c6265);
      }
      #theme-orange .orange-immersive .orange-stage {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        min-height: 0;
        border: 0;
        border-radius: 0;
        background: none;
        box-shadow: none;
      }
      #theme-orange .orange-immersive .orange-canvas {
        position: absolute;
        inset: 0;
      }
      #theme-orange .orange-immersive .orange-canvas canvas {
        display: block;
        width: 100%;
        height: 100%;
      }
      #theme-orange .orange-world-title {
        position: absolute;
        top: 17%;
        left: 6%;
        pointer-events: none;
      }
      #theme-orange .orange-world-title p {
        font-size: 9px;
        letter-spacing: 0.22em;
        margin: 0 0 20px;
        display: flex;
        gap: 10px;
        align-items: center;
      }
      #theme-orange .orange-world-title h1 {
        font-family: 'Songti SC', 'Noto Serif SC', 'SimSun', serif;
        font-size: clamp(36px, 3.7vw, 66px);
        line-height: 1.45;
        font-weight: 400;
        letter-spacing: -0.055em;
        margin: 0;
      }
      #theme-orange .orange-world-title h1 em {
        font-weight: 400;
        font-style: normal;
      }
      #theme-orange .orange-world-coordinate {
        display: block;
        margin-top: 25px;
        font-size: 10px;
        letter-spacing: 0.2em;
        opacity: 0.55;
      }
      #theme-orange .orange-world-index {
        position: absolute;
        right: 6%;
        top: 18%;
        text-align: right;
        font-size: 12px;
        letter-spacing: 0.15em;
        line-height: 1.8;
        pointer-events: none;
      }
      #theme-orange .orange-world-index span {
        font-size: 8px;
        letter-spacing: 0.22em;
        opacity: 0.6;
      }
      #theme-orange .orange-world-index i {
        display: block;
        font-family: Georgia, serif;
        font-size: 26px;
        font-style: normal;
        margin-top: 20px;
        opacity: 0.4;
      }
      #theme-orange .orange-world-tools {
        position: absolute;
        z-index: 3;
        right: 4%;
        top: 40%;
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      #theme-orange .orange-world-tools button {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1px solid #fff7;
        background: #fff3;
        backdrop-filter: blur(14px);
        font-size: 20px;
        display: grid;
        place-items: center;
        transition:
          background 0.3s,
          transform 0.3s;
      }
      #theme-orange .orange-world-tools button:hover,
      #theme-orange .orange-world-tools button[aria-pressed='true'] {
        background: #fff9;
        color: #77563f;
        transform: translateY(-2px);
      }
      .dark #theme-orange .orange-world-tools button {
        background: #1b2b3244;
      }
      #theme-orange .orange-world-bottom {
        position: absolute;
        bottom: 28px;
        left: 6%;
        right: 6%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
        pointer-events: none;
      }
      #theme-orange .orange-world-bottom > * {
        order: 0;
      }
      @media (min-width: 761px) {
        body:has(.orange-immersive) #draggableBox {
          top: auto !important;
          bottom: 24px !important;
          left: 24px !important;
          right: auto !important;
        }
      }
      #theme-orange .orange-immersive .orange-scene-caption {
        position: static;
        width: auto;
        transform: none;
        font-size: 10px;
        letter-spacing: 0.13em;
        color: inherit;
        opacity: 0.65;
        padding: 0;
        background: none;
      }
      #theme-orange .orange-immersive .orange-place-nav {
        display: flex;
        gap: 4px;
        width: auto;
        padding: 6px;
        margin: 0;
        border: 1px solid #fff9;
        border-radius: 24px;
        background: #fff5;
        backdrop-filter: blur(20px);
        box-shadow: 0 12px 40px #445c4910;
        pointer-events: auto;
      }
      #theme-orange .orange-immersive .orange-place-nav button {
        display: flex;
        align-items: center;
        gap: 12px;
        border: 0;
        border-radius: 19px;
        padding: 14px 20px;
        background: none;
        min-height: 60px;
        width: auto;
        font-size: 12px;
        transition:
          background 0.3s,
          transform 0.3s;
      }
      #theme-orange .orange-immersive .orange-place-nav button:hover,
      #theme-orange
        .orange-immersive
        .orange-place-nav
        button[aria-pressed='true'] {
        background: #fff9;
        transform: translateY(-3px);
      }
      #theme-orange .orange-immersive .orange-nav-icon {
        font-size: 24px;
        color: #9d7551;
        width: auto;
        height: auto;
        background: none;
        border: 0;
      }
      #theme-orange .orange-immersive .orange-place-nav small {
        display: block;
        font-size: 8px;
        opacity: 0.4;
        margin-left: 8px;
      }
      .dark #theme-orange .orange-immersive .orange-place-nav {
        background: #24363c88;
        border-color: #ffffff22;
      }
      .dark
        #theme-orange
        .orange-immersive
        .orange-place-nav
        button[aria-pressed='true'],
      .dark #theme-orange .orange-immersive .orange-place-nav button:hover {
        background: #ffffff22;
      }
      #theme-orange .orange-scroll-note {
        pointer-events: auto;
        font-size: 15px;
        display: flex;
        align-items: center;
        gap: 12px;
        opacity: 0.65;
      }
      #theme-orange .orange-scroll-note span {
        font-size: 9px;
        letter-spacing: 0.14em;
      }
      #theme-orange .orange-focus-card {
        position: absolute;
        left: 6%;
        bottom: 185px;
        z-index: 3;
        width: 260px;
        border: 1px solid #fff9;
        border-radius: 22px;
        background: #fbf7eeaa;
        backdrop-filter: blur(20px);
        padding: 24px;
        box-shadow: 0 12px 40px #3446350a;
        animation: orange-card-in 0.5s both;
      }
      #theme-orange .orange-focus-card h2 {
        font-size: 23px;
        font-weight: 400;
        margin: 8px 0 15px;
        display: flex;
        justify-content: space-between;
      }
      #theme-orange .orange-focus-card .orange-eyebrow {
        font-size: 8px;
      }
      #theme-orange .orange-focus-card .orange-text-link {
        font-size: 12px;
      }
      #theme-orange .orange-focus-latest {
        display: block;
        font-size: 10px;
        line-height: 1.7;
        opacity: 0.55;
        margin-top: 16px;
      }
      #theme-orange .orange-focus-close {
        position: absolute;
        right: 8px;
        top: 4px;
        width: 44px;
        height: 44px;
        border: 0;
        background: none;
        font-size: 20px;
        opacity: 0.5;
      }
      .dark #theme-orange .orange-focus-card {
        background: #24363caa;
        border-color: #ffffff22;
      }
      #theme-orange .orange-immersive .orange-welcome-bubble {
        position: absolute;
        top: 38%;
        left: 50%;
        bottom: auto;
        max-width: 290px;
        width: max-content;
        transform: translateX(-50%);
        z-index: 3;
        border-radius: 20px 20px 20px 2px;
        background: #fff9;
        backdrop-filter: blur(20px);
        padding: 18px 22px;
        font-size: 13px;
      }
      .dark #theme-orange .orange-immersive .orange-welcome-bubble {
        background: #24363cdd;
      }
      #theme-orange .orange-immersive .orange-flat-scene {
        height: 100%;
        padding-top: 60px;
        background: none;
      }
      #theme-orange .orange-immersive .orange-flat-scene h2 {
        font-size: 20px;
      }
      #theme-orange .orange-immersive .orange-flat-scene p {
        font-size: 12px;
      }
      #theme-orange .orange-fallback-planet {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 25%, #f9eab6, #9ba98a 80%);
        box-shadow:
          0 30px 80px #4d624433,
          inset -15px -15px 30px #5a715244;
        display: grid;
        place-items: center;
        transform: rotate(-15deg);
      }
      #theme-orange .orange-fallback-planet span {
        font-size: 65px;
      }
      #theme-orange .orange-immersive .orange-scene-message {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        letter-spacing: 0.15em;
      }
      #theme-orange #orange-notes {
        padding-top: 70px;
      }
      @keyframes orange-card-in {
        from {
          opacity: 0;
          translate: 0 15px;
        }
        to {
          opacity: 1;
          translate: 0 0;
        }
      }
      @media (max-width: 760px) {
        #theme-orange:has(.orange-immersive) .orange-header {
          min-height: 82px;
          gap: 10px;
          flex-wrap: nowrap;
          align-items: center;
        }
        #theme-orange:has(.orange-immersive) .orange-brand {
          font-size: 16px;
        }
        #theme-orange:has(.orange-immersive) .orange-brand small {
          font-size: 6px;
          letter-spacing: 0.12em;
        }
        #theme-orange:has(.orange-immersive) .orange-header nav {
          width: auto;
          gap: 8px;
          padding-right: 44px;
        }
        #theme-orange:has(.orange-immersive)
          .orange-header
          nav
          > a:not(.orange-round-button),
        #theme-orange:has(.orange-immersive) .orange-header nav > .orange-menu,
        #theme-orange:has(.orange-immersive) .orange-header nav > button {
          display: none;
        }
        #theme-orange .orange-immersive {
          height: max(740px, 100svh);
        }
        #theme-orange .orange-world-title {
          left: 7%;
          top: 115px;
        }
        #theme-orange .orange-world-title h1 {
          font-size: 34px;
          line-height: 1.4;
        }
        #theme-orange .orange-world-title p {
          font-size: 7px;
          margin-bottom: 14px;
        }
        #theme-orange .orange-world-coordinate {
          font-size: 8px;
          margin-top: 12px;
        }
        #theme-orange .orange-world-index {
          display: none;
        }
        #theme-orange .orange-world-tools {
          right: 12px;
          top: 32%;
          gap: 3px;
        }
        #theme-orange .orange-world-tools button {
          width: 44px;
          height: 44px;
          font-size: 18px;
        }
        #theme-orange .orange-world-bottom {
          bottom: 20px;
          left: 12px;
          right: 12px;
          gap: 12px;
        }
        #theme-orange .orange-immersive .orange-place-nav {
          width: 100%;
          padding: 5px;
          gap: 2px;
          border-radius: 22px;
          justify-content: space-between;
        }
        #theme-orange .orange-immersive .orange-place-nav button {
          flex: 1;
          flex-direction: column;
          gap: 4px;
          font-size: 10px;
          padding: 10px 2px;
          min-width: 0;
          min-height: 65px;
          border-radius: 17px;
        }
        #theme-orange .orange-immersive .orange-place-nav small {
          display: none;
        }
        #theme-orange .orange-immersive .orange-nav-icon {
          font-size: 22px;
        }
        #theme-orange .orange-focus-card {
          left: 20px;
          bottom: 165px;
          width: 210px;
          padding: 16px 18px;
        }
        #theme-orange .orange-focus-card h2 {
          font-size: 20px;
          margin: 4px 0 8px;
        }
        #theme-orange .orange-focus-latest {
          display: none;
        }
        #theme-orange .orange-immersive .orange-welcome-bubble {
          top: 36%;
          font-size: 12px;
        }
        body:has(.orange-immersive) #draggableBox {
          top: 23px !important;
          right: 5% !important;
        }
        #theme-orange .orange-immersive .orange-flat-scene {
          padding: 90px 20px 0;
        }
        #theme-orange .orange-immersive .orange-flat-scene h2 {
          font-size: 16px;
        }
      }
    `}</style>
  )
}

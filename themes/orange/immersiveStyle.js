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
      #theme-orange .orange-reconnecting {
        position: absolute;
        z-index: 4;
        left: 50%;
        top: 52%;
        transform: translateX(-50%);
        padding: 12px 20px;
        border-radius: 24px;
        background: #f9f6eccc;
        backdrop-filter: blur(15px);
        font-size: 12px;
        color: #53654f;
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
        transition:
          opacity 0.8s,
          transform 0.8s;
      }
      #theme-orange .orange-immersive[data-focused='true'] .orange-world-title {
        opacity: 0.15;
        transform: translateY(-12px);
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
      .dark #theme-orange .orange-world-tools button:hover,
      .dark #theme-orange .orange-world-tools button[aria-pressed='true'] {
        color: #ffe5b0;
        background: #ffffff26;
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
        box-shadow:
          0 16px 50px #34463515,
          inset 0 1px 0 #fffc;
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
      @media (prefers-reduced-motion: reduce) {
        #theme-orange .orange-world-title,
        #theme-orange .orange-world-tools button,
        #theme-orange .orange-immersive .orange-place-nav button {
          transition: none;
        }
        #theme-orange .orange-focus-card {
          animation: none;
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
          top: 27%;
          font-size: 12px;
          max-width: calc(100% - 100px);
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

      #theme-orange .orange-compat {
        position: absolute;
        inset: 0;
        overflow: hidden;
        perspective: 1100px;
        touch-action: pan-y pinch-zoom;
        --zoom: 1.15;
        --fx: 0px;
        --fy: 0px;
      }
      #theme-orange .compat-camera {
        pointer-events: none;
        position: absolute;
        width: 600px;
        height: 420px;
        left: 50%;
        top: 54%;
        transform: translate(-50%, -28%) scale(var(--zoom));
        transition: transform 1.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        transform-style: preserve-3d;
      }
      #theme-orange .compat-world {
        pointer-events: none;
        width: 600px;
        height: 420px;
        position: relative;
        transform-style: preserve-3d;
        transform: rotateX(58deg) rotateZ(var(--yaw))
          translate(var(--fx), var(--fy));
        transition: transform 1.6s cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      #theme-orange .orange-compat[data-focus='about'] {
        --zoom: 1.65;
        --fy: -65px;
      }
      #theme-orange .orange-compat[data-focus='journal'] {
        --zoom: 1.65;
        --fx: 105px;
        --fy: 75px;
      }
      #theme-orange .orange-compat[data-focus='tools'] {
        --zoom: 1.6;
        --fx: -90px;
        --fy: 65px;
      }
      #theme-orange .orange-compat[data-focus='profile'] {
        --zoom: 1.6;
        --fx: -145px;
        --fy: -15px;
      }
      #theme-orange .orange-compat-block {
        position: absolute;
        display: block;
        transform-style: preserve-3d;
        pointer-events: none;
      }
      #theme-orange .orange-compat-block > i {
        position: absolute;
        display: block;
        background: var(--block);
        backface-visibility: hidden;
      }
      #theme-orange .compat-top {
        inset: 0;
        transform: translateZ(var(--h));
        box-shadow: inset 0 0 0 1px #fff2;
        color: #516d5b;
        font: 12px monospace;
      }
      #theme-orange .compat-front {
        left: 0;
        top: 100%;
        width: 100%;
        height: var(--h);
        transform-origin: top;
        transform: translateZ(var(--h)) rotateX(-90deg);
        filter: brightness(0.86);
      }
      #theme-orange .compat-side {
        left: 100%;
        top: 0;
        width: var(--d);
        height: var(--h);
        transform-origin: top left;
        transform: rotateZ(90deg) rotateX(90deg);
        filter: brightness(0.73);
      }
      #theme-orange .compat-side-left {
        left: 0;
        top: 0;
        width: var(--d);
        height: var(--h);
        transform-origin: top left;
        transform: translateZ(var(--h)) rotateZ(90deg) rotateX(-90deg);
        filter: brightness(0.77);
      }
      #theme-orange .compat-item {
        pointer-events: auto;
        position: absolute;
        display: block;
        margin: 0;
        padding: 0;
        border: 0;
        background: transparent;
        transform: translateZ(34px);
        transform-style: preserve-3d;
        cursor: pointer;
      }
      #theme-orange .compat-item:focus-visible {
        outline: 3px solid #d89c57;
        outline-offset: 8px;
      }
      #theme-orange .compat-item .orange-compat-block > i {
        pointer-events: auto;
      }
      #theme-orange .compat-shelf {
        left: 62px;
        top: 47px;
        width: 130px;
        height: 48px;
      }
      #theme-orange .compat-desk {
        left: 300px;
        top: 55px;
        width: 200px;
        height: 90px;
      }
      #theme-orange .compat-cabinet {
        left: 443px;
        top: 248px;
        width: 90px;
        height: 65px;
      }
      #theme-orange .compat-sofa {
        left: 53px;
        top: 250px;
        width: 125px;
        height: 72px;
      }
      #theme-orange .compat-row {
        display: contents;
      }
      #theme-orange .compat-screen {
        position: absolute;
        left: 13px;
        top: 15px;
        width: 115px;
        height: 70px;
        border: 7px solid #344c42;
        border-radius: 5px;
        background: #527d66;
        color: #eef1d1;
        font: 11px monospace;
        transform-origin: top;
        transform: translateZ(208px) rotateX(-90deg);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 8px;
        box-shadow: inset 0 0 20px #c3dfb722;
      }
      #theme-orange .compat-screen span {
        opacity: 0.4;
        font-size: 8px;
      }
      #theme-orange .compat-drawer {
        position: absolute;
        inset: 0;
        transform-style: preserve-3d;
        transition: transform 1s;
      }
      #theme-orange .orange-compat[data-focus='profile'] .compat-drawer-1 {
        transform: translateY(22px);
      }
      #theme-orange
        .orange-compat[data-focus='journal']
        .compat-shelf
        .compat-row
        .orange-compat-block:not(:first-child) {
        animation: compat-book 2s ease-in-out infinite alternate;
      }
      #theme-orange .orange-compat[data-focus='tools'] .compat-screen {
        background: #72a78a;
        box-shadow: 0 0 40px #efce8a88;
      }
      #theme-orange .compat-orange {
        position: absolute;
        width: 34px;
        height: 34px;
        left: 30px;
        top: 20px;
        border-radius: 50%;
        background: radial-gradient(
          circle at 30% 28%,
          #ffe3a0,
          #ed9c3e 65%,
          #b46c3c
        );
        transform: translateZ(140px);
      }
      #theme-orange .compat-host {
        pointer-events: auto;
        position: absolute;
        left: 250px;
        top: 260px;
        width: 125px;
        height: 125px;
        border: 0;
        padding: 0;
        background: none;
        cursor: pointer;
        transform-style: preserve-3d;
        transform: translateZ(135px) rotateZ(calc(-1 * var(--yaw)))
          rotateX(-58deg);
      }
      #theme-orange .compat-portrait {
        position: relative;
        display: block;
        width: 125px;
        height: 125px;
        border-radius: 45% 45% 38% 38%;
        background: #fffaf1;
        border: 4px solid #f2d9a7;
        box-shadow:
          0 12px 25px #3c4c4633,
          0 0 35px #fff2d433;
        overflow: hidden;
      }
      #theme-orange .compat-portrait img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        user-select: none;
        pointer-events: none;
      }
      #theme-orange .compat-wave {
        position: absolute;
        top: 5px;
        right: 5px;
        color: #d79d47;
        opacity: 0;
      }
      #theme-orange .compat-greeting {
        animation: compat-greet 1.2s ease-in-out;
      }
      #theme-orange .compat-greeting .compat-wave {
        animation: compat-spark 2s both;
      }
      #theme-orange .compat-response {
        position: absolute;
        left: 215px;
        top: 218px;
        width: 190px;
        height: 190px;
        border: 2px solid #f4d498;
        border-radius: 50%;
        transform: translateZ(36px);
        pointer-events: none;
        opacity: 0.5;
      }
      #theme-orange .compat-response-active {
        animation: compat-response 1.5s both;
      }
      #theme-orange .compat-moon {
        position: absolute;
        right: 15%;
        top: 19%;
        width: 130px;
        height: 130px;
        border-radius: 50%;
        background: radial-gradient(
          circle at 30% 28%,
          #fff4ce,
          #e7d7b3 65%,
          #c1c7b1
        );
        box-shadow: 0 0 90px #fff0bf99;
      }
      #theme-orange .compat-cloud {
        position: absolute;
        width: 200px;
        height: 65px;
        border-radius: 80%;
        background: #fff9;
        box-shadow:
          40px -20px 0 #fff7,
          -40px 12px 0 #fff7;
        animation: compat-cloud 8s ease-in-out infinite alternate;
      }
      #theme-orange .compat-cloud-one {
        left: 8%;
        top: 72%;
      }
      #theme-orange .compat-cloud-two {
        right: 7%;
        top: 66%;
        animation-delay: -3s;
      }
      #theme-orange .orange-compat[data-tour='true'] .compat-world {
        animation: compat-tour 18s ease-in-out infinite alternate;
      }
      #theme-orange .orange-compat[data-still='true'] *,
      #theme-orange .orange-compat[data-ambience='false'] .compat-cloud {
        animation-play-state: paused !important;
      }
      #theme-orange .orange-compat-notice {
        position: absolute;
        top: 102px;
        right: 6%;
        z-index: 3;
        padding: 10px 14px;
        min-height: 44px;
        border-radius: 22px;
        border: 1px solid #ffffff66;
        background: #f8f2e3bb;
        color: #63715f;
        font-size: 11px;
        backdrop-filter: blur(12px);
      }
      .dark #theme-orange .compat-moon {
        background: #efdfbe;
        box-shadow: 0 0 90px #e8dabd33;
      }
      .dark #theme-orange .compat-cloud {
        background: #8b9b9f66;
        box-shadow:
          40px -20px 0 #8b9b9f44,
          -40px 12px 0 #8b9b9f44;
      }
      .dark #theme-orange .compat-top {
        filter: brightness(0.8);
      }
      .dark #theme-orange .orange-compat-notice {
        background: #24363cbb;
        color: #f1dbad;
      }
      @keyframes compat-tour {
        from {
          transform: rotateX(58deg) rotateZ(calc(var(--yaw) - 4deg));
        }
        to {
          transform: rotateX(58deg) rotateZ(calc(var(--yaw) + 4deg));
        }
      }
      @keyframes compat-cloud {
        to {
          translate: 12px -14px;
        }
      }
      @keyframes compat-greet {
        40% {
          translate: 0 -14px;
          rotate: -5deg;
        }
        70% {
          rotate: 4deg;
        }
      }
      @keyframes compat-spark {
        20%,
        80% {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
      @keyframes compat-response {
        from {
          opacity: 0.9;
          scale: 0.7;
        }
        to {
          opacity: 0;
          scale: 1.5;
        }
      }
      @keyframes compat-book {
        to {
          translate: 0 8px;
        }
      }
      @media (max-width: 760px) {
        #theme-orange .orange-compat {
          --zoom: 0.58;
        }
        #theme-orange .compat-camera {
          top: 52%;
        }
        #theme-orange .orange-compat[data-focus] {
          --zoom: 0.84;
        }
        #theme-orange .orange-compat[data-focus='world'] {
          --zoom: 0.58;
        }
        #theme-orange .compat-moon {
          width: 85px;
          height: 85px;
          right: 16%;
          top: 27%;
        }
        #theme-orange .compat-cloud {
          width: 100px;
          height: 42px;
        }
        #theme-orange .orange-compat-notice {
          top: 82px;
          right: 7%;
          font-size: 9px;
        }
      }
      @media (max-width: 350px) {
        #theme-orange .orange-compat[data-focus] {
          --zoom: 0.72;
        }
        #theme-orange .orange-compat[data-focus='world'] {
          --zoom: 0.48;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        #theme-orange .orange-compat * {
          animation: none !important;
          transition: none !important;
        }
      }
    `}</style>
  )
}

/** Original line tropes from iconic films & series. Not logos or likenesses. */

function Spark({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const a = 3 * s;
  const b = 10 * s;
  return (
    <path
      d={`M${x} ${y} l${a} ${b} ${b} ${a} -${b} ${a} -${a} ${b} -${a}-${b} -${b}-${a} ${b}-${a}z`}
    />
  );
}

export function Doodles() {
  return (
    <svg
      className="doodles"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <filter id="doodle-lift" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0.6" stdDeviation="0.35" floodColor="#fff" floodOpacity="0.28" />
          <feDropShadow
            dx="0.7"
            dy="1.4"
            stdDeviation="0.85"
            floodColor="#000"
            floodOpacity="0.38"
          />
        </filter>
      </defs>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.05"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#doodle-lift)"
      >
        <path
          className="doodle-dash"
          d="M70 830 C 200 770, 260 690, 340 630 S 500 510, 620 550 S 800 690, 960 650 S 1180 500, 1380 540"
        />
        <path className="doodle-dash" d="M40 210 C 160 180, 220 260, 180 320 S 80 400, 130 470" />
        <path
          className="doodle-dash"
          d="M1280 40 C 1340 120, 1260 180, 1320 260 S 1400 340, 1350 420"
        />

        <g className="doodle-twinkle">
          <Spark x={118} y={88} />
          <Spark x={1310} y={136} s={0.85} />
          <Spark x={70} y={428} s={0.7} />
          <Spark x={1388} y={408} s={0.7} />
          <Spark x={420} y={66} s={0.55} />
          <Spark x={980} y={76} s={0.6} />
          <Spark x={250} y={858} s={0.7} />
          <Spark x={1180} y={848} s={0.7} />
          <Spark x={540} y={48} s={0.45} />
          <Spark x={28} y={580} s={0.55} />
        </g>

        {/* Psycho — shower */}
        <g className="doodle-float">
          <g transform="translate(42 96)">
            <path d="M22 4 v10" />
            <path d="M8 14 h28" />
            <path
              className="doodle-drip"
              d="M10 18 l-3 10 M16 18 l-1 11 M22 18 v12 M28 18 l1 11 M34 18 l3 10"
            />
          </g>
        </g>
        {/* Psycho — house on the hill */}
        <g className="doodle-float-b">
          <g transform="translate(36 500)">
            <path d="M4 48 L4 28 L28 10 L52 28 L52 48" />
            <path d="M20 48 v-14 h12 v14" />
            <path d="M0 50 h56" />
            <path d="M28 10 v-8" />
          </g>
        </g>
        {/* Psycho — birds on a wire */}
        <path d="M18 640 h54" />
        <path d="M26 640 l-3 -6 6 0z M40 640 l-3 -5 6 0z M54 640 l-3 -6 6 0z" />

        {/* Breaking Bad — RV */}
        <g className="doodle-float">
          <g transform="translate(28 360)">
            <path d="M4 28 h52 v-16 h-20 l-8 -8 h-16 v8 h-8 v16z" />
            <circle cx="16" cy="30" r="4.5" />
            <circle cx="44" cy="30" r="4.5" />
            <path d="M22 16 h10 v6 h-10z" />
          </g>
        </g>
        {/* Breaking Bad — hat + round glasses */}
        <g className="doodle-float-b">
          <g transform="translate(48 280)">
            <path d="M4 16 h32" />
            <path d="M10 16 q10 -14 20 0" />
            <circle cx="10" cy="26" r="6" />
            <circle cx="26" cy="26" r="6" />
            <path d="M16 26 h4" />
          </g>
        </g>
        {/* Breaking Bad — flask */}
        <g transform="translate(70 200)">
          <path d="M14 4 v10 l10 16 h-20 l10 -16" />
          <path d="M8 4 h12" />
        </g>

        {/* Friends — couch */}
        <g className="doodle-float-b">
          <g transform="translate(1288 80)">
            <path d="M4 28 h72" />
            <path d="M8 28 v-12 q0 -6 8 -6 h48 q8 0 8 6 v12" />
            <path d="M8 16 h16 v8 h-16z M56 16 h16 v8 h-16z" />
            <path d="M10 28 v8 M70 28 v8" />
          </g>
        </g>
        {/* Friends — coffee cup */}
        <g className="doodle-float">
          <g transform="translate(1360 200)">
            <path d="M6 8 h22 v18 q0 8 -11 8 t-11 -8z" />
            <path d="M28 12 q10 0 10 8 t-10 8" />
            <path d="M10 4 c2 4 8 4 10 0" />
          </g>
        </g>
        {/* Friends — fountain */}
        <g transform="translate(1348 300)">
          <path d="M20 28 v-10" />
          <path d="M8 18 q12 -12 24 0" />
          <ellipse cx="20" cy="30" rx="16" ry="5" />
          <path d="M20 8 v4" />
        </g>
        {/* Friends — peephole frame */}
        <g transform="translate(1380 390)">
          <rect x="0" y="0" width="28" height="36" rx="2" />
          <circle cx="14" cy="16" r="5" />
        </g>

        {/* Jaws — fin */}
        <g className="doodle-float">
          <g transform="translate(88 800)">
            <path d="M4 24 q28 -4 56 0" />
            <path d="M28 24 l6 -18 8 18" />
          </g>
        </g>

        {/* E.T. — bike + moon */}
        <g className="doodle-float-b">
          <g transform="translate(200 40)">
            <circle cx="36" cy="8" r="10" />
            <circle cx="8" cy="22" r="6" />
            <circle cx="28" cy="22" r="6" />
            <path d="M8 22 h10 l6 -10 h8" />
            <path d="M18 22 l6 -4" />
          </g>
        </g>

        {/* Inception — spinning top */}
        <g className="doodle-spin">
          <g transform="translate(1320 760)">
            <path d="M16 4 l10 14 h-20z" />
            <path d="M16 18 v10" />
            <ellipse cx="16" cy="18" rx="8" ry="3" />
          </g>
        </g>

        {/* Jaws-adjacent water + Psycho knife is too much; Matrix pills */}
        <g transform="translate(36 700)">
          <ellipse cx="8" cy="10" rx="5" ry="9" />
          <ellipse cx="24" cy="10" rx="5" ry="9" />
        </g>

        {/* Pulp Fiction — briefcase */}
        <g transform="translate(24 780)">
          <rect x="2" y="10" width="36" height="22" rx="2" />
          <path d="M12 10 v-5 h16 v5" />
          <path d="M16 20 h8" />
        </g>

        {/* Godfather — orange */}
        <g transform="translate(80 640)">
          <circle cx="10" cy="12" r="9" />
          <path d="M10 4 q4 -6 8 -2" />
        </g>

        {/* Titanic — ship + iceberg */}
        <g className="doodle-float">
          <g transform="translate(1180 820)">
            <path d="M4 20 h40 l-6 8 h-28z" />
            <path d="M16 20 v-10 h4 v10" />
            <path d="M52 28 l10 -16 8 8 6 -6 8 14z" />
          </g>
        </g>

        {/* Back to the Future — clock */}
        <g className="doodle-float">
          <g transform="translate(1080 44)">
            <circle cx="14" cy="14" r="12" />
            <path d="M14 14 v-7 M14 14 l5 3" />
          </g>
        </g>
        {/* DeLorean hint */}
        <g className="doodle-float-b">
          <g transform="translate(1148 48)">
            <path d="M2 16 h36 l-4 -8 h-10 l-4 -4 h-8 l-4 4 h-6z" />
            <circle cx="10" cy="18" r="3" />
            <circle cx="30" cy="18" r="3" />
          </g>
        </g>

        {/* Jurassic — amber drop */}
        <g transform="translate(48 850)">
          <path d="M12 4 q10 8 10 18 a10 10 0 1 1 -20 0 q0 -10 10 -18z" />
          <path d="M9 20 l3 -4 2 3 3 -5" />
        </g>

        {/* Shining — tricycle */}
        <g transform="translate(1260 690)">
          <circle cx="8" cy="20" r="5" />
          <circle cx="28" cy="20" r="5" />
          <path d="M8 20 h20 l-6 -10 h-8" />
        </g>

        {/* Indiana Jones — fedora + whip curl */}
        <g transform="translate(20 430)">
          <path d="M2 14 h28" />
          <path d="M8 14 q8 -12 16 0" />
        </g>
        <path d="M22 460 q16 8 8 18 q-10 8 6 12" />

        {/* Wizard of Oz — slipper */}
        <g transform="translate(300 54)">
          <path d="M4 16 q8 -10 20 -2 q6 2 10 0" />
          <path d="M4 16 q2 6 10 4" />
        </g>
        {/* yellow brick dashes already in paths */}

        {/* Stranger Things — fairy lights */}
        <g className="doodle-twinkle" transform="translate(200 820)">
          <path className="doodle-dash" d="M0 0 q12 -8 24 0 q12 8 24 0 q12 -8 24 0" />
          <circle cx="0" cy="0" r="2.2" />
          <circle cx="24" cy="0" r="2.2" />
          <circle cx="48" cy="0" r="2.2" />
          <circle cx="72" cy="0" r="2.2" />
        </g>

        {/* Harry Potter-ish — round glasses + bolt (generic wizard) */}
        <g transform="translate(1368 600)">
          <circle cx="8" cy="10" r="7" />
          <circle cx="26" cy="10" r="7" />
          <path d="M15 10 h4" />
          <path d="M34 2 l-3 6 4 1 -4 7" />
        </g>

        {/* Star Wars-ish — saber */}
        <g transform="translate(1400 500)">
          <path d="M8 28 v-8 h6 v8z" />
          <path d="M11 20 v-18" />
        </g>
        {/* Death Star circle */}
        <g transform="translate(1388 448)">
          <circle cx="12" cy="12" r="11" />
          <circle cx="8" cy="8" r="3" />
          <path d="M2 14 h20" />
        </g>

        {/* The Office — mug */}
        <g transform="translate(64 620)">
          <path d="M4 6 h18 v16 q0 6 -9 6 t-9 -6z" />
          <path d="M22 10 q7 0 7 6 t-7 6" />
        </g>

        {/* Sherlock — pipe */}
        <g transform="translate(18 240)">
          <path d="M4 16 q0 -8 8 -8 h4 v8" />
          <path d="M16 16 h22" />
        </g>

        {/* Casablanca — piano */}
        <g transform="translate(1284 840)">
          <path d="M2 16 h40 v10 h-40z" />
          <path d="M8 16 v-8 h4 v8 M16 16 v-10 h3 v10 M24 16 v-8 h4 v8" />
        </g>

        {/* Kill Bill — katana */}
        <g transform="translate(1320 640)">
          <path d="M4 16 h36" />
          <path d="M4 13 h6 v6 h-6z" />
        </g>

        {/* Home Alone — hands-on-face (generic scream) */}
        <g transform="translate(88 180)">
          <circle cx="12" cy="12" r="9" />
          <path d="M8 10 v4 M16 10 v4 M10 16 q2 3 4 0" />
        </g>

        {/* Game of Thrones — simple wolf head */}
        <g transform="translate(20 850)">
          <path d="M8 20 l6 -12 6 8 6 -8 6 12 q-12 8 -24 0z" />
        </g>

        <path d="M218 46 c16 -7 25 5 12 12 c-10 5 4 14 16 5" />
        <path d="M1180 44 c14 -9 27 4 14 12 c-9 7 7 12 18 4" />
        <path d="M620 32 c12 -8 22 2 10 10 c-8 6 6 10 14 2" />

        <path d="M190 58 v12 M184 64 h12" />
        <path d="M40 258 v8 M36 262 h8" />
        <path d="M1400 298 v8 M1396 302 h8" />
      </g>
    </svg>
  );
}

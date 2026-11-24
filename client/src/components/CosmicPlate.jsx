import { useId } from 'react';

/**
 * Placas visuais astronômicas autorais em SVG vetorial 4K para os cards de repositório.
 * 100% preto, branco e violeta — zero dependências de imagens externas.
 */
export default function CosmicPlate({ theme = 'astrolabe', className = '' }) {
  const uid = useId().replace(/:/g, '');
  const glowId = `glow-${theme}-${uid}`;
  const beamId = `beam-${theme}-${uid}`;

  return (
    <div className={`relative overflow-hidden bg-[#06050B] ${className}`}>
      {/* Gradiente atmosférico de profundidade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            theme === 'prism'
              ? 'radial-gradient(circle at 65% 28%, rgba(168, 85, 247, 0.32), rgba(15, 10, 28, 0.9) 55%, #050508 100%)'
              : theme === 'constellation'
                ? 'radial-gradient(circle at 35% 32%, rgba(139, 92, 246, 0.3), rgba(10, 9, 18, 0.92) 58%, #040407 100%)'
                : theme === 'eclipse'
                  ? 'radial-gradient(circle at 50% 42%, rgba(192, 132, 252, 0.28), rgba(16, 10, 30, 0.94) 50%, #040407 100%)'
                  : theme === 'lattice'
                    ? 'radial-gradient(circle at 50% 25%, rgba(124, 58, 237, 0.26), rgba(9, 8, 16, 0.95) 60%, #040407 100%)'
                    : 'radial-gradient(circle at 50% 35%, rgba(139, 92, 246, 0.34), rgba(12, 9, 22, 0.92) 56%, #050508 100%)',
        }}
      />

      <svg
        viewBox="0 0 320 420"
        className="relative h-full w-full opacity-95 transition-transform duration-700 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={glowId} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#A855F7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={beamId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#C084FC" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Micro-campo estelar de fundo */}
        {[
          [38, 44, 1.1, 0.65],
          [268, 56, 1.3, 0.8],
          [112, 74, 0.8, 0.45],
          [242, 134, 1, 0.55],
          [56, 198, 1.2, 0.7],
          [282, 224, 0.9, 0.5],
          [94, 286, 1.1, 0.4],
          [214, 70, 0.9, 0.6],
          [156, 38, 1.4, 0.85],
        ].map(([cx, cy, r, op], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="#F6F6FA" fillOpacity={op} />
        ))}

        {theme === 'astrolabe' && (
          <g>
            <circle cx="160" cy="168" r="106" stroke="rgba(255,255,255,0.14)" strokeWidth="0.9" />
            <circle
              cx="160"
              cy="168"
              r="84"
              stroke="rgba(192,132,252,0.45)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
            <ellipse
              cx="160"
              cy="168"
              rx="116"
              ry="38"
              transform="rotate(-24 160 168)"
              stroke="rgba(255,255,255,0.34)"
              strokeWidth="1"
            />
            <ellipse
              cx="160"
              cy="168"
              rx="98"
              ry="30"
              transform="rotate(32 160 168)"
              stroke="rgba(168,85,247,0.55)"
              strokeWidth="1"
            />
            <line x1="160" y1="34" x2="160" y2="302" stroke="rgba(255,255,255,0.12)" />
            <line x1="36" y1="168" x2="284" y2="168" stroke="rgba(255,255,255,0.12)" />
            <circle cx="160" cy="168" r="56" fill={`url(#${glowId})`} />
            <circle cx="160" cy="168" r="12" fill="#0A0912" stroke="#E9D5FF" strokeWidth="1.5" />
            <circle cx="160" cy="168" r="3.5" fill="#FFFFFF" />
            <circle cx="244" cy="128" r="4" fill="#FFFFFF" />
            <circle cx="76" cy="204" r="3" fill="#C084FC" />
          </g>
        )}

        {theme === 'prism' && (
          <g>
            <circle cx="160" cy="164" r="76" fill={`url(#${glowId})`} opacity="0.7" />
            {/* Feixe branco incidente */}
            <line x1="24" y1="118" x2="132" y2="164" stroke="rgba(255,255,255,0.8)" strokeWidth="1.4" />
            {/* Feixes violetas refratados */}
            <line x1="188" y1="164" x2="304" y2="112" stroke="rgba(233,213,255,0.7)" strokeWidth="1.2" />
            <line x1="188" y1="168" x2="304" y2="156" stroke="rgba(192,132,252,0.65)" strokeWidth="1.6" />
            <line x1="188" y1="172" x2="304" y2="206" stroke="rgba(139,92,246,0.5)" strokeWidth="1.1" />
            {/* Prisma de obsidiana */}
            <polygon
              points="160,76 234,218 86,218"
              fill="rgba(14,12,24,0.82)"
              stroke="rgba(233,213,255,0.62)"
              strokeWidth="1.3"
            />
            <polygon
              points="160,104 206,198 114,198"
              fill="rgba(139,92,246,0.18)"
              stroke="rgba(192,132,252,0.45)"
              strokeWidth="0.9"
            />
            <line x1="160" y1="76" x2="160" y2="218" stroke="rgba(255,255,255,0.22)" />
          </g>
        )}

        {theme === 'constellation' && (
          <g>
            <path
              d="M66 132 L124 88 L194 114 L248 76 M124 88 L158 176 L236 196 M158 176 L92 224 L194 114"
              stroke="rgba(192,132,252,0.5)"
              strokeWidth="1.15"
            />
            <circle cx="158" cy="176" r="56" fill={`url(#${glowId})`} opacity="0.65" />
            {[
              [66, 132, 3.5],
              [124, 88, 4.5],
              [194, 114, 4],
              [248, 76, 3],
              [158, 176, 5.5],
              [236, 196, 3.5],
              [92, 224, 4],
            ].map(([cx, cy, r], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r * 2.4} fill="rgba(168,85,247,0.2)" />
                <circle cx={cx} cy={cy} r={r} fill="#FFFFFF" />
              </g>
            ))}
            <circle cx="158" cy="176" r="88" stroke="rgba(255,255,255,0.1)" strokeDasharray="2 5" />
          </g>
        )}

        {theme === 'eclipse' && (
          <g>
            <circle cx="160" cy="162" r="96" fill={`url(#${glowId})`} opacity="0.8" />
            {/* Halo luminoso da coroa */}
            <circle cx="160" cy="162" r="64" stroke="rgba(233,213,255,0.85)" strokeWidth="2.2" />
            <circle cx="160" cy="162" r="76" stroke="rgba(168,85,247,0.35)" strokeWidth="1" />
            {/* Disco de eclipse preto puro */}
            <circle cx="156" cy="164" r="60" fill="#040407" />
            {/* Ponto de diamante */}
            <circle cx="206" cy="118" r="4.5" fill="#FFFFFF" />
            <line x1="186" y1="118" x2="226" y2="118" stroke="rgba(255,255,255,0.75)" strokeWidth="1" />
            <line x1="206" y1="98" x2="206" y2="138" stroke="rgba(255,255,255,0.75)" strokeWidth="1" />
            <path d="M36 254 Q160 214 284 254" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          </g>
        )}

        {theme === 'lattice' && (
          <g>
            <circle cx="160" cy="156" r="74" fill={`url(#${glowId})`} opacity="0.65" />
            {/* Grade de perspectiva arquitetônica + cubo central */}
            {[0, 1, 2, 3, 4].map((row) => (
              <line
                key={`h-${row}`}
                x1="46"
                y1={92 + row * 34}
                x2="274"
                y2={92 + row * 34}
                stroke="rgba(255,255,255,0.1)"
              />
            ))}
            {[0, 1, 2, 3, 4].map((col) => (
              <line
                key={`v-${col}`}
                x1={64 + col * 48}
                y1="74"
                x2={64 + col * 48}
                y2="246"
                stroke="rgba(255,255,255,0.1)"
              />
            ))}
            <polygon
              points="160,92 224,128 224,196 160,232 96,196 96,128"
              fill="rgba(139,92,246,0.16)"
              stroke="rgba(216,180,254,0.65)"
              strokeWidth="1.3"
            />
            <polyline points="96,128 160,164 224,128" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
            <line x1="160" y1="164" x2="160" y2="232" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
            <circle cx="160" cy="164" r="5" fill="#FFFFFF" />
          </g>
        )}
      </svg>

      {/* Vinheta inferior para leitura perfeita da tipografia sobre o card */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/45 to-transparent" />
    </div>
  );
}

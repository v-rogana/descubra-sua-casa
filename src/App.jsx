import { useState, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// CASAS DA ALLOS — Landing Page + Universo Cultural
// ═══════════════════════════════════════════════════════════════

const HOUSES = {
  prisma: {
    name: "Prisma",
    color: "#2B7A9E",
    colorLight: "#3AAFCF",
    colorDark: "#1A5276",
    gradient: "linear-gradient(135deg, #1A5276, #2B7A9E, #3AAFCF)",
    glow: "rgba(43,122,158,0.4)",
    tagline: "Pensamento e comportamento são inseparáveis",
    sensibility: "Psicologia Comportamental",
    manifesto:
      "Um raio de luz bruto e indistinto atravessa o prisma e revela as cores que sempre estiveram ali. Da mesma forma, diante de um discurso recheado de dados, produzimos uma imagem límpida e clara. Não nos contentamos com explicações reducionistas — buscamos os pontos cegos da análise para reformulá-la com a complexidade que o caso exige.",
    values: [
      "Rigor conceitual",
      "Profundidade analítica",
      "Clareza e organização",
      "Integração e pluralidade teórica",
      "Postura crítica",
      "Colaboração e construção coletiva",
      "Abertura",
    ],
    personality:
      "Diante de uma queixa, nos colocamos perante uma rede complexa de condicionantes. A formulação de caso não se sustenta em um ponto focal — se constrói na interação de todos os fatores, de maneira sistêmica. Não adotamos posturas dogmáticas: a segunda onda aponta falhas da primeira, a terceira enxerga pontos cegos da segunda. Essa pluralidade nos enriquece, não nos divide.",
  },
  macondo: {
    name: "Macondo",
    color: "#6C4F9E",
    colorLight: "#9B7FD0",
    colorDark: "#4A3072",
    gradient: "linear-gradient(135deg, #4A3072, #6C4F9E, #9B7FD0)",
    glow: "rgba(108,79,158,0.4)",
    tagline: "A magia que habita o real",
    sensibility: "Realismo Mágico & Narrativas",
    manifesto:
      "Em Cem Anos de Solidão, chove por anos, uma cidade inteira perde o sono, e nada disso surpreende. A magia está ali porque sempre esteve. É no desencadear dos acontecimentos, na passagem do tempo, que a imagem toma forma e revela algo de transformador — partes que sempre existiram, dispersas, ganham contorno quando finalmente se encontram.",
    values: [
      "Integração",
      "Transformação",
      "Autenticidade",
      "Compreender pela experiência",
      "Encantamento com o mundo",
      "Curiosidade e rebeldia",
      "Construção de sentido",
      "Coletividade",
      "Complexidade",
      "Imaginação e poesia",
      "Cuidado e lealdade",
    ],
    personality:
      "Vemos o mundo como narrativa, como arte a ser interpretada e desvelada. Valorizamos as diferentes perspectivas, a espontaneidade nas relações e o encantamento com a complexidade da experiência humana. A prática é nossa fonte de conhecimento — e nos divertimos no processo.",
  },
  marmoris: {
    name: "Marmoris",
    color: "#D4A574",
    colorLight: "#E8CBA8",
    colorDark: "#C4956A",
    gradient: "linear-gradient(135deg, #C4956A, #D4A574, #E8CBA8)",
    glow: "rgba(212,165,116,0.4)",
    tagline: "A poesia que habita o simples",
    sensibility: "Beleza & Sensibilidade",
    manifesto:
      "Marmoris é uma expressão latina para o brilho do sol refletido na água do mar. Algo tão simples, mas que, com os olhos certos, pode ser absurdamente bonito. Nem sempre veremos marmoris — às vezes, veremos apenas água e sol. Mas queremos construir uma comunidade tão atenta e viva que alguém sempre vai nos cutucar e lembrar: \"ou, é mais do que água e sol\".",
    values: [
      "Simplicidade",
      "Beleza como prática",
      "Apreciação",
      "Sensibilidade",
      "Humanidade",
      "Construção de sentido",
      "Abertura à experiência",
      "Cuidado mútuo",
    ],
    personality:
      "Estamos em constante exercício da sensibilidade — disponíveis para contemplar a existência, para cuidar e ser cuidados. Compreendemos beleza não como exibição, mas como prática cotidiana: um tom de voz mais animado de um paciente, um silêncio onde o nada e o tudo são ditos, um pequeno marmoris pelo caminho. Construímos significados juntos, porque é frequentemente em comunidade que a poesia nos reencontra.",
  },
};

const HOUSE_ORDER = ["prisma", "macondo", "marmoris"];

// ── Quiz Questions ──
const QUIZ_QUESTIONS = [
  {
    question: "O que mais te atrai na psicologia clínica?",
    options: [
      { text: "A possibilidade de compreender o comportamento humano com rigor e profundidade", scores: { prisma: 3, macondo: 0, marmoris: 1 } },
      { text: "O encantamento com a complexidade das narrativas de cada pessoa", scores: { prisma: 0, macondo: 3, marmoris: 1 } },
      { text: "A beleza dos pequenos momentos de conexão e transformação", scores: { prisma: 0, macondo: 1, marmoris: 3 } },
    ],
  },
  {
    question: "Diante de um caso complexo, sua primeira reação é:",
    options: [
      { text: "Mapear sistematicamente todas as variáveis e suas interações", scores: { prisma: 3, macondo: 1, marmoris: 0 } },
      { text: "Buscar as múltiplas perspectivas e sentidos ainda não desvelados", scores: { prisma: 0, macondo: 3, marmoris: 1 } },
      { text: "Estar presente e atento ao que emerge na relação terapêutica", scores: { prisma: 1, macondo: 0, marmoris: 3 } },
    ],
  },
  {
    question: "Que frase te toca mais profundamente?",
    options: [
      { text: "\"Sem clareza, tateamos apenas parcialmente o fenômeno\"", scores: { prisma: 3, macondo: 0, marmoris: 1 } },
      { text: "\"É o próprio passo que inaugura o caminho\"", scores: { prisma: 0, macondo: 3, marmoris: 1 } },
      { text: "\"De vez em quando, Deus me tira a poesia. Olho pedra, vejo pedra mesmo\"", scores: { prisma: 0, macondo: 1, marmoris: 3 } },
    ],
  },
  {
    question: "No trabalho em equipe, você valoriza mais:",
    options: [
      { text: "A troca analítica que revela pontos cegos na formulação de caso", scores: { prisma: 3, macondo: 1, marmoris: 0 } },
      { text: "A construção coletiva de sentido a partir de olhares diferentes", scores: { prisma: 1, macondo: 3, marmoris: 1 } },
      { text: "O cuidado mútuo e a presença genuína entre colegas", scores: { prisma: 0, macondo: 1, marmoris: 3 } },
    ],
  },
  {
    question: "O que te faz sentir que está evoluindo como terapeuta?",
    options: [
      { text: "Quando minha formulação de caso se torna mais precisa e integrada", scores: { prisma: 3, macondo: 0, marmoris: 1 } },
      { text: "Quando consigo habitar a narrativa do paciente e ver o novo emergir", scores: { prisma: 0, macondo: 3, marmoris: 1 } },
      { text: "Quando percebo a beleza num silêncio ou numa mudança sutil de tom", scores: { prisma: 1, macondo: 1, marmoris: 3 } },
    ],
  },
];

// ── Universo Cultural Categories ──
const CATEGORIES = [
  { key: "musicas", label: "Músicas", icon: "♫" },
  { key: "filmes", label: "Filmes", icon: "🎬" },
  { key: "livros", label: "Livros", icon: "📖" },
  { key: "citacoes", label: "Citações", icon: "✦" },
  { key: "series", label: "Séries", icon: "📺" },
  { key: "podcasts", label: "Podcasts", icon: "🎙" },
];

// ── Universo Cultural Content ──
const CONTENT_DATA = {
  prisma: {
    musicas: [
      { id: "p-m1", title: "Comptine d'un autre été", artist: "Yann Tiersen", why: "Precisão emocional em cada nota — nada sobra, nada falta.", likeCount: 0 },
      { id: "p-m2", title: "Experience", artist: "Ludovico Einaudi", why: "Construção gradual e metódica que revela complexidade.", likeCount: 0 },
      { id: "p-m3", title: "Brain Damage", artist: "Pink Floyd", why: "Análise da mente que não se esquiva do desconforto.", likeCount: 0 },
    ],
    filmes: [
      { id: "p-f1", title: "A Beautiful Mind", artist: "Ron Howard", why: "A busca por padrões onde outros veem caos.", likeCount: 0 },
      { id: "p-f2", title: "Arrival", artist: "Denis Villeneuve", why: "A linguagem como lente que reformula a percepção da realidade.", likeCount: 0 },
      { id: "p-f3", title: "Whiplash", artist: "Damien Chazelle", why: "Rigor levado ao limite — onde excelência e obsessão se encontram.", likeCount: 0 },
    ],
    livros: [
      { id: "p-l1", title: "Pensar, Rápido e Devagar", artist: "Daniel Kahneman", why: "O mapa dos vieses que distorcem nosso olhar clínico.", likeCount: 0 },
      { id: "p-l2", title: "Terapia Cognitivo-Comportamental", artist: "Judith Beck", why: "Clareza conceitual como fundamento da prática.", likeCount: 0 },
      { id: "p-l3", title: "O Andar do Bêbado", artist: "Leonard Mlodinow", why: "A aleatoriedade que ignoramos na formulação de caso.", likeCount: 0 },
    ],
    citacoes: [
      { id: "p-c1", title: "\"O mapa não é o território.\"", artist: "Alfred Korzybski", why: "Lembrete de que nossos modelos são aproximações.", likeCount: 0 },
      { id: "p-c2", title: "\"Sem dados, você é apenas mais uma pessoa com uma opinião.\"", artist: "W. Edwards Deming", why: "A base empírica não é opcional.", likeCount: 0 },
      { id: "p-c3", title: "\"A clareza é a cortesia do filósofo.\"", artist: "José Ortega y Gasset", why: "Rigor não precisa ser inacessível.", likeCount: 0 },
    ],
    series: [
      { id: "p-s1", title: "Mindhunter", artist: "Netflix", why: "Formulação de caso criminal com rigor e profundidade.", likeCount: 0 },
      { id: "p-s2", title: "House M.D.", artist: "Fox", why: "Diagnóstico diferencial como exercício intelectual.", likeCount: 0 },
      { id: "p-s3", title: "The Good Doctor", artist: "ABC", why: "A precisão clínica encontra a empatia.", likeCount: 0 },
    ],
    podcasts: [
      { id: "p-p1", title: "Huberman Lab", artist: "Andrew Huberman", why: "Neurociência aplicada com rigor metodológico.", likeCount: 0 },
      { id: "p-p2", title: "Naruhodo!", artist: "B9", why: "Ciência comportamental acessível e bem fundamentada.", likeCount: 0 },
      { id: "p-p3", title: "Freakonomics Radio", artist: "Stephen Dubner", why: "Os dados por trás dos fenômenos que ignoramos.", likeCount: 0 },
    ],
  },
  macondo: {
    musicas: [
      { id: "m-m1", title: "Clandestino", artist: "Manu Chao", why: "O mundo inteiro cabe numa canção errante.", likeCount: 0 },
      { id: "m-m2", title: "Cucurrucucú Paloma", artist: "Caetano Veloso", why: "A dor cantada vira outra coisa — vira beleza.", likeCount: 0 },
      { id: "m-m3", title: "Aquarela", artist: "Toquinho", why: "A imaginação como forma legítima de conhecer.", likeCount: 0 },
    ],
    filmes: [
      { id: "m-f1", title: "A Viagem de Chihiro", artist: "Hayao Miyazaki", why: "O real e o mágico coexistem sem pedir licença.", likeCount: 0 },
      { id: "m-f2", title: "Birdman", artist: "Alejandro G. Iñárritu", why: "Identidade, narrativa e a linha borrada entre fantasia e realidade.", likeCount: 0 },
      { id: "m-f3", title: "Labirinto do Fauno", artist: "Guillermo del Toro", why: "A fantasia como sobrevivência diante do insuportável.", likeCount: 0 },
    ],
    livros: [
      { id: "m-l1", title: "Cem Anos de Solidão", artist: "Gabriel García Márquez", why: "A obra que nomeou nossa Casa — onde o extraordinário é cotidiano.", likeCount: 0 },
      { id: "m-l2", title: "O Pequeno Príncipe", artist: "Antoine de Saint-Exupéry", why: "O essencial invisível que só a narrativa revela.", likeCount: 0 },
      { id: "m-l3", title: "A Insustentável Leveza do Ser", artist: "Milan Kundera", why: "As múltiplas camadas de sentido na experiência humana.", likeCount: 0 },
    ],
    citacoes: [
      { id: "m-c1", title: "\"É o próprio passo que inaugura o caminho.\"", artist: "Eduardo Galeano", why: "A prática como forma de descobrir o que ainda não sabemos.", likeCount: 0 },
      { id: "m-c2", title: "\"A realidade não é o que acontece, mas o que fazemos com o que acontece.\"", artist: "Aldous Huxley", why: "A construção de sentido como ato criativo.", likeCount: 0 },
      { id: "m-c3", title: "\"Quem olha para fora, sonha. Quem olha para dentro, desperta.\"", artist: "Carl Jung", why: "A narrativa interior como território de transformação.", likeCount: 0 },
    ],
    series: [
      { id: "m-s1", title: "Severance", artist: "Apple TV+", why: "Identidade fragmentada e a busca por integração narrativa.", likeCount: 0 },
      { id: "m-s2", title: "Dark", artist: "Netflix", why: "O tempo como labirinto — cada camada revela novos sentidos.", likeCount: 0 },
      { id: "m-s3", title: "Undone", artist: "Amazon", why: "Onde a realidade termina e a narrativa interior começa?", likeCount: 0 },
    ],
    podcasts: [
      { id: "m-p1", title: "Invisibilia", artist: "NPR", why: "As forças invisíveis que moldam o comportamento humano.", likeCount: 0 },
      { id: "m-p2", title: "Radiolab", artist: "WNYC", why: "A curiosidade como portal para o extraordinário no ordinário.", likeCount: 0 },
      { id: "m-p3", title: "O Imaginariado", artist: "Independente", why: "Arte, cultura e imaginação como formas de habitar o mundo.", likeCount: 0 },
    ],
  },
  marmoris: {
    musicas: [
      { id: "r-m1", title: "Clair de Lune", artist: "Claude Debussy", why: "A beleza que não precisa de palavras para ser sentida.", likeCount: 0 },
      { id: "r-m2", title: "Divenire", artist: "Ludovico Einaudi", why: "O belo nascendo lentamente, como o sol sobre a água.", likeCount: 0 },
      { id: "r-m3", title: "Eu Sei Que Vou Te Amar", artist: "Tom Jobim & Vinicius", why: "A simplicidade que carrega tudo dentro de si.", likeCount: 0 },
    ],
    filmes: [
      { id: "r-f1", title: "A Árvore da Vida", artist: "Terrence Malick", why: "Cada frame é um exercício de contemplação.", likeCount: 0 },
      { id: "r-f2", title: "Paterson", artist: "Jim Jarmusch", why: "A poesia escondida na repetição do cotidiano.", likeCount: 0 },
      { id: "r-f3", title: "Nomadland", artist: "Chloé Zhao", why: "Beleza na impermanência — o simples que é tudo.", likeCount: 0 },
    ],
    livros: [
      { id: "r-l1", title: "O Livro das Ignorãças", artist: "Manoel de Barros", why: "Ver o mundo com olhos de primeira vez.", likeCount: 0 },
      { id: "r-l2", title: "A Poética do Espaço", artist: "Gaston Bachelard", why: "A intimidade dos espaços como espelho da alma.", likeCount: 0 },
      { id: "r-l3", title: "Felicidade Clandestina", artist: "Clarice Lispector", why: "O instante que contém o infinito.", likeCount: 0 },
    ],
    citacoes: [
      { id: "r-c1", title: "\"De vez em quando, Deus me tira a poesia. Olho pedra, vejo pedra mesmo.\"", artist: "Adélia Prado", why: "O contraste que nos lembra de olhar com atenção.", likeCount: 0 },
      { id: "r-c2", title: "\"A gente não quer só comida, a gente quer saída para qualquer parte.\"", artist: "Arnaldo Antunes / Titãs", why: "O desejo humano de transcender o imediato.", likeCount: 0 },
      { id: "r-c3", title: "\"Que a importância de uma coisa não se mede com fita métrica nem com balanças.\"", artist: "Manoel de Barros", why: "O valor do que não pode ser quantificado.", likeCount: 0 },
    ],
    series: [
      { id: "r-s1", title: "Midnight Diner", artist: "Netflix", why: "Histórias simples, noturnas, cheias de humanidade.", likeCount: 0 },
      { id: "r-s2", title: "Normal People", artist: "BBC/Hulu", why: "A beleza difícil da intimidade real.", likeCount: 0 },
      { id: "r-s3", title: "Anne with an E", artist: "Netflix", why: "O encantamento com o mundo como forma de resistência.", likeCount: 0 },
    ],
    podcasts: [
      { id: "r-p1", title: "On Being", artist: "Krista Tippett", why: "Conversas que tocam o que há de mais humano.", likeCount: 0 },
      { id: "r-p2", title: "Pra Não Dizer que Não Falei", artist: "Independente", why: "Sensibilidade e escuta como prática.", likeCount: 0 },
      { id: "r-p3", title: "The Moth", artist: "The Moth", why: "Histórias reais contadas com vulnerabilidade e beleza.", likeCount: 0 },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// EMBLEMS
// ═══════════════════════════════════════════════════════════════

function PrismaEmblem({ size = 56 }) {
  const m = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="glow-prisma" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3AAFCF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1A5276" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fill-prisma" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3AAFCF" />
          <stop offset="100%" stopColor="#1A5276" />
        </linearGradient>
      </defs>
      <circle cx={m} cy={m} r={m * 0.8} fill="url(#glow-prisma)" />
      <polygon
        points={`${m},${size * 0.2} ${size * 0.75},${size * 0.7} ${size * 0.25},${size * 0.7}`}
        fill="none" stroke="#3AAFCF" strokeWidth="2"
      >
        <animateTransform attributeName="transform" type="rotate" from={`0 ${m} ${m}`} to={`360 ${m} ${m}`} dur="20s" repeatCount="indefinite" />
      </polygon>
      <polygon
        points={`${m},${size * 0.28} ${size * 0.68},${size * 0.64} ${size * 0.32},${size * 0.64}`}
        fill="url(#fill-prisma)" opacity="0.7"
      />
    </svg>
  );
}

function MacondoEmblem({ size = 56 }) {
  const m = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="glow-macondo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9B7FD0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#4A3072" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fill-macondo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9B7FD0" />
          <stop offset="100%" stopColor="#4A3072" />
        </linearGradient>
      </defs>
      <circle cx={m} cy={m} r={m * 0.8} fill="url(#glow-macondo)" />
      <rect x={size * 0.25} y={size * 0.25} width={size * 0.5} height={size * 0.5} rx="4" fill="url(#fill-macondo)" opacity="0.7" />
      <line x1={m} y1={size * 0.25} x2={m} y2={size * 0.75} stroke="#4A3072" strokeWidth="1.5" />
      <line x1={size * 0.25} y1={m} x2={size * 0.75} y2={m} stroke="#4A3072" strokeWidth="1.5" />
    </svg>
  );
}

function MarmorisEmblem({ size = 56 }) {
  const m = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="glow-marmoris" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8CBA8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C4956A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fill-marmoris" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8CBA8" />
          <stop offset="100%" stopColor="#C4956A" />
        </linearGradient>
      </defs>
      <circle cx={m} cy={m} r={m * 0.8} fill="url(#glow-marmoris)" />
      <circle cx={m} cy={size * 0.35} r={size * 0.18} fill="url(#fill-marmoris)" opacity="0.8" />
      <path d={`M ${size * 0.2} ${size * 0.6} Q ${size * 0.35} ${size * 0.52} ${m} ${size * 0.6} Q ${size * 0.65} ${size * 0.68} ${size * 0.8} ${size * 0.6}`} fill="none" stroke="#E8CBA8" strokeWidth="1.5" opacity="0.6" />
      <path d={`M ${size * 0.15} ${size * 0.68} Q ${size * 0.35} ${size * 0.6} ${m} ${size * 0.68} Q ${size * 0.65} ${size * 0.76} ${size * 0.85} ${size * 0.68}`} fill="none" stroke="#E8CBA8" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

const EMBLEM_MAP = { prisma: PrismaEmblem, macondo: MacondoEmblem, marmoris: MarmorisEmblem };

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
    dur: Math.random() * 20 + 15,
    delay: Math.random() * -20,
    opacity: Math.random() * 0.3 + 0.1,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map((p) => (
        <div key={p.id} style={{ position: "absolute", left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, borderRadius: "50%", background: "#2E9E8F", opacity: p.opacity, animation: `floatParticle ${p.dur}s ease-in-out ${p.delay}s infinite` }} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HOUSE CARDS (As Casas tab)
// ═══════════════════════════════════════════════════════════════

function HouseCard({ houseKey }) {
  const house = HOUSES[houseKey];
  const [expanded, setExpanded] = useState(false);
  const Emblem = EMBLEM_MAP[houseKey];

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20, padding: "36px 28px",
        position: "relative", overflow: "hidden",
        backdropFilter: "blur(20px)",
        transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
        cursor: "pointer",
      }}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.boxShadow = `0 20px 60px ${house.glow}`; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: "80%", height: "80%", borderRadius: "50%", background: `radial-gradient(circle, ${house.glow}, transparent 70%)`, pointerEvents: "none", opacity: 0.5 }} />
      <div style={{ position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}><Emblem size={64} /></div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 600, fontStyle: "italic", color: house.colorLight, textAlign: "center", marginBottom: 4 }}>{house.name}</h2>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", textAlign: "center", marginBottom: 8 }}>{house.sensibility}</p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.3)", textAlign: "center", marginBottom: 20 }}>"{house.tagline}"</p>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.55)", marginBottom: expanded ? 24 : 0, maxHeight: expanded ? 600 : 0, overflow: "hidden", transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)", opacity: expanded ? 1 : 0 }}>{house.manifesto}</p>
        {expanded && (
          <div style={{ marginBottom: 24, animation: "fadeIn 0.5s both 0.1s" }}>
            <h4 style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: house.colorLight, marginBottom: 12, fontWeight: 600 }}>Valores</h4>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.8 }}>{house.values.join(" · ")}</p>
          </div>
        )}
        {expanded && (
          <div style={{ animation: "fadeIn 0.5s both 0.2s" }}>
            <h4 style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: house.colorLight, marginBottom: 12, fontWeight: 600 }}>Nosso Olhar</h4>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{house.personality}</p>
          </div>
        )}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <span style={{ fontSize: 12, color: house.colorLight, opacity: 0.6, transition: "transform 0.3s", display: "inline-block", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════════════════════════

function Quiz() {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ prisma: 0, macondo: 0, marmoris: 0 });
  const [result, setResult] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAnswer = (option) => {
    setSelectedOption(option);
    const newScores = { ...scores };
    Object.entries(option.scores).forEach(([house, score]) => { newScores[house] += score; });
    setScores(newScores);
    setTimeout(() => {
      setSelectedOption(null);
      if (currentQ < QUIZ_QUESTIONS.length - 1) { setCurrentQ(currentQ + 1); }
      else { setResult(Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0]); }
    }, 600);
  };

  const resetQuiz = () => { setStarted(false); setCurrentQ(0); setScores({ prisma: 0, macondo: 0, marmoris: 0 }); setResult(null); setSelectedOption(null); };

  if (!started) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <span style={{ fontSize: 48, display: "block", marginBottom: 24 }}>🎩</span>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, marginBottom: 12, color: "#E8E6E3" }}>Descubra sua <em style={{ fontWeight: 600 }}>Casa</em></h3>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>Responda 5 perguntas e descubra qual Casa ressoa mais com o seu jeito de ser terapeuta.</p>
        <button onClick={() => setStarted(true)} style={{ padding: "14px 40px", borderRadius: 100, border: "1px solid rgba(46,158,143,0.4)", background: "rgba(46,158,143,0.1)", color: "#5EEAD4", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(46,158,143,0.2)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(46,158,143,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(46,158,143,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
        >Começar</button>
      </div>
    );
  }

  if (result) {
    const house = HOUSES[result];
    const Emblem = EMBLEM_MAP[result];
    const total = scores.prisma + scores.macondo + scores.marmoris;
    return (
      <div style={{ textAlign: "center", padding: "48px 24px", animation: "fadeInUp 0.8s both" }}>
        <Emblem size={80} />
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 600, fontStyle: "italic", color: house.colorLight, marginTop: 20, marginBottom: 8 }}>{house.name}</h3>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontStyle: "italic", color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>"{house.tagline}"</p>
        <div style={{ maxWidth: 360, margin: "0 auto 32px", textAlign: "left" }}>
          {HOUSE_ORDER.map((key) => {
            const h = HOUSES[key];
            const pct = total > 0 ? (scores[key] / total) * 100 : 0;
            return (
              <div key={key} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: key === result ? h.colorLight : "rgba(255,255,255,0.5)", fontWeight: key === result ? 600 : 400 }}>{h.name}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{Math.round(pct)}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 4, background: h.gradient, width: `${pct}%`, transition: "width 1s cubic-bezier(0.22,1,0.36,1)", boxShadow: key === result ? `0 0 12px ${h.color}40` : "none" }} />
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={resetQuiz} style={{ padding: "10px 28px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        >Refazer quiz</button>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / QUIZ_QUESTIONS.length) * 100;
  return (
    <div style={{ padding: "36px 24px", animation: "fadeIn 0.4s both" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 1, textTransform: "uppercase" }}>Pergunta {currentQ + 1} de {QUIZ_QUESTIONS.length}</span>
        </div>
        <div style={{ height: 2, borderRadius: 1, background: "rgba(255,255,255,0.06)" }}>
          <div style={{ height: "100%", borderRadius: 1, background: "linear-gradient(90deg, #2B7A9E, #6C4F9E, #D4A574)", width: `${progress}%`, transition: "width 0.5s cubic-bezier(0.22,1,0.36,1)" }} />
        </div>
      </div>
      <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 400, color: "#E8E6E3", marginBottom: 28, lineHeight: 1.4 }}>{q.question}</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {q.options.map((opt, i) => {
          const isSelected = selectedOption === opt;
          return (
            <button key={i} onClick={() => !selectedOption && handleAnswer(opt)}
              style={{ padding: "16px 20px", borderRadius: 14, border: `1px solid ${isSelected ? "rgba(46,158,143,0.5)" : "rgba(255,255,255,0.08)"}`, background: isSelected ? "rgba(46,158,143,0.1)" : "rgba(255,255,255,0.02)", color: isSelected ? "#5EEAD4" : "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.5, cursor: selectedOption ? "default" : "pointer", fontFamily: "'Outfit', sans-serif", textAlign: "left", transition: "all 0.3s" }}
              onMouseEnter={(e) => { if (!selectedOption) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; } }}
              onMouseLeave={(e) => { if (!selectedOption) { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; } }}
            >{opt.text}</button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// UNIVERSO CULTURAL COMPONENTS
// ═══════════════════════════════════════════════════════════════

function ContentCard({ item, house, onLike, likes, onShare }) {
  const [hovered, setHovered] = useState(false);
  const isLiked = likes.has(item.id);
  const h = HOUSES[house];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? `${h.color}33` : "rgba(255,255,255,0.06)"}`,
        borderRadius: 16, padding: "24px 22px",
        transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? `0 12px 40px ${h.glow.replace("0.4", "0.15")}` : "none",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: hovered ? h.gradient : "transparent", transition: "background 0.4s", opacity: 0.6 }} />
      <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#E8E6E3", marginBottom: 4, lineHeight: 1.3, paddingRight: 36 }}>{item.title}</h4>
      <p style={{ fontSize: 12, color: h.colorLight, fontWeight: 500, marginBottom: 12, opacity: 0.8 }}>{item.artist}</p>
      <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>{item.why}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={(e) => { e.stopPropagation(); onLike(item.id); }}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, border: `1px solid ${isLiked ? `${h.color}55` : "rgba(255,255,255,0.08)"}`, background: isLiked ? `${h.color}18` : "rgba(255,255,255,0.02)", color: isLiked ? h.colorLight : "rgba(255,255,255,0.35)", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s" }}>
          {isLiked ? "♥" : "♡"} <span style={{ fontSize: 12 }}>{(item.likeCount || 0) + (isLiked ? 1 : 0)}</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); onShare(item); }}
          style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.35)", fontSize: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s" }}>
          ↗ Compartilhar
        </button>
      </div>
    </div>
  );
}

function SuggestModal({ house, onClose, onSubmit }) {
  const [cat, setCat] = useState(CATEGORIES[0].key);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [why, setWhy] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const h = HOUSES[house];
  const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#E8E6E3", fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: "none", transition: "border-color 0.3s" };

  const handleSubmit = () => { if (!title.trim()) return; onSubmit({ category: cat, title, artist, why, house }); setSubmitted(true); };

  if (submitted) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()} style={{ background: "#0D0D14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "48px 36px", maxWidth: 400, textAlign: "center", animation: "fadeInUp 0.4s both" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 400, color: "#E8E6E3", marginBottom: 12 }}>Sugestão registrada!</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24, lineHeight: 1.6 }}>Sua sugestão para a Casa {HOUSES[house].name} foi enviada. A coordenação vai revisar e adicionar ao universo cultural.</p>
          <button onClick={onClose} style={{ padding: "10px 28px", borderRadius: 100, border: `1px solid ${h.color}44`, background: `${h.color}15`, color: h.colorLight, fontSize: 14, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Fechar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#0D0D14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "36px 32px", maxWidth: 480, width: "90%", animation: "fadeInUp 0.4s both", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: h.gradient }} />
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 400, color: "#E8E6E3", marginBottom: 4 }}>Sugerir para <em style={{ fontWeight: 600, color: h.colorLight }}>{HOUSES[house].name}</em></h3>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 28 }}>Compartilhe algo que represente a essência da sua Casa.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
          {CATEGORIES.map((c) => (
            <button key={c.key} onClick={() => setCat(c.key)} style={{ padding: "6px 14px", borderRadius: 100, fontSize: 12, cursor: "pointer", border: `1px solid ${cat === c.key ? `${h.color}55` : "rgba(255,255,255,0.08)"}`, background: cat === c.key ? `${h.color}18` : "rgba(255,255,255,0.02)", color: cat === c.key ? h.colorLight : "rgba(255,255,255,0.4)", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s" }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          <input placeholder="Título *" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} onFocus={(e) => e.target.style.borderColor = `${h.color}55`} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
          <input placeholder="Autor / Artista" value={artist} onChange={(e) => setArtist(e.target.value)} style={inputStyle} onFocus={(e) => e.target.style.borderColor = `${h.color}55`} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
          <textarea placeholder="Por que isso representa a Casa?" value={why} onChange={(e) => setWhy(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} onFocus={(e) => e.target.style.borderColor = `${h.color}55`} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 24px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Cancelar</button>
          <button onClick={handleSubmit} disabled={!title.trim()} style={{ padding: "10px 28px", borderRadius: 100, border: `1px solid ${title.trim() ? `${h.color}55` : "rgba(255,255,255,0.06)"}`, background: title.trim() ? `${h.color}20` : "rgba(255,255,255,0.02)", color: title.trim() ? h.colorLight : "rgba(255,255,255,0.2)", fontSize: 14, fontWeight: 500, cursor: title.trim() ? "pointer" : "default", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s" }}>Enviar sugestão</button>
        </div>
      </div>
    </div>
  );
}

function ShareCard({ item, house, category, onClose }) {
  const h = HOUSES[house];
  const Emblem = EMBLEM_MAP[house];
  const catObj = CATEGORIES.find((c) => c.key === category);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }} onClick={onClose}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, animation: "fadeInUp 0.5s both" }}>
        <div onClick={(e) => e.stopPropagation()} style={{ width: 340, minHeight: 480, background: "#07070C", borderRadius: 24, padding: "40px 28px 32px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", border: `1px solid ${h.color}33` }}>
          <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: "120%", height: "60%", borderRadius: "50%", background: `radial-gradient(circle, ${h.glow.replace("0.4", "0.2")}, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: h.gradient }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, border: `1px solid ${h.color}33`, background: `${h.color}10`, fontSize: 10, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", color: h.colorLight, marginBottom: 28 }}>
            {catObj?.icon} {catObj?.label}
          </div>
          <Emblem size={52} />
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 11, fontStyle: "italic", letterSpacing: 1, textTransform: "uppercase", color: h.colorLight, opacity: 0.6, marginTop: 12, marginBottom: 32 }}>Casa {h.name}</p>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 600, color: "#E8E6E3", textAlign: "center", lineHeight: 1.3, marginBottom: 8, position: "relative" }}>{item.title}</h3>
          <p style={{ fontSize: 13, color: h.colorLight, fontWeight: 500, marginBottom: 20, opacity: 0.7 }}>{item.artist}</p>
          <div style={{ width: 32, height: 1, background: `${h.color}44`, marginBottom: 20 }} />
          <p style={{ fontSize: 13, fontStyle: "italic", lineHeight: 1.65, color: "rgba(255,255,255,0.4)", textAlign: "center", maxWidth: 260 }}>"{item.why}"</p>
          <div style={{ marginTop: "auto", paddingTop: 32, textAlign: "center" }}>
            <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.1)", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Universo Cultural · Allos</p>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center", maxWidth: 300 }}>Tire um print do card para compartilhar nos stories</p>
        <button onClick={onClose} style={{ padding: "10px 28px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Fechar</button>
      </div>
    </div>
  );
}

// ── Universo Cultural Section ──
function UniversoCultural() {
  const [activeHouse, setActiveHouse] = useState("prisma");
  const [activeCategory, setActiveCategory] = useState("musicas");
  const [likes, setLikes] = useState(new Set());
  const [showSuggest, setShowSuggest] = useState(false);
  const [shareItem, setShareItem] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const house = HOUSES[activeHouse];
  const items = CONTENT_DATA[activeHouse]?.[activeCategory] || [];

  const toggleLike = useCallback((id) => {
    setLikes((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }, []);

  const handleSuggest = useCallback((suggestion) => {
    setSuggestions((prev) => [...prev, { ...suggestion, id: `sug-${Date.now()}`, likeCount: 0 }]);
  }, []);

  const allItems = [
    ...items,
    ...suggestions.filter((s) => s.house === activeHouse && s.category === activeCategory).map((s) => ({
      id: s.id, title: s.title, artist: s.artist || "—", why: s.why || "", likeCount: 0,
    })),
  ];

  return (
    <div style={{ animation: "fadeInUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both" }}>
      {/* House Selector */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
        {HOUSE_ORDER.map((key) => {
          const h = HOUSES[key];
          const active = activeHouse === key;
          const Emblem = EMBLEM_MAP[key];
          return (
            <button key={key} onClick={() => { setActiveHouse(key); setActiveCategory("musicas"); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 100, cursor: "pointer", border: `1px solid ${active ? `${h.color}55` : "rgba(255,255,255,0.08)"}`, background: active ? `${h.color}15` : "rgba(255,255,255,0.02)", color: active ? h.colorLight : "rgba(255,255,255,0.45)", fontSize: 14, fontWeight: 500, fontFamily: "'Outfit', sans-serif", transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)", boxShadow: active ? `0 0 24px ${h.glow.replace("0.4", "0.12")}` : "none" }}>
              <Emblem size={22} /> {h.name}
            </button>
          );
        })}
      </div>

      {/* Tagline */}
      <p style={{ textAlign: "center", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontStyle: "italic", color: "rgba(255,255,255,0.25)", marginBottom: 28, transition: "color 0.5s" }}>"{house.tagline}"</p>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.key;
          return (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
              style={{ padding: "7px 16px", borderRadius: 100, cursor: "pointer", border: `1px solid ${active ? `${house.color}44` : "rgba(255,255,255,0.06)"}`, background: active ? `${house.color}12` : "rgba(255,255,255,0.015)", color: active ? house.colorLight : "rgba(255,255,255,0.35)", fontSize: 13, fontWeight: active ? 500 : 400, fontFamily: "'Outfit', sans-serif", transition: "all 0.3s", whiteSpace: "nowrap" }}>
              {cat.icon} {cat.label}
            </button>
          );
        })}
      </div>

      {/* Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 40 }}>
        {allItems.map((item) => (
          <ContentCard key={item.id} item={item} house={activeHouse} likes={likes} onLike={toggleLike} onShare={(it) => setShareItem(it)} />
        ))}
      </div>

      {/* Suggest Button */}
      <div style={{ textAlign: "center" }}>
        <button onClick={() => setShowSuggest(true)}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 100, cursor: "pointer", border: `1px solid ${house.color}44`, background: `${house.color}10`, color: house.colorLight, fontSize: 14, fontWeight: 500, fontFamily: "'Outfit', sans-serif", transition: "all 0.3s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = `${house.color}20`; e.currentTarget.style.boxShadow = `0 0 30px ${house.glow.replace("0.4", "0.15")}`; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = `${house.color}10`; e.currentTarget.style.boxShadow = "none"; }}>
          + Sugerir para {house.name}
        </button>
      </div>

      {/* House Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        {HOUSE_ORDER.map((key) => {
          const h = HOUSES[key];
          const total = Object.values(CONTENT_DATA[key] || {}).reduce((sum, arr) => sum + arr.length, 0);
          const sugCount = suggestions.filter((s) => s.house === key).length;
          return (
            <div key={key} style={{ textAlign: "center" }}>
              <p style={{ fontSize: 24, fontWeight: 300, color: h.colorLight, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{total + sugCount}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase" }}>{h.name}</p>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {showSuggest && <SuggestModal house={activeHouse} onClose={() => setShowSuggest(false)} onSubmit={handleSuggest} />}
      {shareItem && <ShareCard item={shareItem} house={activeHouse} category={activeCategory} onClose={() => setShareItem(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP — All sections unified
// ═══════════════════════════════════════════════════════════════

export default function CasasLandingPage() {
  const [activeSection, setActiveSection] = useState("home");

  const NAV_TABS = [
    { key: "home", label: "As Casas" },
    { key: "quiz", label: "🎩 Descubra sua Casa" },
    { key: "universo", label: "🎨 Universo Cultural" },
    { key: "arena", label: "⚔️ Arena" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#07070C", color: "#E8E6E3", fontFamily: "'Outfit', -apple-system, sans-serif", overflowX: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        @keyframes floatParticle { 0%, 100% { transform: translate(0, 0) scale(1); } 25% { transform: translate(10px, -20px) scale(1.3); } 50% { transform: translate(-5px, -40px) scale(0.8); } 75% { transform: translate(15px, -20px) scale(1.1); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.9; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      <Particles />

      {/* BG Orbs */}
      <div style={{ position: "fixed", top: "-20%", left: "-10%", width: "50%", height: "50%", borderRadius: "50%", background: "radial-gradient(circle, rgba(46,158,143,0.06), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: "60%", height: "60%", borderRadius: "50%", background: "radial-gradient(circle, rgba(108,79,158,0.04), transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: 64, animation: "fadeInUp 0.8s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 100, border: "1px solid rgba(46,158,143,0.25)", background: "rgba(46,158,143,0.06)", fontSize: 12, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", color: "#5EEAD4", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5EEAD4", animation: "pulseGlow 2s infinite" }} />
            Associação Allos
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(40px, 7vw, 68px)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 16 }}>
            As{" "}
            <em style={{ fontWeight: 600, fontStyle: "italic", backgroundImage: "linear-gradient(135deg, #3AAFCF, #5EEAD4, #E8CBA8, #9B7FD0)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 6s linear infinite" }}>Casas</em>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", fontWeight: 300, maxWidth: 500, margin: "0 auto" }}>
            Três caminhos, uma mesma missão. Cada Casa carrega uma visão de mundo, um jeito de fazer clínica, uma forma de estar junto.
          </p>
        </header>

        {/* Navigation — now with 4 tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 48, animation: "fadeInUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both", flexWrap: "wrap" }}>
          {NAV_TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveSection(tab.key)}
              style={{
                padding: "10px 24px",
                border: `1px solid ${activeSection === tab.key ? "rgba(46,158,143,0.5)" : "rgba(255,255,255,0.12)"}`,
                background: activeSection === tab.key ? "rgba(46,158,143,0.15)" : "rgba(255,255,255,0.03)",
                color: activeSection === tab.key ? "#5EEAD4" : "rgba(255,255,255,0.5)",
                borderRadius: 100, cursor: "pointer", fontSize: 14, fontWeight: 500,
                fontFamily: "'Outfit', sans-serif",
                transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                backdropFilter: "blur(10px)",
                boxShadow: activeSection === tab.key ? "0 0 20px rgba(46,158,143,0.15)" : "none",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── As Casas ── */}
        {activeSection === "home" && (
          <div style={{ animation: "fadeInUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 48 }}>
              {HOUSE_ORDER.map((key) => <HouseCard key={key} houseKey={key} />)}
            </div>
            <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>Clique em cada Casa para expandir o manifesto, valores e personalidade.</p>
          </div>
        )}

        {/* ── Quiz ── */}
        {activeSection === "quiz" && (
          <div style={{ maxWidth: 600, margin: "0 auto", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, overflow: "hidden", animation: "fadeInUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(46,158,143,0.3), transparent)" }} />
            <Quiz />
          </div>
        )}

        {/* ── Universo Cultural ── */}
        {activeSection === "universo" && <UniversoCultural />}

        {/* ── Arena ── */}
        {activeSection === "arena" && (
          <div style={{ textAlign: "center", padding: "64px 24px", animation: "fadeInUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both" }}>
            <span style={{ fontSize: 56, display: "block", marginBottom: 24 }}>⚔️</span>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 300, marginBottom: 12 }}>Arena das <em style={{ fontWeight: 600 }}>Casas</em></h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 36, maxWidth: 420, margin: "0 auto 36px", lineHeight: 1.7 }}>Acompanhe a competição clínica em tempo real. KPIs de adimplência, sessões, qualidade, comparecimento e evolução clínica — tudo extraído do Hamilton.</p>
            <a href="https://v-rogana.github.io/competicao_casas_allos/" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 36px", borderRadius: 100, border: "1px solid rgba(46,158,143,0.4)", background: "rgba(46,158,143,0.1)", color: "#5EEAD4", fontSize: 15, fontWeight: 500, textDecoration: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.3s" }}>
              Abrir Arena →
            </a>
          </div>
        )}

        {/* Footer */}
        <footer style={{ marginTop: 80, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)", lineHeight: 1.8, animation: "fadeIn 1s 1s both" }}>
          Associação Allos · Casas
          <br />
          <span style={{ color: "rgba(46,158,143,0.5)" }}>Transformando talentos em legado</span>
        </footer>
      </div>
    </div>
  );
}
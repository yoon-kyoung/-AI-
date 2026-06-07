import { useState } from "react";

// ──────────────────────────────────────────
// 색상 팔레트 / 디자인 토큰
// ──────────────────────────────────────────
const C = {
  primary: "#4F46E5",
  accent:  "#06B6D4",
  warm:    "#F59E0B",
  coral:   "#EF4444",
  bg:      "#F8FAFC",
  card:    "#FFFFFF",
  border:  "#E2E8F0",
  muted:   "#94A3B8",
  text:    "#0F172A",
  subtext: "#475569",
};

// ──────────────────────────────────────────
// 진단 설문 데이터
// ──────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    category: "기본 이해",
    question: "AI가 생성한 정보를 그대로 믿는 편인가요?",
    options: [
      { label: "항상 믿는다", score: 1 },
      { label: "대부분 믿는다", score: 2 },
      { label: "반은 반은", score: 3 },
      { label: "교차 검증한다", score: 4 },
    ],
  },
  {
    id: 2,
    category: "활용 경험",
    question: "생성형 AI 도구(ChatGPT, Claude 등)를 얼마나 자주 사용하나요?",
    options: [
      { label: "사용해본 적 없다", score: 1 },
      { label: "가끔 써본다", score: 2 },
      { label: "주 1~2회", score: 3 },
      { label: "매일 사용한다", score: 4 },
    ],
  },
  {
    id: 3,
    category: "직무 연관성",
    question: "현재 직무/학업에서 AI를 활용하고 있나요?",
    options: [
      { label: "전혀 활용 안 한다", score: 1 },
      { label: "아직 모른다", score: 2 },
      { label: "일부 활용 중", score: 3 },
      { label: "핵심 도구로 사용 중", score: 4 },
    ],
  },
  {
    id: 4,
    category: "비판적 사고",
    question: "AI가 생성한 텍스트를 일반 텍스트와 구분할 수 있나요?",
    options: [
      { label: "전혀 모른다", score: 1 },
      { label: "어렵다", score: 2 },
      { label: "어느 정도 된다", score: 3 },
      { label: "잘 구분할 수 있다", score: 4 },
    ],
  },
  {
    id: 5,
    category: "윤리 인식",
    question: "AI 편향(bias)이나 윤리 문제에 대해 알고 있나요?",
    options: [
      { label: "처음 들어본다", score: 1 },
      { label: "들어본 정도", score: 2 },
      { label: "개념은 안다", score: 3 },
      { label: "사례까지 알고 있다", score: 4 },
    ],
  },
  {
    id: 6,
    category: "관심사",
    question: "가장 관심 있는 AI 활용 분야는?",
    options: [
      { label: "콘텐츠·크리에이티브", score: 0, tag: "creative" },
      { label: "데이터·분석", score: 0, tag: "data" },
      { label: "취업·커리어", score: 0, tag: "career" },
      { label: "정책·사회 문제", score: 0, tag: "policy" },
    ],
  },
  {
    id: 7,
    category: "직무",
    question: "현재 직무 또는 전공 계열은?",
    options: [
      { label: "이공계·개발", score: 0, tag: "tech" },
      { label: "인문·사회·예술", score: 0, tag: "humanities" },
      { label: "경영·경제·금융", score: 0, tag: "business" },
      { label: "아직 학생이에요", score: 0, tag: "student" },
    ],
  },
];

// 레벨 계산
function calcLevel(answers) {
  const scoreQ = QUESTIONS.slice(0, 5);
  let total = 0;
  scoreQ.forEach((q) => {
    const ans = answers[q.id];
    if (ans !== undefined) total += ans.score;
  });
  const max = 20;
  const pct = (total / max) * 100;
  if (pct <= 30) return { level: 1, label: "입문", color: "#94A3B8", desc: "AI의 기본 개념부터 차근차근 배워가는 단계예요." };
  if (pct <= 55) return { level: 2, label: "기초", color: C.warm, desc: "AI 개념을 알지만 실전 활용은 아직 미흡한 단계예요." };
  if (pct <= 75) return { level: 3, label: "중급", color: C.accent, desc: "생성형 AI를 활용하고 비판적으로 이해하는 단계예요." };
  return { level: 4, label: "심화", color: C.primary, desc: "AI를 깊이 이해하고 창의적으로 활용하는 단계예요." };
}

// ──────────────────────────────────────────
// 추천 데이터
// ──────────────────────────────────────────
const RECOMMENDATIONS = {
  1: [
    { type: "학습", icon: "📚", title: "AI 첫걸음: 생성형 AI 기초", provider: "K-MOOC", tag: "무료" },
    { type: "학습", icon: "🎥", title: "챗GPT 왕초보 활용법", provider: "유튜브", tag: "무료" },
    { type: "정책", icon: "🏛️", title: "청년 디지털 역량 강화 사업", provider: "고용노동부", tag: "신청 가능" },
  ],
  2: [
    { type: "학습", icon: "💡", title: "AI 프롬프트 엔지니어링 입문", provider: "구름EDU", tag: "무료" },
    { type: "학습", icon: "🔍", title: "AI 리터러시와 팩트체크", provider: "언론진흥재단", tag: "무료" },
    { type: "정책", icon: "🏛️", title: "청년 AI·SW 교육 바우처", provider: "과기부", tag: "신청 가능" },
  ],
  3: [
    { type: "학습", icon: "⚡", title: "업무 자동화: 노션 AI·Copilot", provider: "패스트캠퍼스", tag: "유료" },
    { type: "학습", icon: "📊", title: "AI 데이터 분석 실전", provider: "데이터리안", tag: "유료" },
    { type: "정책", icon: "🏛️", title: "K-디지털 트레이닝 (AI 과정)", provider: "고용노동부", tag: "지원 가능" },
  ],
  4: [
    { type: "학습", icon: "🤖", title: "LLM API 활용 및 앱 개발", provider: "인프런", tag: "유료" },
    { type: "학습", icon: "🌐", title: "AI 윤리와 거버넌스", provider: "KAIST 오픈코스", tag: "무료" },
    { type: "정책", icon: "🏛️", title: "청년 AI 스타트업 창업 지원", provider: "중소벤처부", tag: "신청 가능" },
  ],
};

// ──────────────────────────────────────────
// 공통 컴포넌트
// ──────────────────────────────────────────
function NavBar({ page, setPage }) {
  const items = [
    { id: "home",      label: "홈",    icon: "🏠" },
    { id: "quiz",      label: "진단",  icon: "📝" },
    { id: "result",    label: "결과",  icon: "📈" },
    { id: "recommend", label: "추천",  icon: "✨" },
    { id: "dashboard", label: "통계",  icon: "📊" },
    { id: "mypage",    label: "마이",  icon: "👤" },
  ];
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 480,
      background: "#fff", borderTop: `1px solid ${C.border}`,
      display: "flex", justifyContent: "space-around", padding: "10px 0 14px",
      zIndex: 100,
    }}>
      {items.map((it) => (
        <button key={it.id} onClick={() => setPage(it.id)} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 10, fontWeight: page === it.id ? 700 : 400,
          color: page === it.id ? C.primary : C.muted,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          padding: "2px 6px", transition: "color .15s",
        }}>
          <span style={{ fontSize: 18 }}>{it.icon}</span>
          {it.label}
        </button>
      ))}
    </nav>
  );
}

function Tag({ label, color = C.primary }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "2px 8px",
      borderRadius: 99, border: `1px solid ${color}`,
      color, background: color + "18",
    }}>{label}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: "20px", ...style,
    }}>
      {children}
    </div>
  );
}

// ──────────────────────────────────────────
// 페이지: 홈
// ──────────────────────────────────────────
function HomePage({ setPage }) {
  return (
    <div style={{ padding: "48px 20px 100px" }}>
      {/* 히어로 */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          display: "inline-block", fontSize: 11, fontWeight: 700,
          letterSpacing: 2, color: C.primary, textTransform: "uppercase",
          marginBottom: 14, background: C.primary + "12",
          padding: "4px 12px", borderRadius: 99,
        }}>AI 리부트 경진대회</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.3, color: C.text, margin: "0 0 14px" }}>
          나의 AI 리터러시,<br />
          <span style={{ color: C.primary }}>지금 바로 진단</span>해요
        </h1>
        <p style={{ fontSize: 15, color: C.subtext, lineHeight: 1.7, margin: "0 0 32px" }}>
          간단한 7문항으로 AI 활용 수준을 측정하고<br />
          수준·직무·관심사에 맞는 학습 콘텐츠와<br />
          정부 정책 사업을 자동으로 추천해드려요.
        </p>
        <button onClick={() => setPage("quiz")} style={{
          background: C.primary, color: "#fff", border: "none",
          borderRadius: 14, padding: "16px 48px", fontSize: 16, fontWeight: 700,
          cursor: "pointer", boxShadow: `0 4px 20px ${C.primary}44`,
          transition: "transform .1s, box-shadow .1s",
        }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          진단 시작하기 →
        </button>
      </div>

      {/* 특징 3개 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
        {[
          { icon: "🧠", title: "5분 진단", desc: "7가지 핵심 질문으로 AI 리터러시 수준 측정" },
          { icon: "✨", title: "AI 맞춤 추천", desc: "생성형 AI가 나에게 딱 맞는 콘텐츠 선별" },
          { icon: "🏛️", title: "정책 연결", desc: "신청 가능한 청년 정책 사업 자동 매칭" },
        ].map((f) => (
          <Card key={f.title} style={{ textAlign: "center", padding: "16px 12px" }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{f.desc}</div>
          </Card>
        ))}
      </div>

      {/* 레벨 안내 */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 12 }}>AI 리터러시 4단계</div>
        {[
          { label: "입문", color: "#94A3B8", desc: "AI가 뭔지 막 알아가는 단계" },
          { label: "기초", color: C.warm, desc: "알지만 활용이 어색한 단계" },
          { label: "중급", color: C.accent, desc: "실전 활용 + 비판적 이해" },
          { label: "심화", color: C.primary, desc: "창의적 활용과 윤리 인식" },
        ].map((lv, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: lv.color, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0,
            }}>Lv{i + 1}</div>
            <div>
              <span style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{lv.label}</span>
              <span style={{ fontSize: 12, color: C.muted, marginLeft: 8 }}>{lv.desc}</span>
            </div>
          </div>
        ))}
      </Card>

      {/* 참여 통계 미리보기 */}
      <div style={{
        marginTop: 20, padding: "16px 20px",
        background: `linear-gradient(135deg, ${C.primary}0D, ${C.accent}0D)`,
        border: `1px solid ${C.primary}22`, borderRadius: 16,
        display: "flex", justifyContent: "space-around",
      }}>
        {[
          { value: "4,821", label: "진단 참여" },
          { value: "83%", label: "정책 매칭률" },
          { value: "4.6", label: "만족도" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: C.primary }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// 페이지: 진단 설문
// ──────────────────────────────────────────
function QuizPage({ answers, setAnswers, setPage, setResult }) {
  const [current, setCurrent] = useState(0);
  const q = QUESTIONS[current];
  const progress = ((current + 1) / QUESTIONS.length) * 100;

  function select(opt) {
    const next = { ...answers, [q.id]: opt };
    setAnswers(next);
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      const lv = calcLevel(next);
      setResult({ level: lv, answers: next });
      setPage("result");
    }
  }

  return (
    <div style={{ padding: "48px 20px 100px" }}>
      {/* 진행 바 */}
      <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted }}>
        <span style={{
          background: C.primary + "14", color: C.primary, fontWeight: 700,
          padding: "2px 10px", borderRadius: 99, fontSize: 11,
        }}>{q.category}</span>
        <span>{current + 1} / {QUESTIONS.length}</span>
      </div>
      <div style={{ height: 6, background: C.border, borderRadius: 99, marginBottom: 32 }}>
        <div style={{
          height: "100%", background: `linear-gradient(90deg, ${C.primary}, ${C.accent})`,
          borderRadius: 99, width: `${progress}%`, transition: "width .3s",
        }} />
      </div>

      {/* 질문 */}
      <h2 style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.4, color: C.text, marginBottom: 32 }}>
        Q{current + 1}. {q.question}
      </h2>

      {/* 선택지 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {q.options.map((opt, i) => {
          const selected = answers[q.id]?.label === opt.label;
          return (
            <button key={i} onClick={() => select(opt)} style={{
              background: selected ? C.primary : C.card,
              border: `1.5px solid ${selected ? C.primary : C.border}`,
              borderRadius: 14, padding: "16px 20px", textAlign: "left",
              fontSize: 15, fontWeight: selected ? 700 : 400,
              color: selected ? "#fff" : C.text, cursor: "pointer",
              transition: "all .15s",
              boxShadow: selected ? `0 4px 12px ${C.primary}33` : "none",
            }}>
              <span style={{
                display: "inline-flex", width: 26, height: 26,
                borderRadius: 99, border: `1.5px solid ${selected ? "#fff8" : C.border}`,
                alignItems: "center", justifyContent: "center", fontSize: 12,
                fontWeight: 700, marginRight: 12,
                background: selected ? "#ffffff30" : "transparent",
                color: selected ? "#fff" : C.muted, flexShrink: 0,
              }}>
                {["A", "B", "C", "D"][i]}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* 이전 */}
      {current > 0 && (
        <button onClick={() => setCurrent(current - 1)} style={{
          marginTop: 24, background: "none", border: "none",
          color: C.muted, fontSize: 14, cursor: "pointer",
        }}>← 이전 질문</button>
      )}
    </div>
  );
}

// ──────────────────────────────────────────
// 페이지: 진단 결과
// ──────────────────────────────────────────
function ResultPage({ result, setPage }) {
  if (!result) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
        <p style={{ color: C.muted, marginBottom: 20 }}>진단을 먼저 완료해주세요.</p>
        <button onClick={() => setPage("quiz")} style={{
          background: C.primary, color: "#fff",
          border: "none", borderRadius: 12, padding: "12px 28px",
          fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}>진단 시작하기</button>
      </div>
    );
  }

  const { level } = result;
  const cats = ["기본 이해", "활용 경험", "직무 연관", "비판적 사고", "윤리 인식"];
  const scores = QUESTIONS.slice(0, 5).map((q) => {
    const ans = result.answers[q.id];
    return ans ? (ans.score / 4) * 100 : 0;
  });

  const levelEmojis = ["🌱", "🌿", "⚡", "🚀"];

  return (
    <div style={{ padding: "48px 20px 100px" }}>
      {/* 레벨 카드 */}
      <Card style={{
        textAlign: "center", marginBottom: 20,
        background: level.color + "0E", border: `1.5px solid ${level.color}`,
      }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>
          {levelEmojis[level.level - 1]}
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>나의 AI 리터러시 레벨</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: level.color, marginBottom: 8 }}>
          Lv.{level.level} {level.label}
        </div>
        <div style={{ fontSize: 14, color: C.subtext, lineHeight: 1.6 }}>{level.desc}</div>
      </Card>

      {/* 영역별 점수 바 */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 16 }}>영역별 역량 분석</div>
        {cats.map((cat, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
              <span style={{ color: C.subtext }}>{cat}</span>
              <span style={{ fontWeight: 700, color: level.color }}>{Math.round(scores[i])}%</span>
            </div>
            <div style={{ height: 8, background: C.border, borderRadius: 99 }}>
              <div style={{
                height: "100%", borderRadius: 99,
                background: level.color,
                width: `${scores[i]}%`, transition: "width .6s .1s",
              }} />
            </div>
          </div>
        ))}
      </Card>

      {/* 관심사 & 직무 요약 */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 12 }}>나의 프로필</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {result.answers[6] && (
            <Tag label={`관심: ${result.answers[6].label}`} color={C.accent} />
          )}
          {result.answers[7] && (
            <Tag label={`직무: ${result.answers[7].label}`} color={C.primary} />
          )}
        </div>
      </Card>

      {/* 추천으로 이동 */}
      <button onClick={() => setPage("recommend")} style={{
        width: "100%", background: C.primary, color: "#fff",
        border: "none", borderRadius: 14, padding: "16px",
        fontSize: 16, fontWeight: 700, cursor: "pointer",
        boxShadow: `0 4px 16px ${C.primary}44`, marginBottom: 12,
      }}>맞춤 콘텐츠 추천 받기 →</button>

      <button onClick={() => setPage("quiz")} style={{
        width: "100%", background: "none",
        border: `1px solid ${C.border}`, borderRadius: 14,
        padding: "14px", fontSize: 14, color: C.muted, cursor: "pointer",
      }}>다시 진단하기</button>
    </div>
  );
}

// ──────────────────────────────────────────
// 페이지: 맞춤 추천
// ──────────────────────────────────────────
function RecommendPage({ result, setPage }) {
  const [activeTab, setActiveTab] = useState("all");

  if (!result) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
        <p style={{ color: C.muted, marginBottom: 20 }}>진단을 먼저 완료해주세요.</p>
        <button onClick={() => setPage("quiz")} style={{
          background: C.primary, color: "#fff",
          border: "none", borderRadius: 12, padding: "12px 28px",
          fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}>진단 시작하기</button>
      </div>
    );
  }

  const level = result.level;
  const items = RECOMMENDATIONS[level.level] || [];
  const filtered = activeTab === "all"
    ? items
    : items.filter((it) => it.type === (activeTab === "learn" ? "학습" : "정책"));

  const aiMessages = {
    1: "기초부터 차근차근 쌓으면 누구나 AI를 자유자재로 활용할 수 있어요!",
    2: "이미 개념은 잡혔으니, 이제 실전 활용 경험을 늘려볼 시간이에요.",
    3: "활용 수준이 높아요! 심화 과정으로 전문성을 한 단계 끌어올려 보세요.",
    4: "AI 전문가 수준이에요! 창업·연구·정책 분야로 도전해 보세요.",
  };

  return (
    <div style={{ padding: "48px 20px 100px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>
          {level.label} 레벨 맞춤 추천
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: 0 }}>
          나에게 딱 맞는 추천 🎯
        </h2>
      </div>

      {/* AI 추천 한 줄 멘트 */}
      <Card style={{ background: C.primary + "0D", border: `1px solid ${C.primary}33`, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 22 }}>🤖</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 4 }}>AI 추천 한마디</div>
            <div style={{ fontSize: 14, color: C.subtext, lineHeight: 1.6 }}>
              {aiMessages[level.level]}
            </div>
          </div>
        </div>
      </Card>

      {/* 탭 필터 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["all", "전체"], ["learn", "학습"], ["policy", "정책"]].map(([val, label]) => (
          <button key={val} onClick={() => setActiveTab(val)} style={{
            padding: "6px 18px", borderRadius: 99, fontSize: 13,
            fontWeight: activeTab === val ? 700 : 400,
            background: activeTab === val ? C.primary : "transparent",
            border: `1px solid ${activeTab === val ? C.primary : C.border}`,
            color: activeTab === val ? "#fff" : C.muted, cursor: "pointer",
            transition: "all .15s",
          }}>{label}</button>
        ))}
      </div>

      {/* 추천 카드 목록 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((item, i) => (
          <Card key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: item.type === "학습" ? C.accent + "18" : C.primary + "18",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, flexShrink: 0,
            }}>{item.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 6 }}>
                {item.title}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: C.muted }}>{item.provider}</span>
                <Tag
                  label={item.tag}
                  color={
                    item.tag === "무료" ? "#22C55E"
                    : item.tag === "신청 가능" ? C.primary
                    : item.tag === "지원 가능" ? C.accent
                    : C.warm
                  }
                />
              </div>
            </div>
            <span style={{
              fontSize: 11, color: C.muted, padding: "3px 8px",
              border: `1px solid ${C.border}`, borderRadius: 6, whiteSpace: "nowrap",
            }}>
              {item.type}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// 페이지: 정책 수요 대시보드
// ──────────────────────────────────────────
function DashboardPage() {
  const barData = [
    { label: "입문", pct: 28, color: "#94A3B8" },
    { label: "기초", pct: 35, color: C.warm },
    { label: "중급", pct: 25, color: C.accent },
    { label: "심화", pct: 12, color: C.primary },
  ];
  const interest = [
    { label: "콘텐츠·크리에이티브", pct: 38 },
    { label: "취업·커리어", pct: 29 },
    { label: "데이터·분석", pct: 21 },
    { label: "정책·사회", pct: 12 },
  ];
  const jobData = [
    { label: "학생", pct: 42, color: C.accent },
    { label: "이공계·개발", pct: 28, color: C.primary },
    { label: "경영·경제", pct: 18, color: C.warm },
    { label: "인문·예술", pct: 12, color: "#EC4899" },
  ];

  return (
    <div style={{ padding: "48px 20px 100px" }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6 }}>정책 수요 대시보드</h2>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>진단 데이터 기반 청년 AI 역량 현황</p>

      {/* 요약 수치 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { label: "총 진단 참여", value: "4,821명", icon: "👥" },
          { label: "평균 레벨", value: "기초 (Lv.2)", icon: "📊" },
          { label: "정책 매칭률", value: "83%", icon: "🏛️" },
          { label: "추천 만족도", value: "4.6 / 5", icon: "⭐" },
        ].map((s, i) => (
          <div key={i} style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: "16px",
          }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* 레벨 분포 */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 16 }}>레벨 분포</div>
        {barData.map((b) => (
          <div key={b.label} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
              <span style={{ color: C.subtext }}>{b.label}</span>
              <span style={{ fontWeight: 700, color: b.color }}>{b.pct}%</span>
            </div>
            <div style={{ height: 10, background: C.border, borderRadius: 99 }}>
              <div style={{
                height: "100%", borderRadius: 99,
                background: b.color, width: `${b.pct}%`,
              }} />
            </div>
          </div>
        ))}
      </Card>

      {/* 관심사 분포 */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 16 }}>관심 분야 현황</div>
        {interest.map((it, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0", borderBottom: i < interest.length - 1 ? `1px solid ${C.border}` : "none",
          }}>
            <span style={{ fontSize: 13, color: C.subtext }}>{it.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 80, height: 6, background: C.border, borderRadius: 99 }}>
                <div style={{
                  height: "100%", background: C.primary, borderRadius: 99,
                  width: `${it.pct}%`,
                }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 14, color: C.primary, minWidth: 32, textAlign: "right" }}>{it.pct}%</span>
            </div>
          </div>
        ))}
      </Card>

      {/* 직무 분포 */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 16 }}>직무/전공 분포</div>
        {jobData.map((j, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
              <span style={{ color: C.subtext }}>{j.label}</span>
              <span style={{ fontWeight: 700, color: j.color }}>{j.pct}%</span>
            </div>
            <div style={{ height: 8, background: C.border, borderRadius: 99 }}>
              <div style={{
                height: "100%", borderRadius: 99,
                background: j.color, width: `${j.pct}%`,
              }} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ──────────────────────────────────────────
// 페이지: 마이페이지
// ──────────────────────────────────────────
function MyPage({ result, setPage }) {
  return (
    <div style={{ padding: "48px 20px 100px" }}>
      {/* 프로필 */}
      <div style={{
        display: "flex", gap: 16, alignItems: "center", marginBottom: 28,
        padding: "20px", background: C.card, borderRadius: 16,
        border: `1px solid ${C.border}`,
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 18,
          background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 28, flexShrink: 0,
        }}>👤</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>청년 사용자</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>오늘도 성장 중 🌱</div>
        </div>
      </div>

      {/* 내 레벨 */}
      {result ? (
        <Card style={{ marginBottom: 20, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>현재 AI 리터러시</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: result.level.color, marginBottom: 4 }}>
            {["🌱", "🌿", "⚡", "🚀"][result.level.level - 1]} Lv.{result.level.level} {result.level.label}
          </div>
          <div style={{ fontSize: 13, color: C.subtext, marginBottom: 16 }}>{result.level.desc}</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
            {result.answers[6] && <Tag label={`관심: ${result.answers[6].label}`} color={C.accent} />}
            {result.answers[7] && <Tag label={`직무: ${result.answers[7].label}`} color={C.primary} />}
          </div>
          <button onClick={() => setPage("quiz")} style={{
            background: "none",
            border: `1px solid ${C.border}`, borderRadius: 10,
            padding: "8px 20px", fontSize: 13, color: C.muted, cursor: "pointer",
          }}>다시 진단하기</button>
        </Card>
      ) : (
        <Card style={{ marginBottom: 20, textAlign: "center", padding: "32px 20px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🧠</div>
          <div style={{ fontSize: 14, color: C.subtext, marginBottom: 16, lineHeight: 1.6 }}>
            아직 진단을 완료하지 않았어요<br />
            지금 바로 나의 AI 리터러시를 확인해보세요!
          </div>
          <button onClick={() => setPage("quiz")} style={{
            background: C.primary, color: "#fff", border: "none",
            borderRadius: 12, padding: "12px 28px",
            fontSize: 14, fontWeight: 700, cursor: "pointer",
            boxShadow: `0 4px 12px ${C.primary}44`,
          }}>진단 시작하기</button>
        </Card>
      )}

      {/* 메뉴 목록 */}
      <Card style={{ padding: "4px 20px" }}>
        {[
          { icon: "📋", label: "진단 이력" },
          { icon: "🔖", label: "북마크한 콘텐츠" },
          { icon: "🏛️", label: "관심 정책 사업" },
          { icon: "⚙️", label: "알림 설정" },
        ].map((m, i, arr) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 0",
            borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
            cursor: "pointer",
          }}>
            <span style={{ fontSize: 20 }}>{m.icon}</span>
            <span style={{ fontSize: 15, color: C.text, flex: 1 }}>{m.label}</span>
            <span style={{ color: C.muted, fontSize: 18 }}>›</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ──────────────────────────────────────────
// 루트 앱
// ──────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const pages = {
    home:      <HomePage setPage={setPage} />,
    quiz:      <QuizPage answers={answers} setAnswers={setAnswers} setPage={setPage} setResult={setResult} />,
    result:    <ResultPage result={result} setPage={setPage} />,
    recommend: <RecommendPage result={result} setPage={setPage} />,
    dashboard: <DashboardPage />,
    mypage:    <MyPage result={result} setPage={setPage} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, maxWidth: 480, margin: "0 auto", position: "relative" }}>
      {pages[page]}
      <NavBar page={page} setPage={setPage} />
    </div>
  );
}

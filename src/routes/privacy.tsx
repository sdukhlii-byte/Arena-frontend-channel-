import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { BRAND } from "@/brand.config";
import { LANG } from "@/copy";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy — ${BRAND.displayName}` },
      { name: "description", content: `Privacy Policy & Terms for ${BRAND.displayName}.` },
    ],
  }),
  component: Privacy,
});

/* ── Operator / contact — EDIT THESE before going live ─────────────────────── */
const OPERATOR = BRAND.displayName;                 // legal/brand name shown in policy
const CONTACT_EMAIL = "support@metaplay.app";       // TODO: replace with your real contact
const LAST_UPDATED = "2026-06-05";

type Block = { h: string; p: string[] };
type Doc = { title: string; intro: string; blocks: Block[]; back: string; updated: string };

const DOCS: Record<"en" | "ru" | "es", Doc> = {
  en: {
    title: "Privacy Policy",
    intro:
      `${OPERATOR} is an information & analytics Telegram Mini App for esports, football and crypto. ` +
      `We are NOT a gambling operator: we don't accept bets, hold funds or process payments. ` +
      `This page explains what data we process and why.`,
    blocks: [
      {
        h: "1. What we process",
        p: [
          "• Your Telegram ID — to personalise content, check whether you've joined our channel, and keep your session. We never see your phone number or password.",
          "• Your language and the preferences you choose in onboarding (favourite disciplines/teams) — stored locally on your device.",
          "• Aggregate usage events (e.g. which buttons you tap) — to improve the product.",
        ],
      },
      {
        h: "2. What we do NOT collect",
        p: [
          "• No payment or card data. No bank details. No real-name identity documents.",
          "• No sensitive personal data. No tracking of you across other websites or apps.",
        ],
      },
      {
        h: "3. Third parties",
        p: [
          "• Telegram — the platform this app runs on, under Telegram's own privacy terms.",
          "• Public content feeds (news outlets, CoinGecko, Fear & Greed index) — we read public headlines and market data. These providers do NOT receive any data about you.",
          "• We do not sell or rent your data to anyone.",
        ],
      },
      {
        h: "4. Storage & retention",
        p: [
          "• Preferences live in your device's local storage and are cleared when you clear app data.",
          "• Minimal server-side records (Telegram ID, membership status, aggregate analytics) are kept only as long as needed to run the service.",
        ],
      },
      {
        h: "5. Your rights",
        p: [
          "• Stop at any time by closing the Mini App or blocking the bot — this ends data processing.",
          `• To request access or deletion of your data, contact us at ${CONTACT_EMAIL}.`,
        ],
      },
      {
        h: "6. Age & responsible play",
        p: [
          "• This service is for adults only — 18+, or the legal age in your jurisdiction.",
          "• Content is informational and is NOT financial, investment or betting advice. Outcomes are uncertain; never wager more than you can afford to lose.",
          "• If gambling stops being fun, seek help (e.g. begambleaware.org).",
        ],
      },
      {
        h: "7. Contact",
        p: [`Questions about this policy: ${CONTACT_EMAIL}`],
      },
    ],
    back: "← Back to app",
    updated: "Last updated",
  },
  ru: {
    title: "Политика конфиденциальности",
    intro:
      `${OPERATOR} — информационно-аналитическое Telegram Mini App про киберспорт, футбол и крипто. ` +
      `Мы НЕ являемся букмекером и казино: не принимаем ставки, не храним средства и не проводим платежи. ` +
      `Здесь описано, какие данные мы обрабатываем и зачем.`,
    blocks: [
      {
        h: "1. Какие данные мы обрабатываем",
        p: [
          "• Ваш Telegram ID — для персонализации контента, проверки подписки на канал и сохранения сессии. Мы не видим ваш номер телефона и пароль.",
          "• Язык и выбранные при онбординге предпочтения (дисциплины/команды) — хранятся локально на вашем устройстве.",
          "• Обезличенные события использования (какие кнопки вы нажимаете) — чтобы улучшать продукт.",
        ],
      },
      {
        h: "2. Что мы НЕ собираем",
        p: [
          "• Никаких платёжных и банковских данных. Никаких документов и реального имени.",
          "• Никаких чувствительных персональных данных. Не отслеживаем вас на других сайтах и в приложениях.",
        ],
      },
      {
        h: "3. Третьи стороны",
        p: [
          "• Telegram — платформа, на которой работает приложение, по правилам самого Telegram.",
          "• Публичные ленты контента (новостные источники, CoinGecko, индекс Fear & Greed) — мы читаем публичные заголовки и рыночные данные. Эти провайдеры НЕ получают данные о вас.",
          "• Мы не продаём и не сдаём ваши данные третьим лицам.",
        ],
      },
      {
        h: "4. Хранение и сроки",
        p: [
          "• Предпочтения хранятся в local storage устройства и удаляются при очистке данных приложения.",
          "• Минимальные серверные записи (Telegram ID, статус подписки, обезличенная аналитика) хранятся лишь столько, сколько нужно для работы сервиса.",
        ],
      },
      {
        h: "5. Ваши права",
        p: [
          "• Вы можете остановиться в любой момент — закрыть Mini App или заблокировать бота; обработка данных прекращается.",
          `• Чтобы запросить доступ к данным или их удаление, напишите на ${CONTACT_EMAIL}.`,
        ],
      },
      {
        h: "6. Возраст и ответственная игра",
        p: [
          "• Сервис только для совершеннолетних — 18+ или возраст совершеннолетия в вашей юрисдикции.",
          "• Контент носит информационный характер и НЕ является финансовым, инвестиционным или беттинг-советом. Исходы не гарантированы; не ставьте больше, чем готовы потерять.",
          "• Если игра перестала быть развлечением — обратитесь за помощью (например, begambleaware.org).",
        ],
      },
      {
        h: "7. Контакты",
        p: [`Вопросы по политике: ${CONTACT_EMAIL}`],
      },
    ],
    back: "← Назад в приложение",
    updated: "Обновлено",
  },
  es: {
    title: "Política de Privacidad",
    intro:
      `${OPERATOR} es una Mini App de Telegram de información y análisis sobre esports, fútbol y cripto. ` +
      `NO somos un operador de apuestas: no aceptamos apuestas, no custodiamos fondos ni procesamos pagos. ` +
      `Aquí explicamos qué datos tratamos y por qué.`,
    blocks: [
      {
        h: "1. Qué datos tratamos",
        p: [
          "• Tu ID de Telegram — para personalizar el contenido, comprobar si te has unido al canal y mantener tu sesión. Nunca vemos tu teléfono ni tu contraseña.",
          "• Tu idioma y las preferencias que eliges en el onboarding (disciplinas/equipos) — se guardan localmente en tu dispositivo.",
          "• Eventos de uso agregados (qué botones pulsas) — para mejorar el producto.",
        ],
      },
      {
        h: "2. Qué NO recopilamos",
        p: [
          "• Ningún dato de pago ni bancario. Ningún documento de identidad ni nombre real.",
          "• Ningún dato personal sensible. No te rastreamos en otras webs o apps.",
        ],
      },
      {
        h: "3. Terceros",
        p: [
          "• Telegram — la plataforma donde funciona la app, bajo sus propios términos.",
          "• Feeds públicos de contenido (medios, CoinGecko, índice Fear & Greed) — leemos titulares y datos de mercado públicos. Estos proveedores NO reciben datos sobre ti.",
          "• No vendemos ni alquilamos tus datos.",
        ],
      },
      {
        h: "4. Almacenamiento y conservación",
        p: [
          "• Las preferencias se guardan en el almacenamiento local de tu dispositivo y se borran al limpiar los datos de la app.",
          "• Los registros mínimos en servidor (ID de Telegram, estado de suscripción, analítica agregada) se conservan solo lo necesario para operar el servicio.",
        ],
      },
      {
        h: "5. Tus derechos",
        p: [
          "• Puedes parar cuando quieras — cierra la Mini App o bloquea el bot; el tratamiento de datos finaliza.",
          `• Para solicitar acceso o eliminación de tus datos, escríbenos a ${CONTACT_EMAIL}.`,
        ],
      },
      {
        h: "6. Edad y juego responsable",
        p: [
          "• Servicio solo para adultos — 18+, o la edad legal en tu jurisdicción.",
          "• El contenido es informativo y NO es asesoramiento financiero, de inversión ni de apuestas. Los resultados son inciertos; nunca apuestes más de lo que puedas permitirte perder.",
          "• Si el juego deja de ser diversión, busca ayuda (p. ej. begambleaware.org).",
        ],
      },
      {
        h: "7. Contacto",
        p: [`Dudas sobre esta política: ${CONTACT_EMAIL}`],
      },
    ],
    back: "← Volver a la app",
    updated: "Actualizado",
  },
};

function Privacy() {
  const doc = DOCS[LANG === "ru" || LANG === "es" ? LANG : "en"];
  return (
    <div className="min-h-dvh px-6 py-10 pb-24 max-w-[560px] mx-auto">
      <h1 className="font-display text-2xl" style={{ color: BRAND.theme.accent }}>
        {doc.title}
      </h1>
      <div className="mt-1 text-[11px] font-display tracking-widest" style={{ color: BRAND.theme.muted }}>
        {doc.updated}: {LAST_UPDATED}
      </div>

      <p className="mt-4 text-sm leading-relaxed">{doc.intro}</p>

      <div className="mt-6 space-y-5">
        {doc.blocks.map((b) => (
          <section key={b.h}>
            <h2 className="font-display text-sm tracking-wide" style={{ color: BRAND.theme.accentAlt }}>
              {b.h}
            </h2>
            <div className="mt-2 space-y-1.5">
              {b.p.map((line, i) => (
                <p key={i} className="text-[13px] leading-relaxed" style={{ color: BRAND.theme.muted }}>
                  {line}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center w-full py-3 rounded-xl font-display text-xs tracking-widest"
        style={{
          background: BRAND.theme.accent,
          color: "#001b0e",
          boxShadow: `0 0 18px -4px ${BRAND.theme.accent}`,
        }}
      >
        {doc.back}
      </Link>
    </div>
  );
}

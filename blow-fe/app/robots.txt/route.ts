// app/robots.txt/route.ts
export const dynamic = 'force-static'; // статическая отдача

export async function GET() {
  const lines = [
    // === ЕДИНАЯ ГРУППА ДЛЯ ВСЕХ БОТОВ ===
    'User-agent: *',
    // сначала запреты (чтобы было явно)
    'Disallow: /account/',
    'Disallow: /admin',
    'Disallow: /auth/',
    'Disallow: /search',
    'Disallow: /inbox',
    'Disallow: /matches',
    'Disallow: /settings',
    'Disallow: /account/search/',
    // затем общий доступ к остальному
    'Allow: /',

    '',

    // === Отдельные группы — баны AI-краулеров (без Content-signal) ===
    'User-agent: GPTBot',
    'Disallow: /',
    '',
    'User-agent: ClaudeBot',
    'Disallow: /',
    '',
    'User-agent: Google-Extended',
    'Disallow: /',
    '',
    'User-agent: Applebot-Extended',
    'Disallow: /',
    '',
    'User-agent: meta-externalagent',
    'Disallow: /',
    '',
    'User-agent: Bytespider',
    'Disallow: /',
    '',
    'User-agent: CCBot',
    'Disallow: /',
    '',
    'User-agent: Amazonbot',
    'Disallow: /',

    '',

    // === Яндекс-специфичные Clean-param для дедупликации ===
    'Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content /',
    'Clean-param: gclid&fbclid&yclid /',
    'Clean-param: from&ref /',
    'Clean-param: etext /',    

    '',

    // === Каноника/карта сайта ===
    'Host: blow.ru',
    'Sitemap: https://blow.ru/sitemap.xml',
  ];

  const body = lines.join('\n') + '\n'; // финальный перенос строки — хороший тон

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // кэшируем роботов подольше, но оставляем возможность сброса
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

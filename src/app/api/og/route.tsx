import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';
import { ThemeId } from '@/types';
import {
  THEMES,
  ALLOWED_QUERY_PARAMS,
  INPUT_LIMITS,
  DEFAULTS,
  CACHE_CONTROL,
} from '@/config/constants';
import { validateLicenseKey } from '@/lib/license';
import { sanitizeText } from '@/lib/sanitize';
import { getPretendardFont } from '@/lib/og/font';
import { renderOgTheme, FallbackCard } from '@/lib/og/themes';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { searchParams } = url;

    // Cache-Busting DoS 방어: 허용되지 않은 불필요한 쿼리 파라미터가 유입된 경우 308 영구 리다이렉트로 표준 URL 정규화
    const incomingKeys = Array.from(searchParams.keys());
    const hasExtraneousParams = incomingKeys.some((k) => !ALLOWED_QUERY_PARAMS.has(k));

    if (hasExtraneousParams) {
      const canonicalParams = new URLSearchParams();
      for (const allowedKey of ALLOWED_QUERY_PARAMS) {
        const val = searchParams.get(allowedKey);
        if (val !== null) {
          canonicalParams.set(allowedKey, val);
        }
      }
      const queryString = canonicalParams.toString();
      const canonicalUrl = new URL(
        queryString ? `${url.pathname}?${queryString}` : url.pathname,
        request.url
      );

      return NextResponse.redirect(canonicalUrl, {
        status: 308,
        headers: {
          'Cache-Control': CACHE_CONTROL.REDIRECT,
        },
      });
    }

    // 1. 입력값 정규화 및 DoS / 특수문자 / 멀티바이트 이모지 방어
    const title = sanitizeText(
      searchParams.get('title'),
      INPUT_LIMITS.TITLE_MAX_LENGTH,
      DEFAULTS.TITLE
    );
    const tag = sanitizeText(
      searchParams.get('tag'),
      INPUT_LIMITS.TAG_MAX_LENGTH,
      DEFAULTS.TAG
    );
    const description = sanitizeText(
      searchParams.get('description'),
      INPUT_LIMITS.DESCRIPTION_MAX_LENGTH,
      DEFAULTS.DESCRIPTION
    );
    const requestedTheme = (searchParams.get('theme') || DEFAULTS.THEME)
      .slice(0, INPUT_LIMITS.THEME_MAX_LENGTH)
      .toLowerCase()
      .trim();
    const rawKey = searchParams.get('key') || searchParams.get('licenseKey');
    const userKey = rawKey
      ? rawKey.slice(0, INPUT_LIMITS.LICENSE_KEY_MAX_LENGTH).trim()
      : null;

    // 공식 TinyOG 자체 소셜 카드인 경우 워터마크 없이 프로 렌더링
    const isOfficialSiteCard =
      title.toLowerCase().includes('dynamic social cards with one url') &&
      tag.toUpperCase() === 'DEVELOPER TOOL';

    // Lemon Squeezy 공식 API 검증 (TTL 캐시 + 타임아웃 방어)
    const isPro = isOfficialSiteCard || (await validateLicenseKey(userKey));

    // 요청된 테마 유효성 검사
    const activeTheme: ThemeId = THEMES.some((t) => t.id === requestedTheme)
      ? (requestedTheme as ThemeId)
      : DEFAULTS.THEME;

    // 폰트 바이너리 안전 획득 (Pretendard Bold 모듈 캐시)
    const fontData = await getPretendardFont();

    return new ImageResponse(
      renderOgTheme(activeTheme, { title, tag, description, isPro }),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': CACHE_CONTROL.IMAGE,
        },
        fonts: fontData
          ? [
              {
                name: 'Pretendard',
                data: fontData,
                style: 'normal',
                weight: 700,
              },
            ]
          : undefined,
      }
    );
  } catch (error: unknown) {
    console.error('TinyOG Edge API Generation Error:', error);

    // 예외 발생 시 크롤러/클라이언트에게 500 에러 대신 안전한 Fallback 이미지 반환
    try {
      return new ImageResponse(<FallbackCard />, {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      });
    } catch {
      return new Response('Failed to generate image', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }
}

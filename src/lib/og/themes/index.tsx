import { ReactElement } from 'react';
import { ThemeId } from '@/types';
import { OgThemeProps } from '../types';
import { DarkTheme } from './DarkTheme';
import { MinimalTheme } from './MinimalTheme';
import { GradientTheme } from './GradientTheme';
import { TerminalTheme } from './TerminalTheme';
import { NotionTheme } from './NotionTheme';
import { BentoTheme } from './BentoTheme';
import { CyberpunkTheme } from './CyberpunkTheme';
import { SunsetTheme } from './SunsetTheme';

export * from './DarkTheme';
export * from './MinimalTheme';
export * from './GradientTheme';
export * from './TerminalTheme';
export * from './NotionTheme';
export * from './BentoTheme';
export * from './CyberpunkTheme';
export * from './SunsetTheme';
export * from './FallbackCard';

const THEME_COMPONENTS: Record<ThemeId, (props: OgThemeProps) => ReactElement> = {
  dark: DarkTheme,
  minimal: MinimalTheme,
  gradient: GradientTheme,
  terminal: TerminalTheme,
  notion: NotionTheme,
  bento: BentoTheme,
  cyberpunk: CyberpunkTheme,
  sunset: SunsetTheme,
};

/**
 * Renders the JSX element for a specified OG theme.
 * Defaults to DarkTheme if the specified theme is not recognized.
 */
export function renderOgTheme(theme: ThemeId, props: OgThemeProps): ReactElement {
  const Component = THEME_COMPONENTS[theme] || DarkTheme;
  return <Component {...props} />;
}

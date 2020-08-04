import { HSLColor } from '../color-types';
import { ThemeConfig, Theme, CustomPropertiesLike, ColorScheme } from './types';
interface CustomPropertiesConfig extends ThemeConfig {
    colorScheme: ColorScheme;
}
export declare function buildCustomProperties(themeConfig: CustomPropertiesConfig, newDesignLanguage: boolean, tokens?: Record<string, string>): CustomPropertiesLike;
export declare function buildThemeContext(themeConfig: ThemeConfig, cssCustomProperties?: CustomPropertiesLike): Theme;
export declare function toCssCustomPropertySyntax(camelCase: string): string;
export declare function needsVariant(name: string): boolean;
export declare function setTextColor(name: string, variant?: 'light' | 'dark'): string[];
export declare function setBorderColor(name: string, variant?: 'light' | 'dark'): string[];
export declare function setTheme(color: string | HSLColor, baseName: string, key: string, variant: 'light' | 'dark'): string[][];
export {};
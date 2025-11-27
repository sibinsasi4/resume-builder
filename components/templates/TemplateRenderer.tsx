import { ResumeData, ColorTheme, TemplateType } from '@/lib/types';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import { colorThemes } from '@/lib/constants';

interface TemplateRendererProps {
    templateType: TemplateType;
    data: ResumeData;
    colorThemeId: string;
    fontFamily: string;
}

export default function TemplateRenderer({
    templateType,
    data,
    colorThemeId,
    fontFamily,
}: TemplateRendererProps) {
    const colorTheme = colorThemes.find((theme) => theme.id === colorThemeId) || colorThemes[0];

    const fontClass = {
        sans: 'font-sans',
        serif: 'font-serif',
        mono: 'font-mono',
    }[fontFamily] || 'font-sans';

    switch (templateType) {
        case 'classic':
            return <ClassicTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} />;
        case 'modern':
            return <ModernTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} />;
        case 'creative':
            return <ClassicTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} />;
        case 'minimal':
            return <ClassicTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} />;
        case 'professional':
            return <ModernTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} />;
        default:
            return <ClassicTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} />;
    }
}

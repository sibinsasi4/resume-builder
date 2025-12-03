import { ResumeData, ColorTheme, TemplateType } from '@/lib/types';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import TechTemplate from './TechTemplate';
import AcademicTemplate from './AcademicTemplate';
import DesignerTemplate from './DesignerTemplate';
import SimpleTemplate from './SimpleTemplate';
import CorporateTemplate from './CorporateTemplate';
import ElegantTemplate from './ElegantTemplate';
import BoldTemplate from './BoldTemplate';
import TimelineTemplate from './TimelineTemplate';
import CompactTemplate from './CompactTemplate';
import { colorThemes, fontSizeConfigs } from '@/lib/constants';

interface TemplateRendererProps {
    templateType: TemplateType;
    data: ResumeData;
    colorThemeId: string;
    fontFamily: string;
    fontSize?: string;
}

export default function TemplateRenderer({
    templateType,
    data,
    colorThemeId,
    fontFamily,
    fontSize = 'medium',
}: TemplateRendererProps) {
    const colorTheme = colorThemes.find((theme) => theme.id === colorThemeId) || colorThemes[0];

    const fontClass = {
        sans: 'font-sans',
        serif: 'font-serif',
        mono: 'font-mono',
    }[fontFamily] || 'font-sans';

    const sizeConfig = fontSizeConfigs.find((size) => size.id === fontSize) || fontSizeConfigs[1];
    const sizeClass = sizeConfig.className;

    switch (templateType) {
        case 'classic':
            return <ClassicTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        case 'modern':
            return <ModernTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        case 'creative':
            return <ClassicTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        case 'minimal':
            return <ClassicTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        case 'professional':
            return <ModernTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        case 'executive':
            return <ExecutiveTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        case 'tech':
            return <TechTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        case 'academic':
            return <AcademicTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        case 'designer':
            return <DesignerTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        case 'simple':
            return <SimpleTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        case 'corporate':
            return <CorporateTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        case 'elegant':
            return <ElegantTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        case 'bold':
            return <BoldTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        case 'timeline':
            return <TimelineTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        case 'compact':
            return <CompactTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        default:
            return <ClassicTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
    }
}

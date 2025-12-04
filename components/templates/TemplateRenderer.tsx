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
import PremiumTemplate from './PremiumTemplate';
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

    const TemplateComponent = () => {
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
            case 'premium':
                return <PremiumTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
            default:
                return <ClassicTemplate data={data} colorTheme={colorTheme} fontFamily={fontClass} fontSize={sizeClass} />;
        }
    };

    return (
        <div className="relative group">
            <TemplateComponent />

            {/* A4 Page Break Indicators (Print Hidden) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none print:hidden z-50">
                {/* Page 1 Break (297mm - A4 Height) */}
                <div className="absolute top-[297mm] left-0 w-full border-b-2 border-dashed border-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    <div className="absolute right-0 -top-6 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">
                        End of Page 1 (A4)
                    </div>
                </div>

                {/* Page 1 Safety Line (280mm - Bottom Margin Warning) */}
                <div className="absolute top-[280mm] left-0 w-full border-b border-dotted border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity z-40">
                    <div className="absolute right-0 -top-6 bg-amber-400 text-white text-[10px] px-2 py-0.5 rounded shadow-sm">
                        Recommended Bottom Margin
                    </div>
                </div>

                {/* Page 2 Break (594mm) */}
                <div className="absolute top-[594mm] left-0 w-full border-b-2 border-dashed border-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    <div className="absolute right-0 -top-6 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">
                        End of Page 2 (A4)
                    </div>
                </div>
            </div>
        </div>
    );
}

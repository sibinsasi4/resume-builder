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
import CreativeTemplate from './CreativeTemplate';
import MinimalTemplate from './MinimalTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';
import { colorThemes, fontSizeConfigs } from '@/lib/constants';

interface TemplateRendererProps {
    templateType: TemplateType;
    data: ResumeData;
    colorThemeId: string;
    fontFamily: string;
    fontSize?: string;
    spacing?: 'compact' | 'standard';
    sectionOrder?: string[];
    onReorder?: (newOrder: string[]) => void;
}

export default function TemplateRenderer({
    templateType,
    data,
    colorThemeId,
    fontFamily,
    fontSize = 'medium',
    spacing = 'standard',
    sectionOrder = [],
    onReorder
}: TemplateRendererProps) {
    const colorTheme = colorThemes.find((theme) => theme.id === colorThemeId) || colorThemes[0];

    const fontClass = {
        sans: 'font-sans',
        serif: 'font-serif',
        mono: 'font-mono',
    }[fontFamily] || 'font-sans';

    const sizeConfig = fontSizeConfigs.find((size) => size.id === fontSize) || fontSizeConfigs[1];
    const sizeClass = sizeConfig.className;

    // Smart Fit Logic: Data Optimization
    let renderedData = { ...data };

    if (spacing === 'compact') {
        // 1. Optimize Skills: Prioritize Technical and Soft skills, limit to 2 categories if possible to save usage
        if (renderedData.skills && renderedData.skills.length > 2) {
            const prioritized = renderedData.skills.filter(s =>
                /tech/i.test(s.category) || /soft/i.test(s.category)
            );

            // If we found relevant categories, use them. Otherwise just take top 2.
            // If we found MORE than 2 valid ones, still cap at 2 for space? Maybe 3.
            if (prioritized.length > 0) {
                renderedData.skills = prioritized.slice(0, 3);
            } else {
                renderedData.skills = renderedData.skills.slice(0, 2);
            }
        }
    }

    const commonProps = {
        data: renderedData, // Use the potentially optimized data
        colorTheme,
        fontFamily: fontClass,
        fontSize: sizeClass,
        spacing,
        sectionOrder,
        onReorder
    };

    const TemplateComponent = () => {
        switch (templateType) {
            case 'classic':
                return <ClassicTemplate {...commonProps} />;
            case 'modern':
                return <ModernTemplate {...commonProps} />;
            case 'creative':
                return <CreativeTemplate {...commonProps} />;
            case 'minimal':
                return <MinimalTemplate {...commonProps} />;
            case 'professional':
                return <ProfessionalTemplate {...commonProps} />;
            case 'executive':
                return <ExecutiveTemplate {...commonProps} />;
            case 'tech':
                return <TechTemplate {...commonProps} />;
            case 'academic':
                return <AcademicTemplate {...commonProps} />;
            case 'designer':
                return <DesignerTemplate {...commonProps} />;
            case 'simple':
                return <SimpleTemplate {...commonProps} />;
            case 'corporate':
                return <CorporateTemplate {...commonProps} />;
            case 'elegant':
                return <ElegantTemplate {...commonProps} />;
            case 'bold':
                return <BoldTemplate {...commonProps} />;
            case 'timeline':
                return <TimelineTemplate {...commonProps} />;
            case 'compact':
                return <CompactTemplate {...commonProps} />;
            case 'premium':
                return <PremiumTemplate {...commonProps} />;
            default:
                return <ClassicTemplate {...commonProps} />;
        }
    };



    return (
        <div className={`relative group resume-renderer ${spacing}`}>
            {spacing === 'compact' && (
                <style dangerouslySetInnerHTML={{
                    __html: `
                    /* Screen View Compact Styles */
                    .resume-renderer.compact .mb-8 { margin-bottom: 1rem !important; }
                    .resume-renderer.compact .mb-6 { margin-bottom: 0.75rem !important; }
                    .resume-renderer.compact .mb-4 { margin-bottom: 0.5rem !important; }
                    .resume-renderer.compact .gap-6 { gap: 0.75rem !important; }
                    .resume-renderer.compact .gap-4 { gap: 0.5rem !important; }
                    .resume-renderer.compact .p-8 { padding: 1.5rem !important; }
                    .resume-renderer.compact .p-10 { padding: 2rem !important; }
                    .resume-renderer.compact .p-6 { padding: 1rem !important; }
                    .resume-renderer.compact ul.space-y-1\\.5 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: 0.2rem !important; margin-bottom: 0.2rem !important; }
                    .resume-renderer.compact .space-y-6 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: 1rem !important; margin-bottom: 1rem !important; }
                    .resume-renderer.compact .leading-relaxed { line-height: 1.3 !important; }
                    
                    /* Print Specific - AGGRESSIVE Single Page Enforcement */
                    @media print {
                        @page { margin: 0; size: A4; }
                        
                        html, body {
                            height: 100%;
                            overflow: hidden; 
                        }

                        .resume-renderer.compact {
                            transform-origin: top left; 
                            zoom: 0.95; /* Slight scale down to fit more */
                            width: 105.3% !important; /* Compensate for zoom to fill A4 width */
                            height: 100% !important;
                            overflow: hidden;
                        }

                        /* Drastically reduce vertical whitespace for print */
                        .resume-renderer.compact .mb-8 { margin-bottom: 0.5rem !important; }
                        .resume-renderer.compact .mb-6 { margin-bottom: 0.35rem !important; }
                        .resume-renderer.compact .mb-4 { margin-bottom: 0.25rem !important; }
                        .resume-renderer.compact .p-8, 
                        .resume-renderer.compact .p-10 { padding: 1rem !important; }
                        
                        /* Font sizing */
                        .resume-renderer.compact h1 { font-size: 1.5rem !important; margin-bottom: 0.25rem !important; }
                        .resume-renderer.compact h2 { font-size: 1rem !important; margin-bottom: 0.25rem !important; padding-bottom: 2px !important; }
                        .resume-renderer.compact h3 { font-size: 0.9rem !important; }
                        .resume-renderer.compact p, 
                        .resume-renderer.compact li, 
                        .resume-renderer.compact span, 
                        .resume-renderer.compact div { 
                            font-size: 0.85rem !important; 
                            line-height: 1.2 !important;
                        }

                        /* Reduce gaps in lists and flex containers */
                        .resume-renderer.compact ul.space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.1rem !important; margin-bottom: 0.1rem !important; }
                        .resume-renderer.compact .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem !important; margin-bottom: 0.5rem !important; }
                        .resume-renderer.compact .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.35rem !important; margin-bottom: 0.35rem !important; }
                        
                        /* Ensure background graphics print & no page breaks */
                        * { 
                            -webkit-print-color-adjust: exact !important; 
                            print-color-adjust: exact !important; 
                            break-inside: avoid !important;
                        }
                    }
                `}} />
            )}
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

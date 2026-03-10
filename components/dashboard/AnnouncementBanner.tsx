'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

interface Announcement {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
}

export default function AnnouncementBanner() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        fetch('/api/announcements')
            .then(res => res.json())
            .then(data => {
                if (data.announcements) setAnnouncements(data.announcements);
            })
            .catch(err => console.error('Failed to load announcements', err));
    }, []);

    if (!visible || announcements.length === 0) return null;

    // Show only the latest announcement for now to avoid clutter
    const latest = announcements[0];

    const getStyles = (type: string) => {
        switch (type) {
            case 'warning': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
            case 'success': return 'bg-green-500/10 text-green-700 border-green-500/20';
            case 'error': return 'bg-red-500/10 text-red-700 border-red-500/20';
            default: return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
            default: return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    return (
        <div className={`mt-4 px-4 container mx-auto transform transition-all duration-500 ease-out ${visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 h-0 overflow-hidden'}`}>
            <div className={`rounded-xl border backdrop-blur-md shadow-sm p-4 flex items-center justify-between ${getStyles(latest.type)}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/50 rounded-lg backdrop-blur-sm shadow-sm ring-1 ring-black/5">
                        {getIcon(latest.type)}
                    </div>
                    <span className="font-medium text-sm">{latest.message}</span>
                </div>
                <button
                    onClick={() => setVisible(false)}
                    className="p-1 rounded-full hover:bg-black/5 transition-colors"
                >
                    <X className="w-4 h-4 opacity-60" />
                </button>
            </div>
        </div>
    );
}

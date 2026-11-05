import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  FileCode,
  Shield,
  Tag,
  ArrowRight,
  Sparkles,
  Terminal,
  ExternalLink,
  X,
  Copy,
  Check,
  SlidersHorizontal,
  Volume2,
  Command as CommandIcon,
  HelpCircle,
  Bookmark,
  Code,
  Palette,
  PenTool,
  Lightbulb,
  Briefcase,
  GraduationCap,
  Camera,
  MessageSquare,
  Compass,
  HeartPulse,
  Workflow,
  Layers
} from 'lucide-react';
import { ALL_COMMANDS, CommandContract } from '../data/commands';

interface CommandExplorerProps {
  onSelectCommand: (command: CommandContract) => void;
  language: 'th' | 'en';
  favorites?: string[];
  onToggleFavorite?: (cmd: CommandContract) => void;
}

export interface CategoryTabDef {
  id: string;
  name: string;
  labelEn: string;
  labelTh: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CATEGORY_TABS: CategoryTabDef[] = [
  { id: 'all', name: 'All', labelEn: 'All Commands', labelTh: 'ทั้งหมด', icon: Layers },
  { id: 'prog', name: 'Programming', labelEn: 'Programming', labelTh: 'เขียนโค้ด', icon: Code },
  { id: 'design', name: 'Design & Visual', labelEn: 'Design & Visual', labelTh: 'ดีไซน์และภาพ', icon: Palette },
  { id: 'writing', name: 'Writing & Content', labelEn: 'Writing & Content', labelTh: 'งานเขียนและเนื้อหา', icon: PenTool },
  { id: 'ideas', name: 'Ideas & Creativity', labelEn: 'Ideas & Creativity', labelTh: 'ไอเดียและสร้างสรรค์', icon: Lightbulb },
  { id: 'work', name: 'Work & Productivity', labelEn: 'Work & Productivity', labelTh: 'การทำงานและวางแผน', icon: Briefcase },
  { id: 'study', name: 'Study & Learning', labelEn: 'Study & Learning', labelTh: 'การศึกษาและวิชาการ', icon: GraduationCap },
  { id: 'media', name: 'Photo & Video', labelEn: 'Photo & Video', labelTh: 'ภาพถ่ายและวิดีโอ', icon: Camera },
  { id: 'comm', name: 'Communication & Life', labelEn: 'Communication & Life', labelTh: 'การสื่อสารและชีวิต', icon: MessageSquare },
  { id: 'travel', name: 'Travel & Experience', labelEn: 'Travel & Experience', labelTh: 'ท่องเที่ยวและเดินทาง', icon: Compass },
  { id: 'health', name: 'Health & Wellbeing', labelEn: 'Health & Wellbeing', labelTh: 'สุขภาพและกายภาพ', icon: HeartPulse },
  { id: 'workflow', name: 'Workflow & System', labelEn: 'Workflow & System', labelTh: 'ระบบและเวิร์กโฟลว์', icon: Workflow },
  { id: 'fav', name: '★ Favorites', labelEn: '★ Favorites', labelTh: '★ คำสั่งโปรด', icon: Bookmark },
];

const CATEGORIES = CATEGORY_TABS.map(t => t.name);

type SearchScope = 'all' | 'canonical' | 'alias' | 'thai';

const POPULAR_ALIASES = [
  { label: '/code', canonical: '/generatecode', desc: 'Code Generation' },
  { label: '/docs', canonical: '/documentation', desc: 'Software Docs' },
  { label: '/summary', canonical: '/summarize', desc: 'Summarization' },
  { label: '/ideation', canonical: '/brainstorm', desc: 'Brainstorm' },
  { label: '/plan', canonical: '/planning', desc: 'Strategic Planning' },
  { label: '/todo', canonical: '/checklist', desc: 'Checklists' },
  { label: '/workout', canonical: '/fitness', desc: 'Fitness Info' },
  { label: '/slides', canonical: '/presentation', desc: 'Slide Decks' },
  { label: '/gear', canonical: '/equipment', desc: 'Camera Gear' },
  { label: '/style', canonical: '/visualstyle', desc: 'Visual Style' },
  { label: 'สร้างรูปภาพ', canonical: '/image', desc: 'Image Prompt' },
  { label: 'แก้บั๊ก', canonical: '/debug', desc: 'Debug Code' },
];

export const CommandExplorer: React.FC<CommandExplorerProps> = ({
  onSelectCommand,
  language,
  favorites = [],
  onToggleFavorite
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchScope, setSearchScope] = useState<SearchScope>('all');
  const [activeContract, setActiveContract] = useState<CommandContract | null>(null);
  const [copiedContract, setCopiedContract] = useState(false);
  const [copiedCanonicalId, setCopiedCanonicalId] = useState<number | null>(null);
  const [copiedToastText, setCopiedToastText] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Keyboard shortcut '/' to instantly focus the search filter bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCommands = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();

    return ALL_COMMANDS.filter((cmd) => {
      const isFav = favorites.includes(cmd.canonical);
      const matchesCategory =
        selectedCategory === 'All'
          ? true
          : selectedCategory === '★ Favorites'
          ? isFav
          : cmd.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      if (searchScope === 'canonical') {
        return cmd.canonical.toLowerCase().includes(q);
      }

      if (searchScope === 'alias') {
        return cmd.aliases.some(a => a.toLowerCase().includes(q));
      }

      if (searchScope === 'thai') {
        return (
          cmd.titleTh.toLowerCase().includes(q) ||
          cmd.purposeTh.toLowerCase().includes(q) ||
          cmd.thaiTriggers.some(t => t.toLowerCase().includes(q))
        );
      }

      // Default 'all' scope
      return (
        cmd.canonical.toLowerCase().includes(q) ||
        cmd.titleEn.toLowerCase().includes(q) ||
        cmd.titleTh.toLowerCase().includes(q) ||
        cmd.purpose.toLowerCase().includes(q) ||
        cmd.purposeTh.toLowerCase().includes(q) ||
        cmd.aliases.some(a => a.toLowerCase().includes(q)) ||
        cmd.thaiTriggers.some(t => t.toLowerCase().includes(q))
      );
    });
  }, [searchTerm, selectedCategory, searchScope, favorites]);

  // Reset or adjust selectedIndex when filtered results change
  useEffect(() => {
    if (filteredCommands.length === 0) {
      setSelectedIndex(null);
    } else if (selectedIndex !== null && selectedIndex >= filteredCommands.length) {
      setSelectedIndex(filteredCommands.length - 1);
    }
  }, [filteredCommands.length, selectedIndex]);

  // Scroll selected card into view smoothly
  useEffect(() => {
    if (selectedIndex !== null && cardRefs.current[selectedIndex]) {
      cardRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  // Keyboard navigation handler for arrow keys and enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredCommands.length === 0) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        if (prev === null || prev < 0) return 0;
        return Math.min(prev + 1, filteredCommands.length - 1);
      });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        if (prev === null || prev <= 0) return 0;
        return Math.max(prev - 1, 0);
      });
    } else if (e.key === 'Enter') {
      const targetCmd = selectedIndex !== null ? filteredCommands[selectedIndex] : filteredCommands[0];
      if (targetCmd) {
        e.preventDefault();
        onSelectCommand(targetCmd);
      }
    } else if (e.key === 'Escape') {
      setSelectedIndex(null);
      searchInputRef.current?.focus();
    }
  };

  const handleCopyContractJson = () => {
    if (!activeContract) return;
    navigator.clipboard.writeText(JSON.stringify(activeContract, null, 2));
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const handleCopyCanonical = (e: React.MouseEvent, cmd: CommandContract) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmd.canonical);
    setCopiedCanonicalId(cmd.id);
    setCopiedToastText(`Copied ${cmd.canonical} to clipboard!`);
    setTimeout(() => {
      setCopiedCanonicalId((curr) => (curr === cmd.id ? null : curr));
      setCopiedToastText(null);
    }, 2200);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedIndex(null);
    searchInputRef.current?.focus();
  };

  const cleanQuery = searchTerm.toLowerCase().trim();

  return (
    <div
      className="command-explorer-container space-y-6"
      role="region"
      aria-label="Command Explorer and Search Engine"
      onKeyDown={handleKeyDown}
    >
      {/* Search & Accessibility Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-md">
        {/* Header with Title and Accessibility Live Region */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>
                {language === 'th'
                  ? 'สารบบ 99 คำสั่งมาตรฐานและตัวกรองค้นหาแบบเรียลไทม์'
                  : '99 Canonical Commands & Real-Time Filter Bar'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'th'
                ? 'ใช้ปุ่มลูกศร (↑ ↓ ← →) เพื่อเลือกคำสั่ง และกด Enter เพื่อรันคำสั่งใน Studio ทันที'
                : 'Navigate filtered commands with arrow keys (↑ ↓ ← →) and press Enter to select and run in Studio.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono" aria-live="polite">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              {filteredCommands.length} / {ALL_COMMANDS.length} Commands
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              <kbd className="font-semibold text-cyan-300 bg-slate-900 px-1 rounded border border-slate-600">↑↓</kbd>
              <span>to navigate</span>
              <kbd className="font-semibold text-cyan-300 bg-slate-900 px-1 rounded border border-slate-600 ml-1">Enter ↵</kbd>
              <span>to run</span>
            </span>
          </div>
        </div>

        {/* Real-time Filter Bar Container */}
        <div className="bg-slate-950/90 rounded-xl p-2.5 border border-slate-800 space-y-3">
          {/* Main Input Row */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 pointer-events-none" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              role="combobox"
              aria-expanded={filteredCommands.length > 0}
              aria-autocomplete="list"
              aria-activedescendant={
                selectedIndex !== null && filteredCommands[selectedIndex]
                  ? `command-item-${filteredCommands[selectedIndex].id}`
                  : undefined
              }
              aria-controls="command-listbox"
              aria-label={
                language === 'th'
                  ? 'ค้นหาคำสั่งมาตรฐานหรือ Alias ใช้ปุ่มลูกศรเพื่อเลือก และกด Enter เพื่อรัน'
                  : 'Search canonical command or alias, use arrow keys to navigate and Enter to run'
              }
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder={
                language === 'th'
                  ? 'ค้นหาตามชื่อมาตรฐาน (เช่น /image, /brainstorm) หรือ Alias (กดลูกศร ↑↓ แล้วกด Enter)...'
                  : 'Search canonical or alias (use arrow keys ↑↓ to select, Enter to run)...'
              }
              className="w-full bg-transparent border-0 rounded-lg pl-10 pr-24 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono"
            />

            {/* Clear Button & Match indicator */}
            <div className="absolute right-2.5 flex items-center gap-1.5">
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  aria-label="Clear search input"
                  className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="text-[11px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                {filteredCommands.length} matches
              </span>
            </div>
          </div>

          {/* Scope Filters and Options */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-850 text-xs">
            {/* Scope Radios / Buttons */}
            <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Search Scope">
              <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
                Scope:
              </span>
              {[
                { id: 'all' as SearchScope, labelEn: 'All Fields', labelTh: 'ทั้งหมด' },
                { id: 'canonical' as SearchScope, labelEn: 'Canonical (/name)', labelTh: 'ชื่อมาตรฐาน' },
                { id: 'alias' as SearchScope, labelEn: 'Aliases (/alias)', labelTh: 'ชื่อรอง (Alias)' },
                { id: 'thai' as SearchScope, labelEn: 'Thai Triggers', labelTh: 'คำสั่งไทย' },
              ].map((scope) => (
                <button
                  key={scope.id}
                  onClick={() => setSearchScope(scope.id)}
                  role="radio"
                  aria-checked={searchScope === scope.id}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                    searchScope === scope.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {language === 'th' ? scope.labelTh : scope.labelEn}
                </button>
              ))}
            </div>

            {/* Active search query feedback */}
            {searchTerm && (
              <span className="text-[11px] text-slate-400 font-mono">
                Filtering by: <span className="text-cyan-300 font-bold">"{searchTerm}"</span> in <span className="text-cyan-400 font-semibold">{searchScope}</span>
              </span>
            )}
          </div>
        </div>

        {/* Popular Alias Quick-Filter Chips */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <span className="text-slate-500 font-mono shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3 text-cyan-400" />
            Quick Aliases:
          </span>
          {POPULAR_ALIASES.map((pa) => {
            const isCurrent = searchTerm.toLowerCase() === pa.label.toLowerCase();
            return (
              <button
                key={pa.label}
                onClick={() => {
                  setSearchTerm(pa.label);
                  setSearchScope('all');
                }}
                className={`px-2 py-0.5 rounded-md font-mono shrink-0 transition-colors cursor-pointer border ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-cyan-300 hover:bg-slate-850 border-slate-800'
                }`}
                title={`Alias for ${pa.canonical} (${pa.desc})`}
              >
                {pa.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dedicated Major Categories Horizontal Tab Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-lg backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 pb-2.5 mb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span>{language === 'th' ? 'แท็บหมวดหมู่คำสั่งหลัก' : 'Major Category Tabs'}</span>
              <span className="text-[10px] text-cyan-400 font-normal lowercase">({CATEGORY_TABS.length} categories)</span>
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span>
              {language === 'th' ? 'กำลังแสดง:' : 'Active Category:'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-bold">
              {selectedCategory}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-semibold">
              {filteredCommands.length} {filteredCommands.length === 1 ? 'command' : 'commands'}
            </span>
          </div>
        </div>

        {/* Scrollable Horizontal Tab List */}
        <div
          role="tablist"
          aria-label="Filter commands by major categories"
          className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
        >
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedCategory === tab.name;
            const count =
              tab.name === 'All'
                ? ALL_COMMANDS.length
                : tab.name === '★ Favorites'
                ? favorites.length
                : ALL_COMMANDS.filter((c) => c.category === tab.name).length;

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedCategory(tab.name);
                  setSelectedIndex(0);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer border select-none shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500/15 text-cyan-200 border-cyan-500/40 shadow-sm font-semibold'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border-slate-800'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isSelected ? 'text-cyan-400' : 'text-slate-500'
                  }`}
                />
                <span>{language === 'th' ? tab.labelTh : tab.labelEn}</span>
                <span
                  className={`text-[10px] font-mono transition-colors ${
                    isSelected ? 'text-cyan-400 font-bold' : 'text-slate-500'
                  }`}
                >
                  · {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Zero Results State */}
      {filteredCommands.length === 0 && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center">
          <HelpCircle className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-60" />
          <h3 className="text-sm font-bold text-white mb-1">
            {language === 'th' ? 'ไม่พบคำสั่งที่ตรงกับเงื่อนไขการค้นหา' : 'No Commands Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
            {language === 'th'
              ? `ไม่พบคำสั่งที่ตรงกับ "${searchTerm}" ในขอบเขต ${searchScope}. ลองเปลี่ยนคำค้นหา หรือเลือก Scope เป็น "ทั้งหมด"`
              : `No commands matched "${searchTerm}" under ${searchScope} scope. Try resetting the filter or switching scope to All Fields.`}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSearchScope('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            {language === 'th' ? 'ล้างตัวกรองทั้งหมด' : 'Reset All Filters'}
          </button>
        </div>
      )}

      {/* Commands Grid */}
      <div
        id="command-listbox"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5"
        role="listbox"
        aria-label="Filtered canonical commands"
      >
        {filteredCommands.map((cmd, idx) => {
          // Check if search matched canonical, alias, or trigger for highlighted badges
          const isCanonicalMatch = cleanQuery && cmd.canonical.toLowerCase().includes(cleanQuery);
          const matchedAlias = cleanQuery && cmd.aliases.find(a => a.toLowerCase().includes(cleanQuery));
          const matchedTrigger = cleanQuery && cmd.thaiTriggers.find(t => t.toLowerCase().includes(cleanQuery));
          const isKeyboardSelected = selectedIndex === idx;

          return (
            <div
              key={cmd.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              id={`command-item-${cmd.id}`}
              role="option"
              aria-selected={isKeyboardSelected}
              tabIndex={0}
              onClick={() => setSelectedIndex(idx)}
              onFocus={() => setSelectedIndex(idx)}
              className={`relative border rounded-xl p-4 transition-all flex flex-col justify-between group cursor-pointer focus:outline-none ${
                isKeyboardSelected
                  ? 'command-card-active border-cyan-400 ring-1 ring-cyan-400/50 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900/90 shadow-[0_0_24px_rgba(6,182,212,0.18)] translate-y-[-1px] z-10'
                  : isCanonicalMatch || matchedAlias || matchedTrigger
                  ? 'border-cyan-500/40 bg-slate-900/80 shadow-md shadow-cyan-950/20'
                  : 'bg-[#080d1a]/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              <div>
                {/* Card Top: ID & Category & Favorite Star */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <span
                      className={`font-semibold ${
                        isKeyboardSelected ? 'text-cyan-300 font-bold' : 'text-cyan-400'
                      }`}
                    >
                      #{String(cmd.id).padStart(2, '0')}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span
                      className={`truncate max-w-[140px] font-medium ${
                        isKeyboardSelected ? 'text-slate-200' : 'text-slate-400'
                      }`}
                    >
                      {cmd.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isKeyboardSelected && (
                      <span className="text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        ACTIVE · ↵
                      </span>
                    )}
                    {onToggleFavorite && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(cmd);
                        }}
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                          favorites.includes(cmd.canonical)
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-slate-600 hover:text-slate-400'
                        }`}
                        title={favorites.includes(cmd.canonical) ? 'Remove from favorites' : 'Add to favorites'}
                        aria-label={`Favorite ${cmd.canonical}`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${favorites.includes(cmd.canonical) ? 'fill-current' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Canonical */}
                <div className="mb-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <h3
                        className={`font-mono transition-colors ${
                          isKeyboardSelected
                            ? 'text-white text-lg font-extrabold tracking-wide drop-shadow-sm'
                            : isCanonicalMatch
                            ? 'text-cyan-300 text-base font-bold ring-1 ring-cyan-400/40 px-1 rounded bg-cyan-950/40'
                            : 'text-white text-base font-bold group-hover:text-cyan-300'
                        }`}
                      >
                        {cmd.canonical}
                      </h3>
                      <span
                        className={`text-xs font-medium truncate ${
                          isKeyboardSelected ? 'text-cyan-300 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        {language === 'th' ? cmd.titleTh : cmd.titleEn}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleCopyCanonical(e, cmd)}
                      className={`p-1 rounded-md transition-colors cursor-pointer shrink-0 ${
                        copiedCanonicalId === cmd.id
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'text-slate-500 hover:text-cyan-300 hover:bg-slate-800'
                      }`}
                      title={`Copy ${cmd.canonical}`}
                      aria-label={`Copy canonical command ${cmd.canonical}`}
                    >
                      {copiedCanonicalId === cmd.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Purpose */}
                <p
                  className={`text-xs line-clamp-2 leading-relaxed mb-3 ${
                    isKeyboardSelected ? 'text-slate-100 font-medium' : 'text-slate-300'
                  }`}
                >
                  {language === 'th' ? cmd.purposeTh : cmd.purpose}
                </p>

                {/* Aliases & Thai triggers */}
                <div className="space-y-1.5 text-[11px] mb-4">
                  {cmd.aliases.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-500 font-mono">Alias:</span>
                      {cmd.aliases.map((al, alIdx) => {
                        const isHit = cleanQuery && al.toLowerCase().includes(cleanQuery);
                        return (
                          <span
                            key={alIdx}
                            className={`px-1.5 py-0.5 rounded font-mono border ${
                              isHit
                                ? 'bg-cyan-500/20 text-cyan-300 font-bold border-cyan-400 ring-1 ring-cyan-400/50'
                                : 'bg-slate-800/80 text-cyan-300/80 border-slate-700/60'
                            }`}
                          >
                            {al}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {cmd.thaiTriggers.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-500 font-mono">Thai:</span>
                      {cmd.thaiTriggers.slice(0, 3).map((tr, trIdx) => {
                        const isHit = cleanQuery && tr.toLowerCase().includes(cleanQuery);
                        return (
                          <span
                            key={trIdx}
                            className={`px-1.5 py-0.5 rounded border ${
                              isHit
                                ? 'bg-emerald-500/20 text-emerald-200 font-bold border-emerald-400'
                                : 'bg-slate-800/60 text-slate-300 border border-slate-700/40'
                            }`}
                          >
                            {tr}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveContract(cmd);
                    }}
                    aria-haspopup="dialog"
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-800/80"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>{language === 'th' ? 'ดูสัญญาคำสั่ง' : 'View Contract'}</span>
                  </button>

                  {/* Copy Canonical Button */}
                  <button
                    onClick={(e) => handleCopyCanonical(e, cmd)}
                    title={`Copy ${cmd.canonical} to clipboard`}
                    aria-label={`Copy canonical command ${cmd.canonical}`}
                    className={`text-xs font-mono font-medium px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                      copiedCanonicalId === cmd.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 ring-1 ring-emerald-400/40 shadow-sm'
                        : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-cyan-300 border-slate-700/80'
                    }`}
                  >
                    {copiedCanonicalId === cmd.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-bold text-emerald-300">
                          {language === 'th' ? 'คัดลอกแล้ว!' : 'Copied!'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{language === 'th' ? 'คัดลอก' : 'Copy Canonical'}</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCommand(cmd);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isKeyboardSelected
                      ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold shadow-lg shadow-cyan-400/50 scale-[1.03] ring-1 ring-white/60'
                      : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200'
                  }`}
                >
                  <span>{isKeyboardSelected ? (language === 'th' ? 'กด Enter เพื่อใช้' : 'Press Enter to Run') : (language === 'th' ? 'ใช้ใน Studio' : 'Run in Studio')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Command Contract Modal */}
      {activeContract && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contract-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
        >
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    CONTRACT #{activeContract.id}
                  </span>
                  <h3 id="contract-modal-title" className="text-lg font-bold text-white font-mono">
                    {activeContract.canonical}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {activeContract.titleEn} • {activeContract.titleTh}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyContractJson}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Copy Contract JSON"
                  aria-label="Copy contract json"
                >
                  {copiedContract ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setActiveContract(null)}
                  aria-label="Close contract modal"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Command Contract Schema Fields */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-mono text-cyan-400 font-semibold block mb-1">
                  1. PURPOSE / วัตถุประสงค์
                </span>
                <p className="text-slate-300 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  {activeContract.purpose}
                  <br />
                  <span className="text-slate-400">{activeContract.purposeTh}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="font-mono text-cyan-400 font-semibold block mb-1">
                    2. MANDATORY INPUTS
                  </span>
                  <ul className="list-disc list-inside bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                    {activeContract.inputs.map((inp, idx) => (
                      <li key={idx}>{inp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-mono text-cyan-400 font-semibold block mb-1">
                    3. OPTIONAL INPUTS
                  </span>
                  <ul className="list-disc list-inside bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-slate-400 space-y-1">
                    {activeContract.optionalInputs.map((opt, idx) => (
                      <li key={idx}>{opt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <span className="font-mono text-cyan-400 font-semibold block mb-1">
                  4. PROCESS / กระบวนการดำเนินการ
                </span>
                <ol className="list-decimal list-inside bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                  {activeContract.process.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div>
                <span className="font-mono text-cyan-400 font-semibold block mb-1">
                  5. OUTPUT SCHEMA
                </span>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-cyan-200 font-mono">
                  {activeContract.outputSchema}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="font-mono text-cyan-400 font-semibold block mb-1">
                    6. QA RULES
                  </span>
                  <ul className="list-disc list-inside bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                    {activeContract.qaRules.map((qa, idx) => (
                      <li key={idx}>{qa}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-mono text-cyan-400 font-semibold block mb-1">
                    7. SAFETY & ETHICS RULES
                  </span>
                  <ul className="list-disc list-inside bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-rose-300/90 space-y-1">
                    {activeContract.safetyRules.map((sec, idx) => (
                      <li key={idx}>{sec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 mt-6 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Version: 6.1 • Backward Compatible
              </span>
              <button
                onClick={() => {
                  onSelectCommand(activeContract);
                  setActiveContract(null);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Run {activeContract.canonical} in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Floating Copied Toast Message */}
      {copiedToastText && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900/95 border border-emerald-400 text-emerald-100 font-mono text-xs shadow-2xl shadow-emerald-950/80 backdrop-blur-md flex items-center gap-3 animate-fadeIn"
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="font-bold text-white text-xs">
              {language === 'th' ? 'คัดลอกคำสั่งสำเร็จ!' : 'Copied to Clipboard!'}
            </p>
            <p className="text-[11px] text-emerald-300 font-mono mt-0.5">
              {copiedToastText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export interface ColorToken {
  name: string;
  role: string;
  hex: string;
  usage: string;
  contrastOnDark: string;
}

export interface TypographyToken {
  name: string;
  size: string;
  lineHeight: string;
  weight: string;
  usage: string;
}

export interface SpacingToken {
  name: string;
  value: string;
  pixelValue: string;
  usage: string;
}

export interface ComponentContract {
  componentId: string;
  name: string;
  nameTh: string;
  purpose: string;
  anatomy: string[];
  variants: string[];
  properties: string[];
  supportedStates: string[];
  responsiveRules: string[];
  accessibilityRules: string[];
  acceptanceCriteria: string[];
}

export const DESIGN_TOKENS = {
  colors: [
    { name: 'color.primary.cyan-400', role: 'Primary Accent & High-Contrast Highlight', hex: '#22d3ee', usage: 'Focus rings, active states, key CTAs', contrastOnDark: '12.4:1 (AAA)' },
    { name: 'color.primary.cyan-500', role: 'Primary Brand Fill', hex: '#06b6d4', usage: 'Buttons, badges, highlights', contrastOnDark: '9.8:1 (AAA)' },
    { name: 'color.surface.slate-950', role: 'Base Background (Dark Canvas)', hex: '#070b14', usage: 'App background canvas', contrastOnDark: '1:1' },
    { name: 'color.surface.slate-900', role: 'Card & Modal Surface', hex: '#0f172a', usage: 'Containers, panels, dialogs', contrastOnDark: '1.2:1' },
    { name: 'color.surface.slate-850', role: 'Elevated Surface', hex: '#1e293b', usage: 'Input fields, toolbars, chips', contrastOnDark: '1.6:1' },
    { name: 'color.border.slate-800', role: 'Subtle Structural Border', hex: '#334155', usage: 'Card outlines, dividers', contrastOnDark: '3.1:1' },
    { name: 'color.text.slate-100', role: 'Primary Body Text', hex: '#f1f5f9', usage: 'Headings, active copy', contrastOnDark: '16.2:1 (AAA)' },
    { name: 'color.text.slate-400', role: 'Secondary Muted Text', hex: '#94a3b8', usage: 'Captions, helper text, tags', contrastOnDark: '7.1:1 (AAA)' },
    { name: 'color.status.emerald-400', role: 'Success & Validated Gate', hex: '#34d399', usage: 'Passing QA, delivered states', contrastOnDark: '10.5:1 (AAA)' },
    { name: 'color.status.amber-400', role: 'Warning & High-Stakes Health Alert', hex: '#fbbf24', usage: 'Disclaimers, cautions', contrastOnDark: '11.8:1 (AAA)' },
    { name: 'color.status.rose-400', role: 'Critical & P0/P1 Defect Alert', hex: '#fb7185', usage: 'Destructive actions, error badges', contrastOnDark: '9.2:1 (AAA)' }
  ] as ColorToken[],

  typography: [
    { name: 'type.heading.2xl', size: '24px (1.5rem)', lineHeight: '32px', weight: '700 (Bold)', usage: 'Major view headers, dashboard titles' },
    { name: 'type.heading.xl', size: '20px (1.25rem)', lineHeight: '28px', weight: '700 (Bold)', usage: 'Card titles, modal headings' },
    { name: 'type.heading.lg', size: '18px (1.125rem)', lineHeight: '24px', weight: '600 (Semibold)', usage: 'Section titles, command canonicals' },
    { name: 'type.body.base', size: '14px (0.875rem)', lineHeight: '20px', weight: '400 / 500', usage: 'Body copy, descriptions, form inputs' },
    { name: 'type.body.sm', size: '12px (0.75rem)', lineHeight: '16px', weight: '500 (Medium)', usage: 'Buttons, metadata, table cells' },
    { name: 'type.caption.xs', size: '11px (0.6875rem)', lineHeight: '14px', weight: '600 / 700', usage: 'Badges, status chips, micro-labels' },
    { name: 'type.mono.code', size: '12px (0.75rem)', lineHeight: '18px', weight: '500 (Fira Code)', usage: 'Commands, JSON schemas, tokens' }
  ] as TypographyToken[],

  spacing: [
    { name: 'space.1', value: '0.25rem', pixelValue: '4px', usage: 'Micro gaps, badge padding' },
    { name: 'space.2', value: '0.5rem', pixelValue: '8px', usage: 'Tight button padding, icon gaps' },
    { name: 'space.3', value: '0.75rem', pixelValue: '12px', usage: 'Standard input padding, row gaps' },
    { name: 'space.4', value: '1rem', pixelValue: '16px', usage: 'Card internal padding, standard spacing' },
    { name: 'space.6', value: '1.5rem', pixelValue: '24px', usage: 'Grid spacing, modal padding' },
    { name: 'space.8', value: '2rem', pixelValue: '32px', usage: 'Section separation, layout margins' }
  ] as SpacingToken[]
};

export const COMPONENT_CONTRACTS: ComponentContract[] = [
  {
    componentId: 'CMP-01',
    name: 'Interactive Action Button',
    nameTh: 'ปุ่มกดคำสั่งโต้ตอบ (Button)',
    purpose: 'Trigger consequential actions, mode changes, and workflow submissions with explicit feedback.',
    anatomy: ['Container <button>', 'Icon (Optional Left/Right)', 'Label text', 'Badge / Count pill (Optional)', 'Focus ring aura'],
    variants: ['Primary (Cyan Gradient)', 'Secondary (Slate Outline)', 'Ghost (Transparent Hover)', 'Destructive (Rose Accent)'],
    properties: ['variant', 'size (sm, md, lg)', 'disabled', 'isLoading', 'icon', 'fullWidth'],
    supportedStates: ['Default', 'Hover', 'Focus', 'Pressed', 'Disabled', 'Loading', 'Success', 'Error', 'Empty', 'Selected'],
    responsiveRules: ['Minimum 44x44px touch target on mobile viewports (<640px)', 'Full-width on mobile dialog footers'],
    accessibilityRules: ['role="button"', 'aria-busy="true" during Loading state', 'Keyboard Enter & Space activation', 'Visible high-contrast focus ring (2px cyan)'],
    acceptanceCriteria: ['Passes WCAG 2.2 AA contrast (>=4.5:1)', 'Never fires onClick when disabled or loading', 'Smooth 150ms hover transition']
  },
  {
    componentId: 'CMP-02',
    name: 'Form Text Input & Textarea',
    nameTh: 'ช่องรับข้อความและคำสั่ง (Input / Textarea)',
    purpose: 'Accept structured natural language queries, canonical slash commands, and parameters.',
    anatomy: ['Field wrapper', 'Label with optional requirement asterisk', 'Leading icon / slash indicator', '<input> or <textarea>', 'Clear button', 'Helper / error caption'],
    variants: ['Single-line input', 'Multi-line terminal textarea', 'Search box with scope selector'],
    properties: ['value', 'placeholder', 'error', 'disabled', 'autoFocus', 'rows'],
    supportedStates: ['Default', 'Hover', 'Focus', 'Pressed', 'Disabled', 'Loading', 'Success', 'Error', 'Empty', 'Selected'],
    responsiveRules: ['Font size >=16px on mobile to prevent iOS auto-zoom', 'Fluid width matching parent container'],
    accessibilityRules: ['Explicit <label htmlFor="..."> binding', 'aria-invalid="true" on Error state', 'aria-describedby for error feedback message'],
    acceptanceCriteria: ['Focus ring highlights cyan with 0px lag', 'Error state displays descriptive message in rose text', 'Clear button resets value']
  },
  {
    componentId: 'CMP-03',
    name: 'Status Card & Command Tile',
    nameTh: 'การ์ดสถานะและคำสั่ง (Command Tile)',
    purpose: 'Display canonical command details, category, alias triggers, and active keyboard navigation states.',
    anatomy: ['Card container', 'Header (ID, Category, Favorite bookmark)', 'Title & Canonical name', 'Purpose summary', 'Alias & Thai tags', 'Action footer'],
    variants: ['Standard Command Card', 'Highlighted Active Card', 'Compact List Tile'],
    properties: ['command', 'isKeyboardActive', 'isFavorite', 'onSelect', 'onViewContract'],
    supportedStates: ['Default', 'Hover', 'Focus', 'Pressed', 'Disabled', 'Loading', 'Success', 'Error', 'Empty', 'Selected'],
    responsiveRules: ['1 column on mobile (<768px), 2 columns on tablet (<1024px), 3 columns on desktop (>=1024px)'],
    accessibilityRules: ['role="option"', 'aria-selected matches active state', 'Keyboard Arrow Navigation with auto-scroll into view'],
    acceptanceCriteria: ['Active state features prominent 2px cyan border, left vertical accent stripe, and glowing aura', 'One-click copy button with toast feedback']
  },
  {
    componentId: 'CMP-04',
    name: 'Modal Dialog & Spec Inspector',
    nameTh: 'หน้าต่างกล่องโต้ตอบ (Modal Dialog)',
    purpose: 'Present deep-dive command contracts, QA scorecards, master prompts, and system info over an accessible backdrop.',
    anatomy: ['Backdrop overlay', 'Dialog container', 'Header with title & close button', 'Scrollable body', 'Sticky footer with primary & secondary CTAs'],
    variants: ['Command Contract Dialog', 'Master Prompt Inspector', 'QA Gate Inspector', 'System Spec Modal'],
    properties: ['isOpen', 'onClose', 'title', 'children', 'maxWidth'],
    supportedStates: ['Default', 'Hover', 'Focus', 'Pressed', 'Disabled', 'Loading', 'Success', 'Error', 'Empty', 'Selected'],
    responsiveRules: ['Max height 90vh with internal scroll', 'Full width on screens <640px with rounded-t-2xl sheet style'],
    accessibilityRules: ['role="dialog"', 'aria-modal="true"', 'aria-labelledby linked to header', 'Focus trapped inside modal', 'Escape key triggers onClose'],
    acceptanceCriteria: ['Locks background body scroll when open', 'Restores focus to triggering element on close', 'Clicking backdrop dismisses modal']
  }
];

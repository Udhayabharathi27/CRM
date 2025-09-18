# Solar Panel CRM Design Guidelines

## Design Approach
**System-Based Approach**: Using a modified Material Design system optimized for B2B productivity applications. This CRM requires efficiency, data clarity, and professional aesthetics for solar sales teams.

## Core Design Elements

### Color Palette
**Light Mode:**
- Primary: 202 88% 35% (Professional blue)
- Secondary: 45 90% 55% (Solar gold)
- Success: 142 76% 36% (Green for closed deals)
- Warning: 38 92% 50% (Amber for follow-ups)
- Error: 0 84% 60% (Red for urgent items)
- Background: 0 0% 98%
- Surface: 0 0% 100%

**Dark Mode:**
- Primary: 202 88% 65%
- Secondary: 45 90% 65%
- Success: 142 76% 56%
- Background: 222 47% 11%
- Surface: 222 47% 16%

### Typography
- **Primary Font**: Inter (via Google Fonts CDN)
- **Headings**: Semibold (600) for hierarchy
- **Body**: Regular (400) and Medium (500)
- **Data Tables**: Tabular numbers for consistency

### Layout System
**Tailwind Spacing Units**: Consistent use of 2, 4, 6, 8, 12, 16, 24
- Tight spacing: p-2, m-2
- Standard spacing: p-4, gap-4
- Section spacing: p-8, mb-12
- Large spacing: p-16, mt-24

### Component Library

**Navigation:**
- Fixed sidebar with collapsible sections
- Breadcrumb navigation for deep pages
- Tab navigation for related views

**Data Display:**
- Advanced data tables with sorting/filtering
- Pipeline visualization cards
- Performance dashboards with charts
- Customer profile cards with status indicators

**Forms:**
- Multi-step lead capture forms
- Inline editing for quick updates
- Auto-save functionality indicators
- Validation with clear error states

**Actions:**
- Primary CTAs for deal progression
- Secondary actions for data management
- Bulk action toolbars
- Quick-action floating buttons

### Key Features
- **Dashboard**: Revenue charts, pipeline overview, recent activities
- **Lead Management**: Capture forms, qualification tracking, assignment tools
- **Deal Pipeline**: Kanban-style boards with drag-and-drop
- **Customer Profiles**: Comprehensive contact management with interaction history
- **Analytics**: Performance metrics, conversion tracking, team reports

### Professional Aesthetics
- Clean, data-focused interface prioritizing readability
- Subtle shadows and borders for depth without distraction
- Consistent iconography using Heroicons
- Status indicators using color-coded badges
- Responsive grid layouts adapting to screen sizes

### Animations
Minimal and purposeful only:
- Smooth transitions between pipeline stages
- Loading states for data fetching
- Subtle hover effects on interactive elements

This system prioritizes functionality and data clarity while maintaining a professional appearance suitable for solar sales teams managing complex customer relationships and deal pipelines.
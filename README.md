# Stream Schedule Creator

A open-source web application for creating beautiful, customizable stream schedules with extensive styling options. Perfect for streamers, VTubers, and content creators.

## Features

### Core Features
- **Local-first architecture**: All data stored in your browser (localStorage)
- **URL persistence**: Share your schedule via URL with `?state=...` parameter
- **OBS/embed mode**: Use `?obs=true` for transparent backgrounds in OBS
- **Multiple timezone support**: 30+ timezones with flag emoji indicators
- **Export options**: Export to PNG for social media or JSON for backup

### Customization Options
- **8 Schedule Styles**: Ribbon, Cards, Minimal, Gradient, Timeline, Compact, Calendar, Week View
- **5 Layouts**: Default, Avatar Left, Avatar Right, Avatar Top, Minimal
- **11 Color Presets**: 
  - Strechedule Dark/Light
  - Catppuccin Mocha/Macchiato
  - Dracula, Monokai, Nord, Synthwave, Gruvbox, Solarized Dark
  - Custom (extendable)
- **4 Background Types**: Grid, Gradient, Solid, Image URL
- **Avatar Support**: Upload custom images for VTubers/VRChat users
- **Custom CSS Editor**: Advanced users can add custom styles

### Internationalization
Full i18n support with 8 languages:
- English (EN)
- Español (ES)
- Português (AI)
- Français (AI)
- Deutsch (AI)
- 日本語 (AI)
- 한국어 (AI)
- 中文 (AI)

*AI = AI-made translation*

### Preset Templates
Quick-start templates for common use cases:
- **VTuber Daily**: Daily evening streams with late-night sessions
- **Gamer Weekend**: Weekend-only streaming schedule
- **Content Creator**: Multi-timezone content creation + live streams
- **Minimal Schedule**: Simple weekday-only schedule

## Tech Stack

- **Runtime**: Bun 1.3.13
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Bun 1.3.13 or higher
- Node.js 18+ (optional, for npm commands)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/stream-schedule-gen.git
cd stream-schedule-gen

# Install dependencies
bun install

# Start development server
bun run dev
```

### Build for Production

```bash
bun run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Usage

### Editor Tab
1. **Add Timezones**: Click the timezone input and search for your target timezones
2. **Set Days Online/Offline**: Toggle each day's online status
3. **Add Activities**: For online days, add activities with:
   - Title (e.g., "Just Chatting", "Gaming", "IRL Stream")
   - Time (24-hour format)
   - Color (choose from 8 options)

### Customization Tab
- **Style**: Choose from 8 different schedule display styles
- **Layout**: Select layout with optional avatar positioning
- **Colors**: Pick from 11 color presets
- **Background**: Choose grid, gradient, solid color, or custom image URL
- **Advanced**: Add custom CSS for fine-tuned control

### Settings Tab
- **Presets**: Load pre-configured templates
- **Export**: Download as PNG or JSON
- **Language**: Switch between 8 languages
- **Display**: Toggle day names, numbers, timezone labels, etc.

## URL Parameters

### Share Your Schedule
Copy the URL from your browser - it includes a Base64-encoded state parameter:
```
https://yoursite.com/?state=eyJkYXlzIjpb...
```

### OBS Mode
Add `?obs=true` for a clean, transparent background:
```
https://yoursite.com/?obs=true&state=eyJkYXlzIjpb...
```

## Project Structure

```
src/
├── App.tsx                    # Main app component
├── main.tsx                   # Entry point
├── index.css                  # Tailwind v4 config
├── components/
│   ├── EditorPane.tsx         # Schedule editor
│   ├── CustomizationPanel.tsx # Visual customization
│   ├── SettingsPanel.tsx      # Settings & export
│   └── ScheduleCanvas.tsx     # Render engine (8 styles)
├── store/
│   └── useScheduleStore.ts    # Zustand state management
├── utils/
│   ├── i18n.ts               # Internationalization
│   ├── theme.ts              # Color presets (11 themes)
│   └── time.ts               # Timezone formatting
└── hooks/
    └── useOBSMode.ts         # OBS mode detection
```

## Contributing

Contributions are welcome! Here are some areas for improvement:

### High Priority
- [ ] Add more timezones (expand to 50+)
- [ ] Performance optimization for large schedules
- [ ] Accessibility improvements (keyboard navigation, screen reader support)

### Medium Priority
- [ ] Add more color presets
- [ ] Add more schedule display styles
- [ ] Improve AI translations (PT, FR, DE, JA, KO, ZH)

### Low Priority
- [ ] Add preset templates for specific niches
- [ ] Add animation presets
- [ ] Add sound notifications for stream start/end

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Inspired by Strechedule
- Color themes from popular VS Code themes
- Built with modern web technologies

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Self-hosted
Simply deploy the `dist/` folder to any static hosting service:
- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel
- Any S3-compatible storage

## Troubleshooting

### Build fails with TypeScript errors
```bash
# Clear cache and rebuild
rm -rf node_modules bun.lock
bun install
bun run build
```

### Schedule not saving
Check browser localStorage is enabled and not in private/incognito mode.

### PNG export not working
Ensure you're using a supported browser with Canvas API support.

## Support

For issues or questions, please:
1. Check existing issues in the repository
2. Create a new issue with details
3. For translations, note that AI-translated languages may need community review

---

Made with ❤️ for the streaming community

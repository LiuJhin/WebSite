# Editorial Archive

A modern editorial archive and portfolio website built with Next.js, featuring multilingual support, dynamic theming, and immersive Three.js experiences.

## Features

- **Multilingual Support**: English and Chinese language support with next-intl
- **Dynamic Theming**: 6 carefully crafted themes (Midnight, Sand, Titanium, Moss, Black, White)
- **Three.js Integration**: Immersive 3D automotive showcase with cinematic camera controls
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: Built with Next.js 16 and React 19
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Animations**: GSAP, Maath
- **Post-processing**: React Three Postprocessing

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd editorial-archive
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Run the development server:

```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
# or
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # Localized layout with theme provider
│   │   └── page.tsx            # Main page component
│   ├── threejs-lab/
│   │   └── [slug]/
│   │       └── page.tsx        # Three.js automotive showcase
│   ├── components/
│   │   ├── ThemeProvider.tsx   # Theme context and provider
│   │   ├── FloatingThemeSwitcher.tsx # Floating theme selector
│   │   ├── layout/             # Layout components
│   │   ├── sections/           # Page sections
│   │   └── index.ts            # Component exports
│   ├── data/
│   │   ├── posts.ts            # Blog posts data
│   │   └── threejs-projects.ts # Three.js projects data
│   ├── types/
│   │   └── post.ts             # TypeScript type definitions
│   └── globals.css             # Global styles
├── i18n/
│   └── request.ts              # Internationalization configuration
├── messages/
│   ├── en.json                 # English translations
│   └── zh.json                 # Chinese translations
├── public/                     # Static assets
└── package.json
```

## Theme System

The application includes 6 distinct themes, each with carefully chosen color palettes:

- **Midnight**: Deep blue monitoring theme with neon accents
- **Sand**: Warm desert-inspired theme with earthy tones
- **Titanium**: Industrial metallic theme with orange highlights
- **Moss**: Retro terminal theme with green accents
- **Black**: Pure black performance theme
- **White**: Clean gallery white theme

Themes are managed through React Context and stored in localStorage for persistence.

## Internationalization

The application supports English and Chinese languages:

- **English**: `/en` route
- **Chinese**: `/zh` route

Translations are managed through JSON files in the `messages/` directory and configured with next-intl.

## Three.js Showcase

The Three.js laboratory features an immersive automotive showcase with:

- **Cinematic Camera**: Smooth camera movements and dynamic FOV adjustments
- **BMW Model**: High-quality 3D model with custom materials
- **Interactive UI**: Scroll-controlled navigation with animated text overlays
- **Post-processing**: Bloom effects, chromatic aberration, and vignette
- **Reflective Surfaces**: Real-time ground reflections with MeshReflectorMaterial

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Code Quality

The project uses:

- **ESLint** for code linting
- **TypeScript** for type checking
- **Prettier** for code formatting (via editor configuration)

### Environment Variables

No environment variables are required for basic functionality. For production deployment, configure your hosting platform's environment variables as needed.

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure build settings:
   - Build Command: `pnpm build`
   - Output Directory: `.next`
3. Deploy

### Other Platforms

The application can be deployed to any platform supporting Next.js:

- **Netlify**: Configure build command and publish directory
- **Railway**: Automatic deployment from GitHub
- **Self-hosted**: Build and serve the `.next` directory

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js community for the amazing 3D library
- React Three Fiber for React integration
- Tailwind CSS for the utility-first CSS framework
- Next.js team for the excellent React framework

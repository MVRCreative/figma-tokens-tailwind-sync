
# Design System Style Guide with Figma Integration

A beautiful, minimalist design system style guide that integrates with Figma tokens for seamless design-to-code workflow.

## Features

- **Figma Tokens Integration**: Sync design tokens directly from Figma
- **Comprehensive Style Guide**: Visual documentation of colors, typography, spacing, and components
- **Component Library**: Built on React and Tailwind CSS
- **Animation and Transitions**: Smooth, Apple-inspired animations
- **Interactive Documentation**: Live examples of all components and styles

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Visit `http://localhost:8080` to view the style guide

## Figma Integration

To set up Figma integration:

1. Install the "Figma Tokens" plugin in your Figma account
2. Set up your design tokens in Figma following the plugin documentation
3. Generate a personal access token in your Figma account settings
4. Enter your Figma file ID and access token in the "Figma Integration" tab of the style guide
5. Click "Sync with Figma" to pull the latest design tokens

## Project Structure

- `/src/tokens` - Design token management system
- `/src/components` - UI components
- `/src/tokens/figmaSync.ts` - Figma integration utilities
- `/src/components/StyleGuide.tsx` - Main style guide component

## How It Works

The integration between Figma and your React application works through these steps:

1. Design tokens are defined in Figma using the "Figma Tokens" plugin
2. Tokens are exported as a JSON file or accessed via the Figma API
3. Our token sync system processes these tokens and converts them into the format needed by Tailwind CSS
4. CSS variables are updated in real-time, reflecting the changes from Figma
5. Components automatically use these updated tokens through Tailwind classes

## Customization

You can customize the design system by:

1. Modifying the base tokens in `/src/tokens/index.ts`
2. Updating the Tailwind theme in `tailwind.config.ts`
3. Creating new components that follow the established design patterns

## License

MIT

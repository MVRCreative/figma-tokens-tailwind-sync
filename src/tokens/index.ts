
// Token management system
export interface DesignToken {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'spacing' | 'typography' | 'shadow' | 'radius' | 'animation';
  description?: string;
}

// This would be replaced or updated by the Figma tokens import
export const tokens: DesignToken[] = [
  // Base color tokens
  { id: 'color.background', name: 'Background', value: 'hsl(0, 0%, 100%)', type: 'color', description: 'Main background color' },
  { id: 'color.foreground', name: 'Foreground', value: 'hsl(222.2, 84%, 4.9%)', type: 'color', description: 'Main text color' },
  { id: 'color.primary', name: 'Primary', value: 'hsl(222.2, 47.4%, 11.2%)', type: 'color', description: 'Primary action color' },
  { id: 'color.primary.foreground', name: 'Primary Foreground', value: 'hsl(210, 40%, 98%)', type: 'color', description: 'Text on primary background' },
  
  // Spacing tokens
  { id: 'spacing.1', name: 'XS', value: '0.25rem', type: 'spacing', description: 'Extra small spacing' },
  { id: 'spacing.2', name: 'S', value: '0.5rem', type: 'spacing', description: 'Small spacing' },
  { id: 'spacing.4', name: 'M', value: '1rem', type: 'spacing', description: 'Medium spacing' },
  { id: 'spacing.8', name: 'L', value: '2rem', type: 'spacing', description: 'Large spacing' },
  
  // Typography tokens  
  { id: 'typography.font.sans', name: 'Sans Font', value: 'SF Pro Display, Inter, sans-serif', type: 'typography', description: 'Primary font family' },
  { id: 'typography.font.mono', name: 'Mono Font', value: 'SF Mono, monospace', type: 'typography', description: 'Monospace font family' },
  
  // Radius tokens
  { id: 'radius.default', name: 'Default Radius', value: '0.5rem', type: 'radius', description: 'Default border radius' },
  
  // Animation tokens
  { id: 'animation.default', name: 'Default Timing', value: '0.2s ease-out', type: 'animation', description: 'Default animation timing' },
];

// Function to get a specific token by ID
export function getToken(id: string): DesignToken | undefined {
  return tokens.find(token => token.id === id);
}

// Function to get all tokens of a specific type
export function getTokensByType(type: DesignToken['type']): DesignToken[] {
  return tokens.filter(token => token.type === type);
}

// Helper to convert HSL values from design tokens to CSS variables
export function tokenToHsl(value: string): string {
  // Simple regex to extract values from hsl() format
  const match = value.match(/hsl\(([^)]+)\)/);
  return match ? match[1] : value;
}

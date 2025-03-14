import React, { useState } from 'react';
import { tokens, getTokensByType, DesignToken } from '@/tokens';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { syncFigmaTokens, updateCssVariables, exportTokensForFigma } from '@/tokens/figmaSync';
import { convertInlineStylesToVariables, formatComponentCode } from '@/utils/componentConverter';

const StyleGuide: React.FC = () => {
  const [figmaFileId, setFigmaFileId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [currentTokens, setCurrentTokens] = useState<DesignToken[]>(tokens);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [inputComponent, setInputComponent] = useState<string>('');
  const [convertedComponent, setConvertedComponent] = useState<string>('');

  const colorTokens = getTokensByType('color');
  const spacingTokens = getTokensByType('spacing');
  const typographyTokens = getTokensByType('typography');
  const radiusTokens = getTokensByType('radius');
  const animationTokens = getTokensByType('animation');

  const handleSyncFigma = async () => {
    if (!figmaFileId || !accessToken) {
      alert('Please enter both Figma file ID and access token');
      return;
    }
    
    setSyncStatus('syncing');
    try {
      const updatedTokens = await syncFigmaTokens(figmaFileId, accessToken);
      setCurrentTokens(updatedTokens);
      updateCssVariables(updatedTokens);
      setSyncStatus('success');
    } catch (error) {
      console.error('Error syncing tokens:', error);
      setSyncStatus('error');
    }
  };

  const handleExportTokens = () => {
    const figmaTokens = exportTokensForFigma();
    const jsonString = JSON.stringify(figmaTokens, null, 2);
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'figma-tokens.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConvertComponent = () => {
    if (!inputComponent.trim()) {
      return;
    }
    
    const converted = convertInlineStylesToVariables(inputComponent);
    setConvertedComponent(converted);
  };

  return (
    <div className="container mx-auto py-12 animate-fade-in">
      <div className="flex flex-col items-center mb-16 space-y-4">
        <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">
          Design System
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-center">Style Guide</h1>
        <p className="text-lg text-muted-foreground text-center max-w-2xl">
          A comprehensive guide to design tokens, components, and patterns used in this project.
          Directly integrated with Figma for seamless design-to-code workflow.
        </p>
      </div>
      
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="w-full justify-start mb-8 overflow-x-auto">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="figma">Figma Integration</TabsTrigger>
          <TabsTrigger value="converter">React Converter</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="animate-slide-up">
          <h2 className="text-2xl font-bold mb-6">Color Tokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colorTokens.map(token => (
              <Card key={token.id} className="overflow-hidden">
                <div 
                  className="h-24 w-full"
                  style={{ backgroundColor: token.value }}
                />
                <CardHeader>
                  <CardTitle>{token.name}</CardTitle>
                  <CardDescription>{token.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-mono">{token.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="typography" className="animate-slide-up">
          <h2 className="text-2xl font-bold mb-6">Typography</h2>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Font Families</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {typographyTokens.map(token => (
                <div key={token.id}>
                  <h3 className="text-lg font-semibold mb-2">{token.name}</h3>
                  <p style={{ fontFamily: token.value }}>
                    The quick brown fox jumps over the lazy dog.
                  </p>
                  <p className="text-sm font-mono mt-2">{token.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Type Scale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">text-xs</p>
                <p className="text-xs">The quick brown fox jumps over the lazy dog.</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">text-sm</p>
                <p className="text-sm">The quick brown fox jumps over the lazy dog.</p>
              </div>
              <div>
                <p className="text-base text-muted-foreground mb-1">text-base</p>
                <p className="text-base">The quick brown fox jumps over the lazy dog.</p>
              </div>
              <div>
                <p className="text-lg text-muted-foreground mb-1">text-lg</p>
                <p className="text-lg">The quick brown fox jumps over the lazy dog.</p>
              </div>
              <div>
                <p className="text-xl text-muted-foreground mb-1">text-xl</p>
                <p className="text-xl">The quick brown fox jumps over the lazy dog.</p>
              </div>
              <div>
                <p className="text-2xl text-muted-foreground mb-1">text-2xl</p>
                <p className="text-2xl">The quick brown fox jumps over the lazy dog.</p>
              </div>
              <div>
                <p className="text-3xl text-muted-foreground mb-1">text-3xl</p>
                <p className="text-3xl">The quick brown fox jumps over the lazy dog.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="spacing" className="animate-slide-up">
          <h2 className="text-2xl font-bold mb-6">Spacing System</h2>
          <Card>
            <CardHeader>
              <CardTitle>Spacing Scale</CardTitle>
              <CardDescription>Consistent spacing tokens used throughout the design system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {spacingTokens.map(token => (
                <div key={token.id} className="flex items-center">
                  <div className="w-24">
                    <p className="font-semibold">{token.name}</p>
                    <p className="text-sm text-muted-foreground">{token.value}</p>
                  </div>
                  <div 
                    className="h-4 bg-primary/20 ml-4" 
                    style={{ width: token.value }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Border Radius</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {radiusTokens.map(token => (
                <div key={token.id}>
                  <div 
                    className="h-16 w-full bg-primary/20 mb-2"
                    style={{ borderRadius: token.value }}
                  />
                  <p className="font-semibold">{token.name}</p>
                  <p className="text-sm text-muted-foreground">{token.value}</p>
                </div>
              ))}
              <div>
                <div className="h-16 w-full bg-primary/20 mb-2 rounded-sm" />
                <p className="font-semibold">Small</p>
                <p className="text-sm text-muted-foreground">rounded-sm</p>
              </div>
              <div>
                <div className="h-16 w-full bg-primary/20 mb-2 rounded-md" />
                <p className="font-semibold">Medium</p>
                <p className="text-sm text-muted-foreground">rounded-md</p>
              </div>
              <div>
                <div className="h-16 w-full bg-primary/20 mb-2 rounded-lg" />
                <p className="font-semibold">Large</p>
                <p className="text-sm text-muted-foreground">rounded-lg</p>
              </div>
              <div>
                <div className="h-16 w-full bg-primary/20 mb-2 rounded-xl" />
                <p className="font-semibold">Extra Large</p>
                <p className="text-sm text-muted-foreground">rounded-xl</p>
              </div>
              <div>
                <div className="h-16 w-full bg-primary/20 mb-2 rounded-2xl" />
                <p className="font-semibold">2XL</p>
                <p className="text-sm text-muted-foreground">rounded-2xl</p>
              </div>
              <div>
                <div className="h-16 w-full bg-primary/20 mb-2 rounded-full" />
                <p className="font-semibold">Full</p>
                <p className="text-sm text-muted-foreground">rounded-full</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="components" className="animate-slide-up">
          <h2 className="text-2xl font-bold mb-6">Component Examples</h2>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Various button styles available in the design system</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <p className="font-medium">Primary</p>
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
              </div>
              <div className="space-y-4">
                <p className="font-medium">Secondary</p>
                <Button variant="secondary">Default</Button>
                <Button variant="secondary" disabled>Disabled</Button>
              </div>
              <div className="space-y-4">
                <p className="font-medium">Outline</p>
                <Button variant="outline">Default</Button>
                <Button variant="outline" disabled>Disabled</Button>
              </div>
              <div className="space-y-4">
                <p className="font-medium">Ghost</p>
                <Button variant="ghost">Default</Button>
                <Button variant="ghost" disabled>Disabled</Button>
              </div>
              <div className="space-y-4">
                <p className="font-medium">Destructive</p>
                <Button variant="destructive">Default</Button>
                <Button variant="destructive" disabled>Disabled</Button>
              </div>
              <div className="space-y-4">
                <p className="font-medium">Link</p>
                <Button variant="link">Default</Button>
                <Button variant="link" disabled>Disabled</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cards</CardTitle>
              <CardDescription>Card component with various layouts</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description goes here</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This is the main content of the card.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="mr-2">Cancel</Button>
                  <Button>Submit</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <div className="h-40 bg-muted" />
                <CardHeader>
                  <CardTitle>Media Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Card with media content.</p>
                </CardContent>
                <CardFooter>
                  <Button>Learn More</Button>
                </CardFooter>
              </Card>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Animation & Transitions</CardTitle>
              <CardDescription>Available animation and transition utilities</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {animationTokens.map((token, index) => (
                <Card key={token.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{token.name}</CardTitle>
                    <CardDescription>{token.id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-mono mb-4">{token.value}</p>
                    <div 
                      className="h-16 w-16 bg-primary transition-all hover:scale-110"
                      style={{ 
                        transition: `all ${token.value}`
                      }}
                    />
                    <p className="text-sm mt-2 text-muted-foreground">Hover to see the effect</p>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Fade In</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button onClick={(e) => {
                      const target = e.currentTarget.nextElementSibling as HTMLElement;
                      target.style.opacity = '0';
                      setTimeout(() => {
                        target.classList.add('animate-fade-in');
                        target.style.opacity = '1';
                      }, 10);
                    }}>
                      Trigger Animation
                    </Button>
                    <div className="h-16 w-full bg-primary/20 transition-opacity duration-300">
                      Fade In Content
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Slide Up</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button onClick={(e) => {
                      const target = e.currentTarget.nextElementSibling as HTMLElement;
                      target.style.opacity = '0';
                      target.style.transform = 'translateY(10px)';
                      setTimeout(() => {
                        target.classList.add('animate-slide-up');
                      }, 10);
                    }}>
                      Trigger Animation
                    </Button>
                    <div className="h-16 w-full bg-primary/20 transition-all duration-300 flex items-center justify-center">
                      Slide Up Content
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="figma" className="animate-slide-up">
          <h2 className="text-2xl font-bold mb-6">Figma Integration</h2>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Sync Tokens from Figma</CardTitle>
              <CardDescription>
                Connect your Figma file to automatically sync design tokens.
                Use the Figma Tokens plugin for best results.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Figma File ID</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-md" 
                    placeholder="Enter Figma file ID"
                    value={figmaFileId}
                    onChange={(e) => setFigmaFileId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Find this in the URL of your Figma file
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Figma Access Token</label>
                  <input 
                    type="password" 
                    className="w-full px-3 py-2 border rounded-md" 
                    placeholder="Enter access token"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Generate in Figma account settings
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                {syncStatus === 'success' && (
                  <span className="text-green-500 text-sm">✓ Tokens successfully synced</span>
                )}
                {syncStatus === 'error' && (
                  <span className="text-red-500 text-sm">✗ Failed to sync tokens</span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleExportTokens}>
                  Export Tokens
                </Button>
                <Button onClick={handleSyncFigma} disabled={syncStatus === 'syncing'}>
                  {syncStatus === 'syncing' ? 'Syncing...' : 'Sync with Figma'}
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md bg-muted p-4">
                <h3 className="text-lg font-semibold mb-2">1. Set up Figma Tokens</h3>
                <p className="text-sm">
                  Install the "Figma Tokens" plugin and set up your design tokens in your Figma file.
                  Organize them into color, typography, spacing, and other categories.
                </p>
              </div>
              
              <div className="rounded-md bg-muted p-4">
                <h3 className="text-lg font-semibold mb-2">2. Connect Your Project</h3>
                <p className="text-sm">
                  Enter your Figma file ID and personal access token above to connect your design system.
                </p>
              </div>
              
              <div className="rounded-md bg-muted p-4">
                <h3 className="text-lg font-semibold mb-2">3. Sync Design Tokens</h3>
                <p className="text-sm">
                  Click "Sync with Figma" to pull the latest design tokens from your Figma file.
                  This will update all connected styles in your application.
                </p>
              </div>
              
              <div className="rounded-md bg-muted p-4">
                <h3 className="text-lg font-semibold mb-2">4. Export for Version Control</h3>
                <p className="text-sm">
                  Click "Export Tokens" to download a JSON file of your tokens that can be committed to version control.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="converter" className="animate-slide-up">
          <h2 className="text-2xl font-bold mb-6">React Component Converter</h2>
          <p className="text-muted-foreground mb-6">
            Convert React components with inline styles to use CSS variables. Paste your component code below and click "Convert".
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Input Component</CardTitle>
                <CardDescription>Paste your React component with inline styles</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea 
                  className="w-full h-80 p-4 font-mono text-sm border rounded-md"
                  placeholder="Paste your React component code here..."
                  value={inputComponent}
                  onChange={(e) => setInputComponent(e.target.value)}
                />
              </CardContent>
              <CardFooter>
                <Button onClick={handleConvertComponent}>Convert Component</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Converted Component</CardTitle>
                <CardDescription>Component with CSS variables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <textarea 
                    className="w-full h-80 p-4 font-mono text-sm border rounded-md"
                    readOnly
                    value={convertedComponent}
                  />
                  {convertedComponent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        navigator.clipboard.writeText(convertedComponent);
                        alert('Copied to clipboard!');
                      }}
                    >
                      Copy
                    </Button>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  CSS variables are defined at the top of the converted code. Add them to your stylesheet.
                </p>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <h3 className="text-lg font-semibold mb-2">1. Paste Your Component</h3>
                <p className="text-sm">
                  Paste your React component code with inline styles into the input area.
                </p>
              </div>
              
              <div className="rounded-md bg-muted p-4">
                <h3 className="text-lg font-semibold mb-2">2. Convert</h3>
                <p className="text-sm">
                  Click "Convert Component" to transform inline style values into CSS variables.
                </p>
              </div>
              
              <div className="rounded-md bg-muted p-4">
                <h3 className="text-lg font-semibold mb-2">3. Copy Variables</h3>
                <p className="text-sm">
                  The converter automatically adds CSS variable declarations as a comment at the top.
                  Add these variables to your CSS or stylesheet file.
                </p>
              </div>
              
              <div className="rounded-md bg-muted p-4">
                <h3 className="text-lg font-semibold mb-2">4. Use Your Converted Component</h3>
                <p className="text-sm">
                  Copy the converted component code and use it in your project.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Example</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Original</h3>
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
                    {`<div style={{ 
  color: "#333", 
  backgroundColor: "#f5f5f5",
  padding: "10px",
  borderRadius: "4px"
}}>
  <h2 style={{ color: "#007bff" }}>Hello World</h2>
  <p style={{ fontSize: "14px" }}>This is a sample component</p>
</div>`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Converted</h3>
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
                    {`/*
CSS Variables to add to your stylesheet:
:root {
  --color-333: #333;
  --backgroundColor-f5f5f5: #f5f5f5;
  --color-007bff: #007bff;
}
*/

<div style={{ 
  color: var(--color-333), 
  backgroundColor: var(--backgroundColor-f5f5f5),
  padding: "10px",
  borderRadius: "4px"
}}>
  <h2 style={{ color: var(--color-007bff) }}>Hello World</h2>
  <p style={{ fontSize: "14px" }}>This is a sample component</p>
</div>`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StyleGuide;

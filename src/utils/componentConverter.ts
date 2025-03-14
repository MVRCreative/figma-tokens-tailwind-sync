
// Function to convert inline styles to CSS variables in React components
export function convertInlineStylesToVariables(code: string): string {
  // This is a simple implementation that could be enhanced for more complex cases
  
  // Convert hex colors to CSS variables
  let convertedCode = code;
  
  // Find inline style objects
  const styleRegex = /style=\{(\{[^}]+\})\}/g;
  const matches = [...code.matchAll(styleRegex)];
  
  matches.forEach((match) => {
    const styleObj = match[1];
    
    // Look for color properties
    const colorRegex = /(color|backgroundColor|borderColor|fill|stroke):\s*['"]?(#[0-9A-Fa-f]{3,6})['"]?/g;
    const colorMatches = [...styleObj.matchAll(colorRegex)];
    
    let updatedStyleObj = styleObj;
    
    colorMatches.forEach((colorMatch) => {
      const property = colorMatch[1];
      const colorValue = colorMatch[2];
      
      // Create a variable name based on the color
      const varName = `var(--${property}-${colorValue.replace('#', '')})`;
      
      // Replace the color value with the variable reference
      updatedStyleObj = updatedStyleObj.replace(
        `${property}: "${colorValue}"`,
        `${property}: ${varName}`
      );
      
      updatedStyleObj = updatedStyleObj.replace(
        `${property}: '${colorValue}'`,
        `${property}: ${varName}`
      );
      
      updatedStyleObj = updatedStyleObj.replace(
        `${property}:${colorValue}`,
        `${property}: ${varName}`
      );
    });
    
    // Replace the original style object with the updated one
    convertedCode = convertedCode.replace(styleObj, updatedStyleObj);
  });
  
  // Add CSS variable declarations as a comment at the top
  const uniqueVars = new Set<string>();
  const colorVarRegex = /var\(--(color|backgroundColor|borderColor|fill|stroke)-([0-9A-Fa-f]{3,6})\)/g;
  const varMatches = [...convertedCode.matchAll(colorVarRegex)];
  
  varMatches.forEach((varMatch) => {
    const property = varMatch[1];
    const colorValue = varMatch[2];
    uniqueVars.add(`  --${property}-${colorValue}: #${colorValue};`);
  });
  
  if (uniqueVars.size > 0) {
    const cssVars = `/*
CSS Variables to add to your stylesheet:
:root {
${Array.from(uniqueVars).join('\n')}
}
*/\n\n`;
    
    convertedCode = cssVars + convertedCode;
  }
  
  return convertedCode;
}

// Helper function to format the component code
export function formatComponentCode(code: string): string {
  // Basic formatting - this could be enhanced with a proper code formatter
  return code.trim();
}

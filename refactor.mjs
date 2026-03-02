import fs from 'fs';
import path from 'path';

const componentsDir = path.join(process.cwd(), 'src/components/ui');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Replace all interfaces with types
  content = content.replace(/export interface ([A-Za-z0-9_]+)( extends [A-Za-z0-9_<>{},\s.'"]+)? \{/g, (match, p1, p2) => {
    const ext = p2 ? ` & ${p2.replace(' extends ', '')} & ` : ' = ';
    return `export type ${p1}${ext}{`;
  });
  
  content = content.replace(/interface ([A-Za-z0-9_]+)( extends [A-Za-z0-9_<>{},\s.'"]+)? \{/g, (match, p1, p2) => {
    const ext = p2 ? ` & ${p2.replace(' extends ', '')} & ` : ' = ';
    return `type ${p1}${ext}{`;
  });

  // 2. Change function declarations to arrow functions with explicit returns
  // This is tricky using regex, we'll try a basic approach for standard shadcn component declarations:
  // e.g., function Button({ ... }: Props) { return (...) }
  // -> const Button = ({ ... }: Props) => { return (...) }
  
  // Also need to handle export function ...
  content = content.replace(/export function ([A-Z][A-Za-z0-9_]*)\s*\(([^)]*)\)(?:\s*:\s*[A-Za-z0-9_<>\s.]*)?\s*\{/g, (match, name, params) => {
    return `export const ${name} = (${params}) => {`;
  });

  content = content.replace(/(?<!export\s+)function ([A-Z][A-Za-z0-9_]*)\s*\(([^)]*)\)(?:\s*:\s*[A-Za-z0-9_<>\s.]*)?\s*\{/g, (match, name, params) => {
    return `const ${name} = (${params}) => {`;
  });
  
  // ForwardRef components often look like:
  // const Button = React.forwardRef<...>(function Button(...) { ... })
  // or arrow functions with implicit returns.
  // We'll leave React.forwardRef alone but try to find components and fix implicit returns.
  // Let's replace implicit return arrow functions that return JSX:
  // (...args) => ( ... ) -> (...args) => { return ( ... ); }
  content = content.replace(/=>\s*\(\s*(<[A-Za-z0-9_]+\b[^>]*>[\s\S]*?(?:<\/[A-Za-z0-9_]+>|\/>))\s*\)/g, (match, jsx) => {
    return `=> {\n  return (\n    ${jsx}\n  )\n}`;
  });

  // 3. Update styling tokens (Billion-dollar UI)
  // Replaces
  // - rounded-md -> rounded-xl (cards, dialogs), rounded-lg (buttons, inputs)
  // - bg-background -> bg-surface-base / bg-surface-elevated
  // - ring-offset-background -> shadow-subtle etc.
  
  content = content.replace(/rounded-md/g, 'rounded-[var(--radius-lg)]');
  content = content.replace(/rounded-lg/g, 'rounded-[var(--radius-xl)]');
  content = content.replace(/rounded-sm/g, 'rounded-[var(--radius-sm)]');
  
  content = content.replace(/shadow-sm/g, 'shadow-subtle');
  content = content.replace(/shadow-md/g, 'shadow-elem');
  content = content.replace(/shadow-lg/g, 'shadow-float');
  
  content = content.replace(/transition-colors/g, 'transition-smooth');
  content = content.replace(/transition-all/g, 'transition-smooth');
  
  content = content.replace(/bg-background/g, 'bg-surface-elevated');
  content = content.replace(/border-border/g, 'border-border/50');
  
  content = content.replace(/focus-visible:ring-ring/g, 'focus-visible:ring-brand-accent/50 focus-visible:ring-[3px] focus-visible:border-brand-accent focus-visible:outline-none');

  fs.writeFileSync(filePath, content, 'utf-8');
}

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  processFile(filePath);
});

console.log('Refactoring complete.');

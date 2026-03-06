/**
 * Scopes CSS selectors by prefixing them with a parent selector
 * @param css The CSS string to scope
 * @param scopeSelector The parent selector to scope with (e.g., "#wordpress-blog-content")
 * @returns Scoped CSS string
 */
export function scopeCss(css: string, scopeSelector: string): string {
  // Handle simple selectors
  let scopedCss = css.replace(
    /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g,
    (match, selector, delimiter) => {
      // Skip selectors that are already scoped or are at-rules
      if (
        selector.includes(scopeSelector) ||
        selector.trim().startsWith('@') ||
        selector.trim().startsWith('from') ||
        selector.trim().startsWith('to')
      ) {
        return match;
      }
      
      // Handle comma-separated selectors
      if (delimiter === ',') {
        return `${scopeSelector} ${selector.trim()}${delimiter}`;
      }
      
      return `${scopeSelector} ${selector.trim()}${delimiter}`;
    }
  );
  
  // Handle @media and other at-rules
  scopedCss = scopedCss.replace(
    /@media[^{]+\{([\s\S]+?)}\s*}/g,
    (match, rules) => {
      const scopedRules = scopeCss(rules, scopeSelector);
      return match.replace(rules, scopedRules);
    }
  );
  
  return scopedCss;
}
export const AGENT_LINK_HEADER = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</.well-known/agent-skills/index.json>; rel="https://agentskills.io/rel/index"; type="application/json"',
  '</.well-known/mcp/server-card.json>; rel="https://modelcontextprotocol.io/rel/server-card"; type="application/json"',
  '</.well-known/oauth-protected-resource>; rel="https://www.rfc-editor.org/rfc/rfc9728"; type="application/json"',
  '</.well-known/openid-configuration>; rel="http://openid.net/specs/connect/1.0/issuer"; type="application/json"',
  '</.well-known/ucp>; rel="https://ucp.dev/rel/profile"; type="application/json"',
  '</.well-known/acp.json>; rel="https://agenticcommerce.dev/rel/profile"; type="application/json"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</faq>; rel="help"; type="text/html"',
  '</contact>; rel="author"; type="text/html"',
  '</privacy>; rel="privacy-policy"; type="text/html"',
  '</voorwaarden>; rel="terms-of-service"; type="text/html"',
].join(', ');

export function shouldAddLinkHeader(pathname: string): boolean {
  if (pathname.startsWith('/_next')) return false;
  if (pathname.startsWith('/api')) return false;
  if (pathname.startsWith('/.well-known')) return false;
  if (/\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff|woff2|ttf)$/i.test(pathname)) return false;
  return true;
}

/**
 * Bron van waarheid voor agent skills (Agent Skills Discovery v0.2.0).
 * https://github.com/cloudflare/agent-skills-discovery-rfc
 */

const SITE_ORIGIN = 'https://telfixer.nl';

export type AgentSkill = {
  name: string;
  type: 'skill';
  description: string;
  markdown: string;
};

export const SKILLS: AgentSkill[] = [
  {
    name: 'track-repair',
    type: 'skill',
    description:
      'Volg de status van een reparatie, inlevering of bestelling op basis van het referentienummer.',
    markdown: `---
name: track-repair
description: Volg de status van een reparatie, inlevering of bestelling op basis van het referentienummer.
---

# Track Repair

Gebruik dit endpoint om de status van een reparatie, inlevering of bestelling te volgen bij TelFixer.

## Endpoint

\`GET ${SITE_ORIGIN}/api/v1/public/tracking?ref=<referentienummer>\`

## Parameters

- \`ref\` (string, verplicht): Het referentienummer dat de klant heeft ontvangen na inlevering, reparatieaanvraag of bestelling.

## Response

\`\`\`json
{
  "kind": "submission" | "repair" | "order",
  "reference_number": "string",
  "status": "string",
  "created_at": "ISO 8601 datetime",
  "updated_at": "ISO 8601 datetime",
  "details": { }
}
\`\`\`

## Voorbeeld

\`\`\`bash
curl "${SITE_ORIGIN}/api/v1/public/tracking?ref=TF-ABC123"
\`\`\`

## Gerelateerd

- OpenAPI spec: ${SITE_ORIGIN}/api/v1/public/openapi.json
- MCP tool: \`track_repair\` op ${SITE_ORIGIN}/api/mcp
`,
  },
  {
    name: 'browse-products',
    type: 'skill',
    description:
      'Verken de productcategorieën van TelFixer (refurbished telefoons, laptops, tablets).',
    markdown: `---
name: browse-products
description: Verken productcategorieën van TelFixer.
---

# Browse Products

TelFixer biedt refurbished telefoons, laptops en tablets met garantie. Gebruik dit endpoint om actieve categorieën op te halen.

## MCP tool

Gebruik \`get_product_categories\` op de MCP server (${SITE_ORIGIN}/api/mcp) om alle categorieën met productaantallen op te halen.

## HTML

Productpagina's zijn beschikbaar onder \`${SITE_ORIGIN}/producten\`. Categorieën zijn benaderbaar via slug:

- ${SITE_ORIGIN}/producten?category=telefoons
- ${SITE_ORIGIN}/producten?category=laptops
- ${SITE_ORIGIN}/producten?category=tablets

## Markdown

Voeg \`Accept: text/markdown\` toe aan elk verzoek voor een markdown-versie van de pagina (Markdown for Agents).

## Gerelateerd

- OpenAPI spec: ${SITE_ORIGIN}/api/v1/public/openapi.json
- Sitemap: ${SITE_ORIGIN}/sitemap.xml
`,
  },
];

export function getSkill(name: string): AgentSkill | undefined {
  return SKILLS.find((s) => s.name === name);
}

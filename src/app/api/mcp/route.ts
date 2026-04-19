import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { z } from 'zod';
import { getCategoriesWithCount } from '@/lib/supabase/products';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SITE_ORIGIN = 'https://telfixer.nl';

function buildServer(origin: string) {
  const server = new McpServer({
    name: 'telfixer-mcp',
    version: '1.0.0',
  });

  server.registerTool(
    'track_repair',
    {
      title: 'Volg reparatie',
      description:
        'Volg de status van een reparatie, inlevering of bestelling op basis van het referentienummer.',
      inputSchema: {
        reference: z
          .string()
          .min(3)
          .describe('Referentienummer (bijv. TF-XXXXX) of ordernummer'),
      },
    },
    async ({ reference }) => {
      const url = new URL('/api/tracking', origin);
      url.searchParams.set('ref', reference);
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2),
          },
        ],
        isError: !res.ok,
      };
    }
  );

  server.registerTool(
    'get_product_categories',
    {
      title: 'Productcategorieën',
      description:
        'Haal alle actieve productcategorieën van TelFixer op, inclusief het aantal beschikbare producten per categorie.',
      inputSchema: {},
    },
    async () => {
      const categories = await getCategoriesWithCount();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              categories.map((c) => ({
                slug: c.slug,
                name: c.name,
                product_count: c.product_count,
              })),
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.registerTool(
    'create_repair_request',
    {
      title: 'Maak reparatieaanvraag',
      description:
        'Meld een nieuwe reparatie aan bij TelFixer. Geeft een referentienummer terug waarmee de status gevolgd kan worden.',
      inputSchema: {
        deviceType: z.string().min(1).describe('Soort apparaat, bijv. telefoon, laptop, tablet'),
        deviceBrand: z.string().min(1).describe('Merk, bijv. Apple, Samsung'),
        deviceModel: z.string().min(1).describe('Model, bijv. iPhone 13'),
        repairType: z.string().min(1).describe('Type reparatie, bijv. scherm, batterij'),
        problemDescription: z
          .string()
          .min(10)
          .describe('Beschrijving van het probleem, minimaal 10 tekens'),
        customerName: z.string().min(2),
        customerEmail: z.string().email(),
        customerPhone: z
          .string()
          .regex(/^\d{10}$/)
          .describe('Nederlands mobielnummer, 10 cijfers zonder spaties'),
        customerAddress: z.string().optional(),
        preferredDate: z.string().optional().describe('ISO datum, optioneel'),
      },
    },
    async (input) => {
      const url = new URL('/api/repair-request', origin);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input),
        cache: 'no-store',
      });
      const data = await res.json();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2),
          },
        ],
        isError: !res.ok,
      };
    }
  );

  return server;
}

async function handle(request: Request): Promise<Response> {
  const origin = new URL(request.url).origin || SITE_ORIGIN;

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  const server = buildServer(origin);
  await server.connect(transport);

  try {
    return await transport.handleRequest(request);
  } finally {
    transport.close().catch(() => {});
    server.close().catch(() => {});
  }
}

export async function POST(request: Request) {
  return handle(request);
}

export async function GET(request: Request) {
  return handle(request);
}

export async function DELETE(request: Request) {
  return handle(request);
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
      'access-control-allow-headers': 'content-type, mcp-session-id, mcp-protocol-version, last-event-id',
      'access-control-expose-headers': 'mcp-session-id, mcp-protocol-version',
    },
  });
}

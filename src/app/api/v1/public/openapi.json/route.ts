import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const SITE_ORIGIN = 'https://telfixer.nl';

const openapi = {
  openapi: '3.1.0',
  info: {
    title: 'TelFixer Public API',
    version: '1.0.0',
    description:
      'Publieke API van TelFixer voor AI-agents. Maakt het mogelijk om de status van reparaties, inleveringen en bestellingen te volgen en productinformatie op te vragen.',
    contact: {
      name: 'TelFixer',
      url: `${SITE_ORIGIN}/contact`,
    },
    license: {
      name: 'Proprietary',
      url: `${SITE_ORIGIN}/voorwaarden`,
    },
  },
  servers: [{ url: `${SITE_ORIGIN}/api/v1/public`, description: 'Production' }],
  paths: {
    '/health': {
      get: {
        operationId: 'getHealth',
        summary: 'Health check',
        responses: {
          '200': {
            description: 'Service is up',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Health' },
              },
            },
          },
        },
      },
    },
    '/tracking': {
      get: {
        operationId: 'trackByReference',
        summary: 'Volg een reparatie, inlevering of bestelling op referentienummer',
        parameters: [
          {
            name: 'ref',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'Referentienummer (case-insensitive)',
          },
        ],
        responses: {
          '200': {
            description: 'Tracking record gevonden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TrackingResult' },
              },
            },
          },
          '400': { description: 'Referentienummer ontbreekt' },
          '404': { description: 'Geen resultaten gevonden' },
        },
      },
    },
  },
  components: {
    schemas: {
      Health: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          service: { type: 'string' },
          version: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
        },
        required: ['status', 'timestamp'],
      },
      TrackingResult: {
        type: 'object',
        properties: {
          kind: { type: 'string', enum: ['submission', 'repair', 'order'] },
          reference_number: { type: 'string' },
          status: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          details: { type: 'object', additionalProperties: true },
        },
        required: ['kind', 'reference_number', 'status'],
      },
    },
  },
};

export function GET() {
  return new NextResponse(JSON.stringify(openapi, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/openapi+json; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'access-control-allow-origin': '*',
    },
  });
}

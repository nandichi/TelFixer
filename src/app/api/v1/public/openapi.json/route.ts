import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const SITE_ORIGIN = 'https://telfixer.nl';

const openapi = {
  openapi: '3.1.0',
  info: {
    title: 'TelFixer Public API',
    version: '1.0.0',
    description:
      'Publieke API van TelFixer voor AI-agents. Maakt het mogelijk om reparaties aan te melden, status te volgen en productinformatie op te vragen.',
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
    '/repair-request': {
      post: {
        operationId: 'createRepairRequest',
        summary: 'Meld een nieuwe reparatie aan',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RepairRequestInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Reparatieaanvraag aangemaakt',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RepairRequestResult' },
              },
            },
          },
          '400': { description: 'Ongeldige invoer' },
          '500': { description: 'Serverfout' },
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
      RepairRequestInput: {
        type: 'object',
        required: [
          'deviceType',
          'deviceBrand',
          'deviceModel',
          'repairType',
          'problemDescription',
          'customerName',
          'customerEmail',
          'customerPhone',
        ],
        properties: {
          deviceType: { type: 'string', example: 'telefoon' },
          deviceBrand: { type: 'string', example: 'Apple' },
          deviceModel: { type: 'string', example: 'iPhone 13' },
          repairType: { type: 'string', example: 'scherm' },
          problemDescription: { type: 'string', minLength: 10 },
          customerName: { type: 'string', minLength: 2 },
          customerEmail: { type: 'string', format: 'email' },
          customerPhone: {
            type: 'string',
            pattern: '^\\d{10}$',
            description: 'Nederlands mobielnummer, 10 cijfers',
          },
          customerAddress: { type: 'string', nullable: true },
          preferredDate: { type: 'string', format: 'date', nullable: true },
        },
      },
      RepairRequestResult: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          referenceNumber: { type: 'string' },
        },
        required: ['success', 'referenceNumber'],
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

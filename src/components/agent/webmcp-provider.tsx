'use client';

import { useEffect } from 'react';

type WebMcpToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<unknown> | unknown;
};

type WebMcpContextProvider = {
  provideContext: (context: { tools: WebMcpToolDefinition[] }) => void;
};

declare global {
  interface Navigator {
    modelContext?: WebMcpContextProvider;
  }
}

export function WebMcpProvider() {
  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const provider = navigator.modelContext;
    if (!provider || typeof provider.provideContext !== 'function') return;

    const tools: WebMcpToolDefinition[] = [
      {
        name: 'track_repair',
        description:
          'Volg de status van een reparatie of inlevering bij TelFixer op basis van het referentienummer.',
        inputSchema: {
          type: 'object',
          properties: {
            reference: {
              type: 'string',
              description: 'Referentienummer dat de klant heeft ontvangen',
            },
          },
          required: ['reference'],
          additionalProperties: false,
        },
        execute: async (input) => {
          const reference = String(input.reference ?? '').trim();
          if (!reference) return { error: 'Referentienummer is verplicht' };
          const res = await fetch(
            `/api/v1/public/tracking?ref=${encodeURIComponent(reference)}`,
            { headers: { accept: 'application/json' } }
          );
          return res.json();
        },
      },
      {
        name: 'browse_product_categories',
        description:
          'Open de productcatalogus van TelFixer in de browser, optioneel gefilterd op categorie.',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              enum: ['telefoons', 'laptops', 'tablets'],
              description: 'Optionele categorie-slug',
            },
          },
          additionalProperties: false,
        },
        execute: (input) => {
          const category =
            typeof input.category === 'string' ? input.category : '';
          const url = category
            ? `/producten?category=${encodeURIComponent(category)}`
            : '/producten';
          window.location.assign(url);
          return { navigatedTo: url };
        },
      },
      {
        name: 'open_repair_form',
        description:
          'Open het reparatieformulier zodat de gebruiker een nieuwe reparatie kan aanmelden.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
        execute: () => {
          window.location.assign('/reparatie');
          return { navigatedTo: '/reparatie' };
        },
      },
    ];

    try {
      provider.provideContext({ tools });
    } catch (err) {
      console.warn('WebMCP provideContext failed:', err);
    }
  }, []);

  return null;
}

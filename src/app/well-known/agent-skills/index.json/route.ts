import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { SKILLS } from '@/lib/agent/skills';

const SITE_ORIGIN = 'https://telfixer.nl';

export const runtime = 'nodejs';
export const dynamic = 'force-static';

function sha256(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

export function GET() {
  const body = {
    $schema:
      'https://raw.githubusercontent.com/cloudflare/agent-skills-discovery-rfc/main/schemas/v0.2.0/index.json',
    version: '0.2.0',
    skills: SKILLS.map((skill) => ({
      name: skill.name,
      type: skill.type,
      description: skill.description,
      url: `${SITE_ORIGIN}/.well-known/agent-skills/${skill.name}/SKILL.md`,
      sha256: sha256(skill.markdown),
    })),
  };

  return new NextResponse(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'access-control-allow-origin': '*',
    },
  });
}

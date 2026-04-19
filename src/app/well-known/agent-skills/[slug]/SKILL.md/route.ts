import { NextResponse } from 'next/server';
import { getSkill, SKILLS } from '@/lib/agent/skills';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return SKILLS.map((s) => ({ slug: s.name }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) {
    return new NextResponse('Skill not found', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  return new NextResponse(skill.markdown, {
    status: 200,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'access-control-allow-origin': '*',
    },
  });
}

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('[Test Admin API] Starting admin check...');
    
    const supabase = await createClient();
    
    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log('[Test Admin API] User:', user?.id, user?.email);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated', details: authError?.message },
        { status: 401 }
      );
    }

    // Check if user is admin
    console.log('[Test Admin API] Checking admin table for user:', user.id);
    
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('id, role, email')
      .eq('user_id', user.id)
      .maybeSingle();

    console.log('[Test Admin API] Admin query result:', { adminData, adminError });

    if (adminError) {
      return NextResponse.json(
        {
          error: 'Database error',
          details: adminError.message,
          code: adminError.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
      isAdmin: !!adminData,
      adminData: adminData || null,
    });
  } catch (error: any) {
    console.error('[Test Admin API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Unexpected error', details: error.message },
      { status: 500 }
    );
  }
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, UserPlus, Trash2, Lock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toast';
import { PageHeader } from '@/components/admin/ui/page-header';
import { DataTable, Column } from '@/components/admin/ui/data-table';
import { EmptyState } from '@/components/admin/ui/empty-state';
import { StatusPill } from '@/components/admin/ui/status-pill';
import { AdminButton } from '@/components/admin/ui/admin-button';
import { AdminModal } from '@/components/admin/ui/admin-modal';
import { AdminInput, AdminSelect } from '@/components/admin/ui/admin-input';
import { ConfirmModal } from '@/components/ui/modal';

interface AdminMember {
  id: string;
  email: string;
  role: 'admin' | 'support';
  user_id: string | null;
  created_at: string;
}

export default function AdminTeamPage() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'support'>('support');
  const [saving, setSaving] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<AdminMember | null>(null);
  const [removing, setRemoving] = useState(false);

  const fetchMembers = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('admins')
      .select('id, email, role, user_id, created_at')
      .order('created_at', { ascending: true });
    if (!error && data) setMembers(data as AdminMember[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const myRole = members.find((m) => m.user_id === user?.id)?.role ?? null;
  const canManage = myRole === 'admin';

  const post = async (body: Record<string, unknown>) => {
    const res = await fetch('/api/admin/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || 'Er ging iets mis');
    return json;
  };

  const handleAdd = async () => {
    if (!newEmail.trim()) return;
    setSaving(true);
    try {
      await post({ action: 'add', email: newEmail.trim(), role: newRole });
      success('Teamlid toegevoegd');
      setAddOpen(false);
      setNewEmail('');
      setNewRole('support');
      await fetchMembers();
    } catch (e) {
      showError('Toevoegen mislukt', e instanceof Error ? e.message : undefined);
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (m: AdminMember, role: 'admin' | 'support') => {
    const previous = members;
    setMembers((prev) =>
      prev.map((x) => (x.id === m.id ? { ...x, role } : x))
    );
    try {
      await post({ action: 'updateRole', id: m.id, role });
      success('Rol bijgewerkt');
    } catch (e) {
      setMembers(previous);
      showError('Wijzigen mislukt', e instanceof Error ? e.message : undefined);
    }
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      await post({ action: 'remove', id: removeTarget.id });
      success('Teamlid verwijderd');
      setRemoveTarget(null);
      await fetchMembers();
    } catch (e) {
      showError('Verwijderen mislukt', e instanceof Error ? e.message : undefined);
    } finally {
      setRemoving(false);
    }
  };

  const columns: Column<AdminMember>[] = [
    {
      key: 'member',
      header: 'Teamlid',
      sortable: true,
      sortValue: (r) => r.email,
      cell: (r) => {
        const initials = (r.email[0] ?? 'A').toUpperCase();
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--a-accent-soft)] text-[var(--a-accent)] flex items-center justify-center text-[11px] font-semibold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-[var(--a-text)] truncate flex items-center gap-1.5">
                {r.email}
                {r.user_id === user?.id && (
                  <span className="text-[10px] uppercase tracking-wider text-[var(--a-text-4)] font-semibold">
                    (jij)
                  </span>
                )}
              </div>
              {!r.user_id && (
                <div className="text-[11px] text-[var(--a-warning)]">
                  Nog niet gekoppeld aan een account
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'role',
      header: 'Rol',
      sortable: true,
      sortValue: (r) => r.role,
      cell: (r) =>
        canManage ? (
          <select
            value={r.role}
            onChange={(e) =>
              handleRoleChange(r, e.target.value as 'admin' | 'support')
            }
            className="h-7 px-2 text-[12.5px] rounded-md bg-[var(--a-surface)] border border-[var(--a-border)] text-[var(--a-text)] outline-none focus:border-[var(--a-accent)] cursor-pointer"
          >
            <option value="admin">Administrator</option>
            <option value="support">Support</option>
          </select>
        ) : (
          <StatusPill
            status={r.role}
            tone={r.role === 'admin' ? 'accent' : 'neutral'}
            label={r.role === 'admin' ? 'Administrator' : 'Support'}
            size="xs"
          />
        ),
    },
    {
      key: 'created_at',
      header: 'Toegevoegd',
      sortable: true,
      sortValue: (r) => new Date(r.created_at).getTime(),
      cell: (r) => (
        <span className="text-[12.5px] text-[var(--a-text-2)] admin-num">
          {formatDate(r.created_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '60px',
      cell: (r) =>
        canManage && r.user_id !== user?.id ? (
          <button
            onClick={() => setRemoveTarget(r)}
            className="p-1.5 rounded-md text-[var(--a-text-3)] hover:text-[var(--a-danger)] hover:bg-[var(--a-danger-soft)] transition-colors"
            aria-label="Verwijderen"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Team & rollen"
        description="Beheer wie toegang heeft tot het adminpaneel"
        actions={
          canManage ? (
            <AdminButton variant="primary" onClick={() => setAddOpen(true)}>
              <UserPlus className="h-3.5 w-3.5" />
              Teamlid toevoegen
            </AdminButton>
          ) : undefined
        }
      />

      {!canManage && !loading && (
        <div className="flex items-start gap-2.5 rounded-[10px] border border-[var(--a-border)] bg-[var(--a-surface-2)] px-3.5 py-3">
          <Lock className="h-4 w-4 text-[var(--a-text-3)] mt-0.5 shrink-0" />
          <p className="text-[12.5px] text-[var(--a-text-2)]">
            Je hebt de rol <span className="font-medium">Support</span>. Alleen een
            administrator kan teamleden toevoegen, rollen wijzigen of verwijderen.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <RoleInfo
          title="Administrator"
          desc="Volledige toegang: beheer producten, bestellingen, instellingen, team, kortingscodes en alles daartussen."
        />
        <RoleInfo
          title="Support"
          desc="Dagelijks werk: bestellingen, inleveringen, klanten en producten. Geen toegang tot teambeheer."
        />
        <div className="bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[10px] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[var(--a-accent-soft)] text-[var(--a-accent)] flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[20px] font-semibold text-[var(--a-text)] admin-num leading-none">
              {members.length}
            </div>
            <div className="text-[12px] text-[var(--a-text-3)] mt-1">
              {members.filter((m) => m.role === 'admin').length} administrator(s)
            </div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={members}
        rowKey={(r) => r.id}
        loading={loading}
        initialSort={{ key: 'created_at', direction: 'asc' }}
        empty={
          <EmptyState
            icon={ShieldCheck}
            title="Nog geen teamleden"
            description="Voeg je eerste teamlid toe om toegang te geven tot het adminpaneel."
            variant="compact"
          />
        }
      />

      <AdminModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Teamlid toevoegen"
        description="De persoon moet al een account hebben op de site."
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setAddOpen(false)}>
              Annuleren
            </AdminButton>
            <AdminButton
              variant="primary"
              onClick={handleAdd}
              loading={saving}
              disabled={!newEmail.trim()}
            >
              Toevoegen
            </AdminButton>
          </>
        }
      >
        <div className="space-y-3.5">
          <AdminInput
            label="E-mailadres"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="naam@voorbeeld.nl"
            hint="Het e-mailadres waarmee de persoon is geregistreerd."
            required
          />
          <AdminSelect
            label="Rol"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as 'admin' | 'support')}
          >
            <option value="support">Support</option>
            <option value="admin">Administrator</option>
          </AdminSelect>
        </div>
      </AdminModal>

      <ConfirmModal
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
        title="Teamlid verwijderen"
        message={`Weet je zeker dat je ${removeTarget?.email} de toegang tot het adminpaneel wilt ontnemen?`}
        confirmText="Verwijderen"
        variant="danger"
        isLoading={removing}
      />
    </div>
  );
}

function RoleInfo({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[10px] p-4">
      <div className="text-[13px] font-semibold text-[var(--a-text)]">{title}</div>
      <p className="text-[12px] text-[var(--a-text-3)] mt-1 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

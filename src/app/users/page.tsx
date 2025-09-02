'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { AppLayout } from '@/components/layout/AppLayout'

export default function UsersPage() {
  const users = useQuery(api.users.getAllUsers, {})
  const roles = useQuery(api.roles.getAllRoles, { includeSystem: true })

  const createUser = useMutation(api.users.createUser)
  const updateUser = useMutation(api.users.updateUser)
  const createPermissions = useMutation(api.roles.createSystemPermissions)
  const createSystemRoles = useMutation(api.roles.createSystemRoles)

  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', roleId: '' })
  const [saving, setSaving] = useState(false)

  const roleOptions = useMemo(() => (roles || []).map((r: any) => ({ value: r._id, label: r.name })), [roles])

  if (!users || !roles) return null

  const resetForm = () => setForm({ name: '', email: '', roleId: roleOptions[0]?.value || '' })

  const handleCreate = async () => {
    if (!form.email || !form.name || !form.roleId) return
    setSaving(true)
    try {
      // auth0Id placeholder: sarà collegato al primo login tramite email
      await createUser({
        email: form.email,
        name: form.name,
        roleId: form.roleId as any,
        auth0Id: `pending:${form.email}`,
      })
      setIsOpen(false)
      resetForm()
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (user: any) => {
    await updateUser({ userId: user._id, isActive: !user.isActive })
  }

  const handleChangeRole = async (user: any, newRoleId: string) => {
    await updateUser({ userId: user._id, roleId: newRoleId as any })
  }

  return (
    <AppLayout>
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Utenti</h1>
        <Button onClick={() => { resetForm(); setIsOpen(true) }}>Nuovo utente</Button>
      </div>

      {/* Avviso se mancano i ruoli di sistema */}
      {roleOptions.length === 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Nessun ruolo trovato</p>
              <p className="text-sm text-gray-600">Crea i ruoli di sistema (Utente, Agente, Amministratore) per procedere.</p>
            </div>
            <Button onClick={async () => { await createPermissions({}); await createSystemRoles({}); }}>Inizializza ruoli</Button>
          </div>
        </Card>
      )}

      {/* Lista utenti */}
      <div className="overflow-auto rounded-md border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Nome</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Ruolo</th>
              <th className="px-3 py-2 text-left">Stato</th>
              <th className="px-3 py-2 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2 text-gray-700">{u.email}</td>
                <td className="px-3 py-2">
                  <select
                    className="border rounded-md px-2 py-1 text-sm"
                    value={u.roleId as any}
                    onChange={(e) => handleChangeRole(u, e.target.value)}
                    disabled={roleOptions.length === 0}
                  >
                    {roleOptions.map((r: any) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <Badge variant={u.isActive ? 'default' : 'secondary'}>
                    {u.isActive ? 'Attivo' : 'Disattivo'}
                  </Badge>
                </td>
                <td className="px-3 py-2 text-right">
                  <Button variant="outline" size="sm" onClick={() => handleToggleActive(u)}>
                    {u.isActive ? 'Disattiva' : 'Attiva'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal semplice per nuovo utente */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="w-full max-w-md p-4 space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Nuovo utente</h2>
              <button className="text-gray-500" onClick={() => setIsOpen(false)}>✕</button>
            </div>
            <Input
              label="Nome"
              placeholder="Mario Rossi"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Email"
              placeholder="mario.rossi@clinica.it"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Select
              label="Ruolo"
              value={form.roleId}
              onChange={(e) => setForm({ ...form, roleId: e.target.value })}
              options={roleOptions}
            />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Annulla</Button>
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? 'Salvataggio...' : 'Crea utente'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
    </AppLayout>
  )
}



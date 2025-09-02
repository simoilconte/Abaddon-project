'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AppLayout } from '@/components/layout/AppLayout'

export default function RolesPage() {
  const roles = useQuery(api.roles.getAllRoles, { includeSystem: true })
  const permissions = useQuery(api.roles.getAllPermissions, {})

  if (!roles || !permissions) return null

  return (
    <AppLayout>
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Ruoli e Permessi</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role._id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{role.name}</h2>
              {role.isSystem && <Badge variant="secondary">Sistema</Badge>}
            </div>
            <p className="text-sm text-gray-600">{role.description}</p>
            <div className="flex flex-wrap gap-2">
              {role.permissions.map((permId: string) => {
                const p = permissions.find((x) => x && x._id === permId)
                if (!p) return null
                return (
                  <Badge key={permId}>
                    {p.resource}:{p.action}/{p.scope}
                  </Badge>
                )
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
    </AppLayout>
  )
}



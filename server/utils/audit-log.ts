import { prisma } from '~~/server/utils/prisma'

type AuditActorType = 'Admin' | 'System'

type CreateAuditLogEntryInput = {
  actorType: AuditActorType
  actorName: string
  action: string
  itemType: string
  details: string
}

export async function createAuditLogEntry(input: CreateAuditLogEntryInput) {
  return prisma.auditLogEntry.create({
    data: {
      actorType: input.actorType,
      actorName: input.actorName,
      action: input.action,
      itemType: input.itemType,
      details: input.details,
    },
  })
}

export function getAuditActorName(user?: { name?: string | null; email?: string | null } | null) {
  return user?.name?.trim() || user?.email?.trim() || 'Admin'
}

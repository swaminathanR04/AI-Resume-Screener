import { auth } from '~~/server/utils/auth'
import { aiScoringConfigSchema, updateAiScoringConfig } from '~~/server/utils/ai-config'
import { createAuditLogEntry, getAuditActorName } from '~~/server/utils/audit-log'
import { isAdminUser } from '~~/server/utils/user-role'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  if (!isAdminUser(session.user)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const body = await readBody(event)
  const config = aiScoringConfigSchema.parse(body)
  const updatedConfig = await updateAiScoringConfig(config)

  await createAuditLogEntry({
    actorType: 'Admin',
    actorName: getAuditActorName(session.user),
    action: 'AI Config Updated',
    itemType: 'AI Configuration',
    details: `Weights saved as ${updatedConfig.skillsWeight}/${updatedConfig.experienceWeight}/${updatedConfig.educationWeight}/${updatedConfig.portfolioWeight} with minimum score ${updatedConfig.minimumScore}/10.`,
  })

  return {
    config: updatedConfig,
  }
})

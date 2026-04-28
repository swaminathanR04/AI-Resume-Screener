import { auth } from '~~/server/utils/auth'
import { getAiScoringConfig, getDefaultAiScoringConfig } from '~~/server/utils/ai-config'
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

  return {
    config: await getAiScoringConfig(),
    defaults: getDefaultAiScoringConfig(),
  }
})

<script setup lang="ts">
  import { z } from 'zod'
  import { authClient } from '../utils/auth-client'

  const toast = useToast()
  const colorMode = useColorMode()
  const isEmailSent = ref(false)

  const state = reactive({
    email: '',
    otp: [] as string[],
  })

  const emailError = ref('')
  const otpError = ref('')

  const emailSchema = z.string().trim().email('Enter a valid work email address.')
  const otpSchema = z.array(z.string()).length(6, 'Enter the full 6-digit code.')

  watch(
    () => state.email,
    () => {
      emailError.value = ''
    }
  )

  watch(
    () => state.otp,
    () => {
      otpError.value = ''
    },
    { deep: true }
  )

  const colorModeIcon = computed(() =>
    colorMode.value === 'dark' ? 'i-heroicons-sun-20-solid' : 'i-heroicons-moon-20-solid'
  )

  const colorModeLabel = computed(() =>
    colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  )

  function toggleColorMode() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  async function handleSubmit() {
    if (!isEmailSent.value) {
      const parsedEmail = emailSchema.safeParse(state.email)

      if (!parsedEmail.success) {
        emailError.value =
          parsedEmail.error.issues[0]?.message || 'Enter a valid work email address.'
        return
      }

      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email: parsedEmail.data,
        type: 'sign-in',
      })

      if (error) {
        toast.add({ title: 'Error', description: error.message, color: 'error' })
      } else {
        state.email = parsedEmail.data
        isEmailSent.value = true
        toast.add({ title: 'Success', description: 'OTP sent to your email', color: 'success' })
      }
    } else {
      const parsedOtp = otpSchema.safeParse(state.otp)

      if (!parsedOtp.success) {
        otpError.value = parsedOtp.error.issues[0]?.message || 'Enter the full 6-digit code.'
        return
      }

      const { data, error } = await authClient.signIn.emailOtp({
        email: state.email,
        otp: parsedOtp.data.join(''),
      })

      if (error) {
        toast.add({ title: 'Error', description: error.message, color: 'error' })
      } else {
        await navigateTo('/', { external: true })
      }
    }
  }
</script>

<template>
  <div class="brand-auth-page flex min-h-screen w-full items-center justify-center px-4 py-12">
    <div class="grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
      <section
        class="brand-auth-copy rounded-[2rem] border border-white/60 bg-white/55 p-6 backdrop-blur md:p-8 lg:p-10 dark:border-white/10 dark:bg-white/5"
      >
        <div class="space-y-6">
          <CompanyBrand :show-tagline="true" align="left" />

          <div class="brand-auth-client-strip">
            <span class="brand-auth-client-label">Built by 40 Hours Inc. for</span>
            <GoogleWordmark />
          </div>

          <div class="max-w-2xl space-y-5 text-[var(--ui-text)]">
            <p class="brand-auth-eyebrow">Hiring Workspace</p>
            <h1
              class="brand-auth-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Modern hiring review for fast-moving teams.
            </h1>
            <p class="max-w-xl text-base leading-7 text-[var(--ui-text-muted)] sm:text-lg">
              Centralize resume intake, applicant updates, and AI-assisted screening in one clean
              workspace.
            </p>
          </div>

          <div class="flex flex-wrap gap-3 text-sm text-[var(--ui-text-muted)]">
            <span class="brand-auth-pill"> Resume Review </span>
            <span class="brand-auth-pill"> Applicant Notifications </span>
            <span class="brand-auth-pill"> AI Scoring </span>
          </div>
        </div>
      </section>

      <UCard
        class="brand-auth-card w-full justify-self-center"
        :ui="{
          root: 'overflow-hidden',
          header: 'border-b border-[var(--ui-border)] px-7 py-6 sm:px-8 sm:py-7',
          body: 'px-7 py-7 sm:px-8 sm:py-8',
        }"
      >
        <template #header>
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p
                  class="text-xs font-semibold tracking-[0.28em] text-[var(--brand-accent)] uppercase"
                >
                  40 Hours Inc.
                </p>
                <div class="mt-2 text-2xl font-bold text-[var(--ui-text)]">Secure Login</div>
              </div>
              <div class="flex items-center gap-2">
                <ClientOnly>
                  <UButton
                    color="neutral"
                    variant="soft"
                    :icon="colorModeIcon"
                    square
                    :aria-label="colorModeLabel"
                    @click="toggleColorMode"
                  />
                </ClientOnly>
                <div class="brand-auth-lockup">
                  <UIcon name="i-heroicons-lock-closed-20-solid" class="h-5 w-5" />
                </div>
              </div>
            </div>

            <p class="text-sm leading-6 text-[var(--ui-text-muted)]">
              Sign in with your work email to access the hiring workspace.
            </p>

            <div class="brand-auth-note">
              <UIcon
                name="i-heroicons-shield-check-20-solid"
                class="h-4 w-4 shrink-0 text-[var(--brand-accent)]"
              />
              <span>One-time passcode authentication keeps access simple and secure.</span>
            </div>
          </div>
        </template>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <UFormField
            v-if="!isEmailSent"
            name="email"
            label="Enter Email"
            :error="emailError || undefined"
          >
            <UInput
              v-model="state.email"
              class="brand-auth-input w-full"
              icon="i-heroicons-envelope-20-solid"
              size="xl"
              variant="outline"
              placeholder="name@40hours.com"
              autocomplete="email"
            />
          </UFormField>

          <UFormField
            v-if="isEmailSent"
            name="otp"
            label="Verification Code"
            :error="otpError || undefined"
            description="Enter the 6-digit code sent to your inbox."
          >
            <UPinInput
              otp
              v-model="state.otp"
              :length="6"
              size="xl"
              class="brand-auth-pin flex w-full items-center justify-center"
            />
          </UFormField>

          <UButton
            loading-auto
            type="submit"
            class="brand-auth-button w-full justify-center"
            size="xl"
          >
            {{ isEmailSent ? 'Login' : 'Send OTP' }}
          </UButton>
        </form>
      </UCard>
    </div>
  </div>
</template>

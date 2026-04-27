import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'
import { emailOTP } from 'better-auth/plugins/email-otp'
import nodemailer from 'nodemailer'

const betterAuthUrl = process.env.BETTER_AUTH_URL?.trim()
const trustedOrigins = Array.from(
  new Set(
    [
      betterAuthUrl,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ].filter((origin): origin is string => Boolean(origin))
  )
)

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const auth = betterAuth({
  ...(betterAuthUrl ? { baseURL: betterAuthUrl } : {}),
  trustedOrigins,
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'OTP for nuxt-template',
          html: `Your OTP is: ${otp}`,
        })
      },
    }),
  ],
})

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { verify as totpVerify } from 'otplib';
import { connectToDB } from '@/lib/db';
import { decrypt } from '@/lib/encryption';
import { User } from '@/models/User';
import { AuditLog } from '@/models/AuditLog';
import type { IUser } from '@/models/User';

async function writeAuditLog(
  actor: IUser,
  action: string,
  details: string,
  statusCode: number,
  ipAddress: string
) {
  try {
    await AuditLog.create({
      actorId: String(actor._id),
      actorName: actor.username,
      actorRole: actor.role,
      action,
      resource: 'system',
      details,
      ipAddress,
      statusCode,
      timestamp: new Date(),
    });
  } catch (e) {
    console.warn('Audit log write failed:', e);
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        mfaCode: { label: 'Authenticator Code', type: 'text' },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('MISSING_CREDENTIALS');
        }

        const ip =
          req.headers?.['x-real-ip'] ||
          req.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
          'unknown';

        await connectToDB();

        const user = await User.findOne({ username: credentials.username.toLowerCase() })
          .select('+passwordHash +encryptedMfaSecret +isMfaEnabled')
          .lean<IUser>();

        if (!user) {
          throw new Error('INVALID_CREDENTIALS');
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          const remainingMs = user.lockedUntil.getTime() - Date.now();
          const remainingMins = Math.ceil(remainingMs / 60000);
          throw new Error(`ACCOUNT_LOCKED:${remainingMins}`);
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          const newFailCount = (user.failedLoginAttempts || 0) + 1;
          const update: Partial<IUser> = { failedLoginAttempts: newFailCount };
          if (newFailCount >= 5) {
            update.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
          }
          await User.findByIdAndUpdate(user._id, update);
          throw new Error('INVALID_CREDENTIALS');
        }

        if (user.isMfaEnabled) {
          if (!credentials?.mfaCode) {
            throw new Error('MFA_CODE_REQUIRED');
          }
          if (!user.encryptedMfaSecret) {
            throw new Error('MFA_NOT_CONFIGURED');
          }

          let decryptedSecret: string;
          try {
            decryptedSecret = decrypt(user.encryptedMfaSecret);
          } catch {
            throw new Error('MFA_DECRYPT_FAILED');
          }

          const isMfaValid = totpVerify({ secret: decryptedSecret, token: credentials.mfaCode });

          if (!isMfaValid) {
            await writeAuditLog(user, 'LOGIN_MFA_FAILED', 'Invalid MFA code presented', 401, ip);
            throw new Error('INVALID_MFA');
          }
        }

        await User.findByIdAndUpdate(user._id, {
          failedLoginAttempts: 0,
          $unset: { lockedUntil: '' },
          lastLoginAt: new Date(),
        });

        await writeAuditLog(user, 'LOGIN_SUCCESS', 'Admin logged in successfully', 200, ip);

        return {
          id: String(user._id),
          name: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60,
  },

  pages: {
    signIn: '/hq',
  },

  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};

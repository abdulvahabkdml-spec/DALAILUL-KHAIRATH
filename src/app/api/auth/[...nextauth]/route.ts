/**
 * NextAuth.js — Route Handler
 *
 * authOptions live in src/lib/auth.ts so other server routes can import them
 * without creating a circular dependency through this file.
 */
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };



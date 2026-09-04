import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;

      if (path === '/' || path === '/login' || path === '/offline' || path === '/privacy' || path === '/reset-password') {
        return true;
      }

      if (path.startsWith('/sentry-example')) return false;
      if (path.startsWith('/api/sentry-example')) return false;
      if (path.startsWith('/api/auth')) return true;
      if (path.startsWith('/api/webhooks')) return true;
      if (path === '/api/health') return true;

      return !!token;
    },
  },
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon-.*\\.png|manifest.json|sw\\.js|robots\\.txt|sitemap\\.xml).*)',
  ],
};

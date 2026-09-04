import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const targetPath = Array.isArray(path) ? path.join('/') : path;

  const search = request.nextUrl.search;
  const targetUrl = `${BACKEND_URL.replace(/\/$/, '')}/${targetPath}${search}`;

  // Read access_token from httpOnly cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  // Prepare forward headers
  const forwardHeaders = new Headers();

  const contentType = request.headers.get('content-type');
  if (contentType) {
    forwardHeaders.set('content-type', contentType);
  }

  const accept = request.headers.get('accept');
  if (accept) {
    forwardHeaders.set('accept', accept);
  }

  // Inject Bearer token from cookie if present, or pass through incoming authorization header
  if (token) {
    forwardHeaders.set('authorization', `Bearer ${token}`);
  } else {
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      forwardHeaders.set('authorization', authHeader);
    }
  }

  // Forward body for non-GET/HEAD methods
  let body: BodyInit | undefined = undefined;
  if (!['GET', 'HEAD'].includes(request.method)) {
    const blob = await request.blob();
    if (blob.size > 0) {
      body = blob;
    }
  }

  try {
    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body,
    });

    const data = await backendResponse.arrayBuffer();

    const responseHeaders = new Headers();
    const resContentType = backendResponse.headers.get('content-type');
    if (resContentType) {
      responseHeaders.set('content-type', resContentType);
    }

    return new NextResponse(data, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Proxy request failed';
    return NextResponse.json(
      { message: `Lỗi kết nối tới backend API: ${message}` },
      { status: 502 },
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;

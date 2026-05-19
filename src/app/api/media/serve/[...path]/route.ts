import { NextResponse } from 'next/server';
import { stat } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync, createReadStream } from 'fs';
import { Readable } from 'stream';

const UPLOAD_DIR = process.env.UPLOAD_DIRECTORY || 'C:\\Users\\Abdul\\Desktop\\upload';

// Helper to convert Node stream to Web ReadableStream
function nodeToWeb(nodeStream: NodeJS.ReadableStream) {
  return new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk) => controller.enqueue(chunk));
      nodeStream.on('end', () => controller.close());
      nodeStream.on('error', (err) => controller.error(err));
    },
    cancel() {
      if ('destroy' in nodeStream) {
        (nodeStream as any).destroy();
      }
    }
  });
}

export async function GET(
  req: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await context.params;
    const filePath = join(UPLOAD_DIR, ...params.path);

    // Security: Check if filePath is actually inside UPLOAD_DIR
    if (!filePath.startsWith(UPLOAD_DIR)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileStat = await stat(filePath);
    const range = req.headers.get('range');

    // Get MIME type based on extension
    const extension = extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.doc': 'application/msword',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
    };

    if (mimeTypes[extension]) {
      contentType = mimeTypes[extension];
    }

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileStat.size - 1;
      const chunksize = (end - start) + 1;

      const fileStream = createReadStream(filePath, { start, end });
      const stream = nodeToWeb(fileStream);

      const response = new NextResponse(stream, {
        status: 206,
        statusText: 'Partial Content',
      });

      response.headers.set('Content-Range', `bytes ${start}-${end}/${fileStat.size}`);
      response.headers.set('Accept-Ranges', 'bytes');
      response.headers.set('Content-Length', chunksize.toString());
      response.headers.set('Content-Type', contentType);
      
      return response;
    } else {
      const fileStream = createReadStream(filePath);
      const stream = nodeToWeb(fileStream);

      const response = new NextResponse(stream);
      response.headers.set('Content-Length', fileStat.size.toString());
      response.headers.set('Content-Type', contentType);
      response.headers.set('Accept-Ranges', 'bytes');
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');

      return response;
    }
  } catch (error) {
    console.error('[Media Serve GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const runtime = 'nodejs';

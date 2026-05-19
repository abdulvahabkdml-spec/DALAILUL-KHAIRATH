import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(targetUrl);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();

    // Regex extraction for standard meta tags
    const extractMeta = (regex: RegExp, fallbackRegex?: RegExp) => {
      let match = html.match(regex);
      if (match && match[1]) return match[1];
      if (fallbackRegex) {
        match = html.match(fallbackRegex);
        if (match && match[1]) return match[1];
      }
      return '';
    };

    const title = extractMeta(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i,
      /<title>([^<]+)<\/title>/i
    );

    const desc = extractMeta(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    );

    const img = extractMeta(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    );

    const author = extractMeta(
      /<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*property=["']article:author["'][^>]*content=["']([^"']+)["']/i
    );

    const tag = extractMeta(
      /<meta[^>]*property=["']article:tag["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i
    ).split(',')[0].trim();

    return NextResponse.json({
      title: title || 'Unknown Title',
      desc: desc || 'No description available for this article.',
      img: img || '/inkspire-placeholder.jpg',
      author: author || 'Inkspire Author',
      tag: tag || 'Article',
      url: targetUrl,
      slug: new URL(targetUrl).pathname.split('/').filter(Boolean).pop() || ''
    });

  } catch (error: any) {
    console.error('Meta parsing error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

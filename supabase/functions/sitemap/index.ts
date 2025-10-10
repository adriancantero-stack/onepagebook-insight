import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Book {
  id: string;
  title: string;
  author: string;
  lang: string;
  updated_at: string;
  is_active: boolean;
}

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function createSlug(title: string, author: string): string {
  const combined = `${title} ${author}`;
  return combined
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getBookPath(lang: string, title: string, author: string): string {
  const slug = createSlug(title, author);
  
  switch (lang) {
    case 'pt':
      return `/pt/livro/${slug}`;
    case 'es':
      return `/es/libro/${slug}`;
    default:
      return `/en/book/${slug}`;
  }
}

function formatDate(date: string | Date): string {
  const d = date ? new Date(date) : new Date();
  return d.toISOString().split('T')[0];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching active books from database...');

    const { data: books, error } = await supabase
      .from('books')
      .select('id, title, author, lang, updated_at, is_active')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(50000);

    if (error) {
      console.error('Error fetching books:', error);
      throw error;
    }

    console.log(`Found ${books?.length || 0} active books`);

    const baseUrl = 'https://onepagebook.ai';
    const today = formatDate(new Date());

    // Landing pages with language versions (for hreflang)
    const landingPages = [
      { pt: '/pt', en: '/en', es: '/es', priority: '1.0', changefreq: 'weekly' },
    ];

    // Static routes by language (without hreflang)
    const staticRoutes = [
      { path: '/', priority: '1.0', changefreq: 'weekly' },
      { path: '/pt/home', priority: '0.8', changefreq: 'weekly' },
      { path: '/en/home', priority: '0.8', changefreq: 'weekly' },
      { path: '/es/home', priority: '0.8', changefreq: 'weekly' },
      { path: '/pt/explorar', priority: '0.6', changefreq: 'monthly' },
      { path: '/en/explore', priority: '0.6', changefreq: 'monthly' },
      { path: '/es/explorar', priority: '0.6', changefreq: 'monthly' },
      { path: '/pt/planos', priority: '0.5', changefreq: 'monthly' },
      { path: '/en/plans', priority: '0.5', changefreq: 'monthly' },
      { path: '/es/planes', priority: '0.5', changefreq: 'monthly' },
      { path: '/pt/faq', priority: '0.4', changefreq: 'monthly' },
      { path: '/en/faq', priority: '0.4', changefreq: 'monthly' },
      { path: '/es/faq', priority: '0.4', changefreq: 'monthly' },
    ];

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    // Add landing pages with hreflang tags
    for (const page of landingPages) {
      const langs = ['pt', 'en', 'es'] as const;
      
      for (const lang of langs) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}${page[lang]}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        
        // Add hreflang links for all language versions
        for (const altLang of langs) {
          xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}${page[altLang]}" />\n`;
        }
        // Add x-default pointing to Portuguese
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/pt" />\n`;
        
        xml += '  </url>\n';
      }
    }

    // Add other static routes
    for (const route of staticRoutes) {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${route.path}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += '  </url>\n';
    }

    // Add dynamic book routes
    if (books && books.length > 0) {
      for (const book of books as Book[]) {
        const path = getBookPath(book.lang, book.title, book.author);
        const lastmod = formatDate(book.updated_at);
        
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}${xmlEscape(path)}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
      }
    }

    xml += '</urlset>';

    console.log('Sitemap generated successfully');

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});

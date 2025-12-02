import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, Calendar, User, ArrowRight } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import { getPostsByLanguage } from "@/data/blogPosts";

const BlogIndex = () => {
    const { lang } = useParams<{ lang: string }>();
    const { t } = useTranslation();

    // Validate lang
    const currentLang = (lang === 'pt' || lang === 'es' || lang === 'en') ? lang : 'en';

    const posts = getPostsByLanguage(currentLang);

    const seoTitles = {
        pt: "Blog OnePageBook - Dicas de Leitura e Aprendizado",
        en: "OnePageBook Blog - Reading and Learning Tips",
        es: "Blog OnePageBook - Consejos de Lectura y Aprendizaje"
    };

    const seoDescriptions = {
        pt: "Artigos sobre leitura dinâmica, produtividade e como aprender mais rápido com resumos de livros.",
        en: "Articles about speed reading, productivity, and how to learn faster with book summaries.",
        es: "Artículos sobre lectura rápida, productividad y cómo aprender más rápido con resúmenes de libros."
    };

    useSEO({
        title: seoTitles[currentLang],
        description: seoDescriptions[currentLang],
        lang: currentLang,
        path: `/${currentLang}/blog`
    });

    return (
        <div className="min-h-screen bg-background font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to={`/${currentLang}`} className="flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            OnePageBook Blog
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to={`/${currentLang}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            {currentLang === 'pt' ? 'Voltar ao App' : currentLang === 'es' ? 'Volver a la App' : 'Back to App'}
                        </Link>
                        <LanguageSelector />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-tight mb-8 text-foreground">
                        {currentLang === 'pt' ? 'Últimas do Blog' : currentLang === 'es' ? 'Últimas del Blog' : 'Latest from the Blog'}
                    </h1>

                    <div className="grid gap-8">
                        {posts.map((post) => (
                            <article key={post.id} className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {post.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        {post.author}
                                    </span>
                                </div>

                                <h2 className="text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                                    <Link to={`/${currentLang}/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h2>

                                <p className="text-muted-foreground line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto pt-4 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="inline-flex items-center rounded-full border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <Link
                                        to={`/${currentLang}/blog/${post.slug}`}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                                    >
                                        {currentLang === 'pt' ? 'Ler mais' : currentLang === 'es' ? 'Leer más' : 'Read more'}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </article>
                        ))}

                        {posts.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>
                                    {currentLang === 'pt' ? 'Nenhum post encontrado.' : currentLang === 'es' ? 'No se encontraron artículos.' : 'No posts found.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-muted/50 py-12 mt-auto">
                <div className="container mx-auto px-4">
                    <Footer />
                </div>
            </footer>
        </div>
    );
};

export default BlogIndex;

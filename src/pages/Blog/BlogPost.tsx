import { useParams, Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import { getPostBySlug } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
    const { lang, slug } = useParams<{ lang: string; slug: string }>();
    const { t } = useTranslation();

    // Validate lang
    const currentLang = (lang === 'pt' || lang === 'es' || lang === 'en') ? lang : 'en';

    const post = getPostBySlug(currentLang, slug || '');

    useSEO({
        title: post ? `${post.title} - OnePageBook Blog` : 'Post Not Found',
        description: post?.excerpt || '',
        lang: currentLang,
        path: `/${currentLang}/blog/${slug}`,
        imageUrl: post?.coverImage
    });

    if (!post) {
        return <Navigate to={`/${currentLang}/blog`} replace />;
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to={`/${currentLang}/blog`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="hidden sm:inline">
                            {currentLang === 'pt' ? 'Voltar para o Blog' : currentLang === 'es' ? 'Volver al Blog' : 'Back to Blog'}
                        </span>
                    </Link>

                    <Link to={`/${currentLang}`} className="flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hidden sm:inline">
                            OnePageBook
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <LanguageSelector />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <article className="max-w-3xl mx-auto">
                    {/* Post Header */}
                    <header className="mb-10 text-center">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            {post.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center rounded-full border border-transparent bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-foreground leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {post.date}
                            </span>
                            <span className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {post.author}
                            </span>
                        </div>
                    </header>

                    {/* Cover Image (if exists) */}
                    {post.coverImage && (
                        <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-auto object-cover max-h-[500px]"
                            />
                        </div>
                    )}

                    {/* Post Content */}
                    <div
                        className="prose prose-lg prose-slate dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* CTA Section */}
                    <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 text-center">
                        <h3 className="text-2xl font-bold mb-4">
                            {currentLang === 'pt'
                                ? 'Milhares já aprendem livros em minutos. E você?'
                                : currentLang === 'es'
                                    ? 'Miles ya aprenden libros en minutos. ¿Y tú?'
                                    : 'Thousands already learn books in minutes. And you?'}
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                            {currentLang === 'pt'
                                ? 'Use IA para entender as ideias principais e acelerar seu crescimento.'
                                : currentLang === 'es'
                                    ? 'Usa IA para entender las ideas principales y acelerar tu crecimiento.'
                                    : 'Use AI to understand key ideas and accelerate your growth.'}
                        </p>
                        <Button size="lg" asChild className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
                            <Link to={`/${currentLang}`}>
                                {currentLang === 'pt' ? 'Testar OnePageBook Grátis' : currentLang === 'es' ? 'Probar OnePageBook Gratis' : 'Try OnePageBook for Free'}
                            </Link>
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4 opacity-80">
                            {currentLang === 'pt'
                                ? 'Sem Cadastro Complicado, Sem Spam. Apenas Leitura Rápida.'
                                : currentLang === 'es'
                                    ? 'Sin Registro Complicado, Sin Spam. Solo Lectura Rápida.'
                                    : 'No Complicated Sign-up, No Spam. Just Fast Reading.'}
                        </p>
                    </div>

                    {/* Share Section */}
                    <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                        <p className="text-muted-foreground font-medium">
                            {currentLang === 'pt' ? 'Gostou deste artigo?' : currentLang === 'es' ? '¿Te gustó este artículo?' : 'Liked this article?'}
                        </p>
                        <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                            <Share2 className="h-4 w-4" />
                            {currentLang === 'pt' ? 'Compartilhar' : currentLang === 'es' ? 'Compartir' : 'Share'}
                        </Button>
                    </div>
                </article>
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

export default BlogPost;

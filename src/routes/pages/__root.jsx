import { HeadContent, Scripts, createRootRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AnnouncementBar } from "@/components/common/AnnouncementBar";
import { StoreProvider } from "@/providers/StoreProvider";
import appCss from "@/styles/global.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark')?stored:'light';var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(mode);root.setAttribute('data-theme',mode);root.style.colorScheme=mode;}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kalamkari" }
    ],
    links: [
      { rel: "stylesheet", href: appCss }
    ]
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage
});

function NotFoundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-amber-800 dark:text-amber-400 font-semibold">404 Error</p>
      <h1 className="mt-4 font-serif text-4xl md:text-6xl text-foreground">Page Not Found</h1>
      <p className="mt-4 text-neutral-500 font-light max-w-md mx-auto leading-relaxed">
        The luxury edit or page you are looking for is currently unavailable or has been moved.
      </p>
      <div className="mt-8">
        <Link to="/" className="inline-block bg-[#1c2d27] text-[#f7f4ee] px-8 py-3.5 text-xs uppercase tracking-widest font-medium hover:bg-[#263e36] transition shadow-sm">
          Return to Atelier Home
        </Link>
      </div>
    </div>
  );
}

function RootDocument({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased selection:bg-amber-100 selection:text-amber-900 bg-background text-foreground min-h-screen flex flex-col">
        <StoreProvider>
          <AnnouncementBar />
          <SiteHeader />
          <main className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </StoreProvider>
        <Scripts />
      </body>
    </html>
  );
}

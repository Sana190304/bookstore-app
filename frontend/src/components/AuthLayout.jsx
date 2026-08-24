export default function AuthLayout({ children }) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* form panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>

      {/* illustration panel */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50 animate-gradient items-center justify-center">
        <div className="absolute w-72 h-72 bg-amber-300/25 rounded-full blur-3xl -top-10 -left-10" />
        <div className="absolute w-72 h-72 bg-amber-400/25 rounded-full blur-3xl bottom-0 right-0" />

        {/* twinkling sparkles scattered around */}
        <span className="absolute top-16 left-20 text-xl animate-twinkle">✨</span>
        <span
          className="absolute top-32 right-24 text-lg animate-twinkle"
          style={{ animationDelay: "0.6s" }}
        >
          ✨
        </span>
        <span
          className="absolute bottom-24 left-28 text-lg animate-twinkle"
          style={{ animationDelay: "1.2s" }}
        >
          ✨
        </span>
        <span
          className="absolute bottom-40 right-16 text-xl animate-twinkle"
          style={{ animationDelay: "1.8s" }}
        >
          ✨
        </span>

        <div className="relative text-center px-10 animate-fade-in-up">
          {/* stack of floating books, each drifting at its own pace */}
          <div className="flex justify-center items-end gap-3 mb-8 h-24">
            <span
              className="text-5xl animate-float"
              style={{ animationDuration: "3.4s", animationDelay: "0s" }}
            >
              📕
            </span>
            <span
              className="text-6xl animate-float"
              style={{ animationDuration: "2.6s", animationDelay: "0.3s" }}
            >
              📘
            </span>
            <span
              className="text-5xl animate-float"
              style={{ animationDuration: "3s", animationDelay: "0.6s" }}
            >
              📗
            </span>
          </div>

          <h2 className="font-display text-3xl text-stone-900 mb-3">
            Every great story
            <br />
            starts with a single page
          </h2>
          <p className="text-stone-600">
            Join BookNest and get access to hand-picked Fiction, Non-fiction &amp; Academic
            titles.
          </p>
        </div>
      </div>
    </div>
  );
}

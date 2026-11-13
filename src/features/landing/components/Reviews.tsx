import { Quote } from "lucide-react";

const reviews = [
  {
    quote:
      "The lessons made Hangul feel much easier to understand. I like having a clear structure and time to practise speaking at my own pace.",
    name: "Armaan",
    detail: "Korean learner",
    tone: "bg-[#dcebdd]",
  },
  {
    quote:
      "I enjoy learning useful expressions that I can bring into everyday conversations. The cultural examples make each lesson engaging and memorable.",
    name: "Stephan",
    detail: "Conversation practice",
    tone: "bg-[#f4e4d5]",
  },
  {
    quote:
      "The patient teaching style helps me stay motivated. I leave each lesson with a clearer understanding and a useful next step to practise.",
    name: "Nina",
    detail: "Korean learner",
    tone: "bg-[#e4e6f5]",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-24 mt-14 rounded-3xl bg-[#f2eee5] px-5 py-9 sm:px-8 sm:py-11">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Student reviews</span>
        <h3 className="mt-2">Small steps. Real progress.</h3>
        <p className="mt-3 text-sm text-muted">
          Draft review copy—please confirm each quote with the student before publishing.
        </p>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <article key={review.name} className="flex h-full flex-col rounded-2xl border border-border/80 bg-background p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-full bg-accent-background/50 text-primary">
                <Quote size={17} fill="currentColor" aria-hidden="true" />
              </span>
              <span className="ml-2 rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">Draft</span>
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-6 text-foreground">“{review.quote}”</blockquote>
            <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
              <span className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold text-primary ${review.tone}`} aria-hidden="true">
                {review.name.slice(0, 1)}
              </span>
              <div>
                <p className="text-sm font-semibold text-heading">{review.name}</p>
                <p className="text-xs text-muted">{review.detail}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

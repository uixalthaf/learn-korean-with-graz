import { Star } from "lucide-react";

const sampleReviews = [
  {
    quote:
      "Hangul finally started to make sense. Lessons feel structured, and there is always room to ask questions and practise speaking.",
    name: "Mina K.",
    detail: "Beginner learner",
    tone: "bg-[#dcebdd]",
  },
  {
    quote:
      "I used to freeze when forming a sentence. Practising everyday expressions one step at a time has made Korean feel much more approachable.",
    name: "Alex R.",
    detail: "Conversation practice",
    tone: "bg-[#f4e4d5]",
  },
  {
    quote:
      "The mix of grammar, culture, and gentle guidance keeps me motivated. I leave each lesson with something useful to practise.",
    name: "Priya S.",
    detail: "Continuing learner",
    tone: "bg-[#e4e6f5]",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-24 mt-14 rounded-3xl bg-[#f2eee5] px-5 py-9 sm:px-8 sm:py-11">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Learner stories</span>
        <h3 className="mt-2">Small steps. Real progress.</h3>
        <p className="mt-3 text-sm text-muted">
          Example testimonials for the page preview. Replace these with feedback from real students before publishing.
        </p>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {sampleReviews.map((review) => (
          <article key={review.name} className="flex h-full flex-col rounded-2xl border border-border/80 bg-background p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-1 text-[#c58b3a]" aria-label="Sample five star review">
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} size={15} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
              ))}
              <span className="ml-2 rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">Sample</span>
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

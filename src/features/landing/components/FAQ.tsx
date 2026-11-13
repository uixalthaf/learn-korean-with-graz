import { Plus } from "lucide-react";

const questions = [
  {
    question: "Can I start if I have never studied Korean before?",
    answer:
      "Absolutely. Beginner lessons start with Hangul and build from the basics, so you can learn at a steady pace without needing prior experience.",
  },
  {
    question: "What happens in a lesson?",
    answer:
      "Lessons combine clear explanations with practical examples and time to practise. As you progress, you can build toward everyday Korean conversations.",
  },
  {
    question: "Are lessons online?",
    answer:
      "Yes. Lessons take place online, with options for one-to-one or small-group learning.",
  },
  {
    question: "How do I get started?",
    answer:
      "Create a student account to get started. You can then connect with Graz and find the learning path that suits your goals.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="scroll-mt-24 mx-auto mt-14 max-w-3xl py-2">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">FAQ</span>
        <h3 className="mt-2">A few things you might be wondering</h3>
        <p className="mt-3 text-sm text-muted">A little more about learning Korean with Graz.</p>
      </div>

      <div className="mt-7 divide-y divide-border border-y border-border">
        {questions.map(({ question, answer }) => (
          <details key={question} className="group py-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-heading outline-none focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
              {question}
              <Plus size={18} aria-hidden="true" className="shrink-0 text-primary transition-transform group-open:rotate-45" />
            </summary>
            <p className="max-w-2xl pb-5 pr-8 text-sm leading-6 text-muted">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

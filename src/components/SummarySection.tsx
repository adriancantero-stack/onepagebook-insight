interface SummarySectionProps {
  title: string;
  content: string | string[];
}

export const SummarySection = ({ title, content }: SummarySectionProps) => {
  if (!content || (Array.isArray(content) && content.length === 0)) {
    return null;
  }

  const isArray = Array.isArray(content);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {isArray ? (
        <ul className="space-y-2">
          {(content as string[]).map((item: string, index: number) => (
            <li key={index} className="flex gap-3">
              <span className="text-primary font-bold shrink-0">{index + 1}.</span>
              <span className="text-justify hyphens-auto">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-foreground leading-relaxed whitespace-pre-wrap text-justify hyphens-auto">
          {content as string}
        </p>
      )}
    </section>
  );
};

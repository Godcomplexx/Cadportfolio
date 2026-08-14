/**
 * Splits text into per-word spans so each word can be revealed in sequence.
 *
 * The spans carry a `--word-index` custom property; the CSS turns that into a
 * staggered transition delay once the element gains `.is-visible` (handled by
 * the existing reveal observer in MotionSystem).
 */
export function Words({
  text,
  className,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag className={className} data-words data-reveal="words">
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          style={{ "--word-index": index } as React.CSSProperties}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

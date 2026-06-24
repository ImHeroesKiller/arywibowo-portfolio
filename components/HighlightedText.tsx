type HighlightedTextProps = {
  text: string;
  className?: string;
  as?: "span" | "p";
};

function parseHighlightedText(text: string) {
  const parts: Array<{ type: "text" | "highlight"; value: string }> = [];
  const regex = /<highlight>(.*?)<\/highlight>/g;
  let lastIndex = 0;
  let match = regex.exec(text);

  while (match !== null) {
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      parts.push({
        type: "text",
        value: text.slice(lastIndex, matchIndex),
      });
    }

    parts.push({ type: "highlight", value: match[1] });
    lastIndex = matchIndex + match[0].length;
    match = regex.exec(text);
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return parts;
}

export function HighlightedText({
  text,
  className,
  as: Component = "span",
}: HighlightedTextProps) {
  const parts = parseHighlightedText(text);

  if (parts.length === 0) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component className={className}>
      {parts.map((part, index) =>
        part.type === "highlight" ? (
          <span
            key={`${part.value}-${index}`}
            className="font-medium text-[#3b82f6]"
          >
            {part.value}
          </span>
        ) : (
          <span key={`${part.value}-${index}`}>{part.value}</span>
        )
      )}
    </Component>
  );
}
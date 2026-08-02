import { useMemo } from "react";

interface CodeHighlighterProps {
  code: string;
}

interface Token {
  type:
    "comment" | "string" | "keyword" | "function" | "number" | "tag" | "plain";
  value: string;
}

// Creates a fresh regex instance for lightweight TS/JS/CSS/HTML tokenizing
function createTokenRegex() {
  return /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\`|[^`])*`|"(?:\\"|[^"])*"|'(?:\\'|[^'])*')|(\b(?:const|let|var|function|return|if|else|try|catch|async|await|import|export|from|interface|type|new|this|typeof|instanceof|true|false|null|undefined|for|while|switch|case|break|continue|default|@keyframes|@container)\b)|(<\/?[\w$-]+(?:\s+[\w$-]+(?:=(?:"[^"]*"|'[^']*'|{[^}]*}))?)*\s*\/?>)|(\b[a-zA-Z_$][\w$]*(?=\s*\())|(\b\d+(?:\.\d+)?\b)/g;
}

export default function CodeHighlighter({ code }: CodeHighlighterProps) {
  const tokenizedLines = useMemo(() => {
    const lines = code.split("\n");
    return lines.map((line) => {
      const tokens: Token[] = [];
      let lastIndex = 0;
      const regex = createTokenRegex();

      let match: RegExpExecArray | null;
      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          tokens.push({
            type: "plain",
            value: line.slice(lastIndex, match.index),
          });
        }

        const [full, comment, str, keyword, tag, fn, num] = match;

        if (comment) {
          tokens.push({ type: "comment", value: full });
        } else if (str) {
          tokens.push({ type: "string", value: full });
        } else if (keyword) {
          tokens.push({ type: "keyword", value: full });
        } else if (tag) {
          tokens.push({ type: "tag", value: full });
        } else if (fn) {
          tokens.push({ type: "function", value: full });
        } else if (num) {
          tokens.push({ type: "number", value: full });
        } else {
          tokens.push({ type: "plain", value: full });
        }

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < line.length) {
        tokens.push({ type: "plain", value: line.slice(lastIndex) });
      }

      return tokens;
    });
  }, [code]);

  return (
    <pre className="m-0 font-mono text-xs leading-relaxed whitespace-pre">
      <code>
        {tokenizedLines.map((lineTokens, lineIdx) => (
          <div key={lineIdx} className="table-row">
            <span className="table-cell pr-3 text-right text-[#475569] select-none">
              {lineIdx + 1}
            </span>
            <span className="table-cell">
              {lineTokens.length === 0
                ? "\n"
                : lineTokens.map((token, tokIdx) => {
                    switch (token.type) {
                      case "comment":
                        return (
                          <span key={tokIdx} className="italic text-[#94a3b8]">
                            {token.value}
                          </span>
                        );
                      case "string":
                        return (
                          <span key={tokIdx} className="text-[#34d399]">
                            {token.value}
                          </span>
                        );
                      case "keyword":
                        return (
                          <span
                            key={tokIdx}
                            className="font-semibold text-[#c084fc]"
                          >
                            {token.value}
                          </span>
                        );
                      case "function":
                        return (
                          <span key={tokIdx} className="text-[#38bdf8]">
                            {token.value}
                          </span>
                        );
                      case "tag":
                        return (
                          <span key={tokIdx} className="text-[#f472b6]">
                            {token.value}
                          </span>
                        );
                      case "number":
                        return (
                          <span key={tokIdx} className="text-[#fb923c]">
                            {token.value}
                          </span>
                        );
                      default:
                        return <span key={tokIdx}>{token.value}</span>;
                    }
                  })}
            </span>
          </div>
        ))}
      </code>
    </pre>
  );
}

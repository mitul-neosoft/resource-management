"use client";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <div className="bg-[#1E1E2E] rounded-xl overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
        {["#FF5F57", "#FFBD2E", "#28CA41"].map((c) => (
          <span
            key={c}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: c }}
          />
        ))}
        <span className="text-white/30 text-xs ml-2 font-mono">solution.js</span>
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-none outline-none text-[#CDD6F4] text-sm font-mono leading-relaxed resize-none p-4 min-h-[180px]"
        spellCheck={false}
      />
    </div>
  );
}
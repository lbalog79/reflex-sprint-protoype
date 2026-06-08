import { memo, useCallback, useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  value: string;
  onCommit: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  type?: "text" | "date" | "url";
};

function FieldInner({ label, value, onCommit, placeholder, multiline, rows = 3, maxLength, type = "text" }: Props) {
  const [draft, setDraft] = useState(value || "");
  const last = useRef(value || "");

  useEffect(() => {
    if ((value || "") !== last.current) {
      setDraft(value || "");
      last.current = value || "";
    }
  }, [value]);

  const onChange = useCallback((e: any) => setDraft(e.target.value), []);
  const onBlur = useCallback(() => {
    last.current = draft;
    onCommit(draft);
  }, [draft, onCommit]);

  const common = {
    value: draft,
    onChange,
    onBlur,
    placeholder,
    maxLength,
    className:
      "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/25",
  };

  return (
    <label className="block text-sm mb-3">
      <span className="block mb-1 font-medium text-slate-700">{label}</span>
      {multiline ? <textarea rows={rows} {...common} /> : <input type={type} {...common} />}
    </label>
  );
}

export const TextField = memo(FieldInner);

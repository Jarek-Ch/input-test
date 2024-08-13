"use client";

import { useState, useEffect, useRef } from "react";

// Istnieje prawdopodobieństwo 10^(-size) że uuid się powtórzy
const generateID = (size: number = 9) => {
  return String(Math.random()).slice(-size);
};

const Test = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [log, setLog] = useState<string[]>([]);
  const [val, setVal] = useState<string>("");
  const [handleKeys, setHandleKeys] = useState<boolean>(false);

  const handleEvent =
    (name: string) =>
    (
      e:
        | React.KeyboardEvent<HTMLInputElement>
        | React.ClipboardEvent<HTMLInputElement>
        | KeyboardEvent
    ) => {
      if ("key" in e) {
        setLog((prev) => [
          ...prev,
          `
            <strong>${name}</strong> (${e.type})<br/>
            key:${e.key} code:${e.code} keyCode:${e.keyCode} charCode:${e.charCode} which:${e.which}
          `,
        ]);
        return;
      }

      const clipboardData = e.clipboardData?.getData("text");

      setLog((prev) => [
        ...prev,
        `
          <strong>${name}</strong> (${e.type})<br/>
          clipboardData:${clipboardData} types:${e.clipboardData?.types}
        `,
      ]);
    };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!handleKeys) return;
      handleEvent("onKeyDown")(e);
    };

    const onTextInput = (e: unknown) => {
      var char = e?.data; // In our example = "a"
      var keyCode = char.charCodeAt(0); // a = 97

      setLog((prev) => [
        ...prev,
        `<strong>onTextInput</strong><br/>
        char:${char} keyCode:${keyCode}
        `,
      ]);
    };

    document.addEventListener("keydown", handler);
    inputRef.current?.addEventListener("textInput", onTextInput);
    return () => {
      document.removeEventListener("keydown", handler);
      document.removeEventListener("textInput", onTextInput);

    };
  }, [handleKeys]);

  return (
    <>
      <div className="flex gap-2">
        <input
          type="number"
          maxLength={1}
          className={`
          h-10 w-[20rem] max-w-full border-b-2
          text-center font-montserrat
          text-2xl font-semibold text-black outline-none
          [appearance:textfield]
          [&::-webkit-inner-spin-button]:appearance-none
          [&::-webkit-outer-spin-button]:appearance-none
          rounded
        `}
          pattern="\d"
          min="0"
          value={val}
          inputMode="numeric"
          onKeyPress={handleEvent("onKeyPress")}
          onKeyUp={handleEvent("onKeyUp")}
          onKeyDown={handleEvent("onKeyDown")}
          onPaste={handleEvent("onPaste")}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setVal(e.target.value);
            setLog((prev) => [
              ...prev,
              `
                <strong>onChange</strong><br/>
                value:${e.target.value}
              `,
            ]);
          }}
          onFocus={() => setHandleKeys(true)}
          onBlur={() => setHandleKeys(false)}
          ref={inputRef}
        />
        <button
          className="border b-white rounded p-2 text-xs"
          onClick={() => {
            setLog([]);
            setVal("");
          }}
        >
          Clear
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-2 text-xs">
        {log.toReversed().map((l, i) => (
          <div key={generateID()} dangerouslySetInnerHTML={{ __html: l }} />
        ))}
      </div>
    </>
  );
};

export default Test;

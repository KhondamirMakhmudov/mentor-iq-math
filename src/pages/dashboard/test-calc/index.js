"use client";

import React, { useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const PowerInput = () => {
  const [expression, setExpression] = useState("");
  const [base, setBase] = useState("");
  const [exponent, setExponent] = useState("");
  const [showPowerInput, setShowPowerInput] = useState(false);

  const handlePowerInsert = () => {
    if (base && exponent) {
      setExpression((prev) => prev + `(${base})^{${exponent}}`);
      setBase("");
      setExponent("");
      setShowPowerInput(false);
    }
  };

  return (
    <MathJaxContext>
      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Ifoda ko'rsatish */}
        <div className="border p-3 min-h-[50px] text-xl bg-gray-100 rounded">
          <MathJax>{`\\(${expression}\\)`}</MathJax>
        </div>

        {/* Daraja kiritish inputlari */}
        {showPowerInput && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Asos (masalan 2)"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              className="border p-2 w-24 text-center rounded"
            />
            <span className="text-xl">^</span>
            <input
              type="text"
              placeholder="Daraja (masalan 3)"
              value={exponent}
              onChange={(e) => setExponent(e.target.value)}
              className="border p-2 w-24 text-center rounded"
            />
            <button
              onClick={handlePowerInsert}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              Qo‘shish
            </button>
          </div>
        )}

        {/* Daraja tugmasi */}
        <button
          onClick={() => setShowPowerInput(true)}
          className="w-[60px] h-[60px] flex items-center justify-center bg-gray-100 rounded shadow hover:bg-gray-200"
        >
          <MathJax>{`\\(x^y\\)`}</MathJax>
        </button>

        {/* Tozalash tugmasi */}
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
          onClick={() => setExpression("")}
        >
          Tozalash
        </button>
      </div>
    </MathJaxContext>
  );
};

export default PowerInput;

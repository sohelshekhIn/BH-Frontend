"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { BUFFER_MIN, BUFFER_MAX, BUFFER_DEFAULT, BUFFER_STEP } from "@/lib/constants";

interface BufferSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function BufferSlider({ value, onChange }: BufferSliderProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const numVal = parseFloat(val);
    if (!isNaN(numVal) && numVal >= BUFFER_MIN && numVal <= BUFFER_MAX) {
      onChange(numVal);
    }
  };

  const handleInputBlur = () => {
    const numVal = parseFloat(inputValue);
    if (isNaN(numVal) || numVal < BUFFER_MIN) {
      onChange(BUFFER_MIN);
    } else if (numVal > BUFFER_MAX) {
      onChange(BUFFER_MAX);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Buffer Distance</label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min={BUFFER_MIN}
            max={BUFFER_MAX}
            step={BUFFER_STEP}
            className="w-20 h-8 text-sm"
          />
          <span className="text-sm text-muted-foreground">km</span>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        min={BUFFER_MIN}
        max={BUFFER_MAX}
        step={BUFFER_STEP}
        className="w-full"
      />
      <p className="text-xs text-muted-foreground">
        Adjust based on land ownership and operational area
      </p>
    </div>
  );
}


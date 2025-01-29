import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

interface ParameterInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function ParameterInput({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.1
}: ParameterInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-20 text-right"
          min={min}
          max={max}
          step={step}
        />
      </div>
      <Slider
        value={[value]}
        onValueChange={([val]) => onChange(val)}
        min={min}
        max={max}
        step={step}
        className="mt-2"
      />
    </div>
  );
}
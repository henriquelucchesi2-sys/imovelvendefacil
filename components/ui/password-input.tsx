"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PasswordInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  showStrength?: boolean;
}

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, color: "bg-red-500" };
  if (score === 2) return { level: 2, color: "bg-orange-500" };
  if (score === 3) return { level: 3, color: "bg-yellow-500" };
  return { level: 4, color: "bg-green-500" };
}

export function PasswordInput({
  id = "password",
  value,
  onChange,
  placeholder = "********",
  required = false,
  minLength,
  showStrength = false,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const strength = getStrength(value);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={minLength}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {showStrength && value.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  level <= strength.level ? strength.color : "bg-muted"
                }`}
              />
            ))}
          </div>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li className={value.length >= 8 ? "text-green-600" : ""}>
              {value.length >= 8 ? "✓" : "○"} Mínimo 8 caracteres
            </li>
            <li className={/[A-Z]/.test(value) ? "text-green-600" : ""}>
              {/[A-Z]/.test(value) ? "✓" : "○"} Uma letra maiúscula
            </li>
            <li className={/[a-z]/.test(value) ? "text-green-600" : ""}>
              {/[a-z]/.test(value) ? "✓" : "○"} Uma letra minúscula
            </li>
            <li className={/[0-9]/.test(value) ? "text-green-600" : ""}>
              {/[0-9]/.test(value) ? "✓" : "○"} Um número
            </li>
            <li className={/[^A-Za-z0-9]/.test(value) ? "text-green-600" : ""}>
              {/[^A-Za-z0-9]/.test(value) ? "✓" : "○"} Um caractere especial
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

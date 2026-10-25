import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/** Label + control + hint/error wrapper shared by every generator form. */
export function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          data-ocid={`${id}.error_state`}
          className="text-sm text-destructive"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  type?: string;
  inputMode?: "text" | "url" | "email" | "tel" | "numeric" | "decimal";
  autoComplete?: string;
  className?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  required,
  type = "text",
  inputMode,
  autoComplete,
  className,
}: TextFieldProps) {
  return (
    <Field
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <Input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        data-ocid={`${id}.input`}
        className="h-11 rounded-xl border-input bg-background/80"
      />
    </Field>
  );
}

interface TextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  rows?: number;
  className?: string;
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  required,
  rows = 4,
  className,
}: TextAreaFieldProps) {
  return (
    <Field
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <Textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        data-ocid={`${id}.textarea`}
        className="rounded-xl border-input bg-background/80"
      />
    </Field>
  );
}

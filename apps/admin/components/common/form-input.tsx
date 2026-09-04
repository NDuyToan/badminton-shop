"use client";

import * as React from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  type UseFormClearErrors,
  useController,
  useFormContext,
} from "react-hook-form";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface FormInputBaseProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: string;
  label?: React.ReactNode;
  description?: string;
  requiredIndicator?: boolean;
  clearErrorOnChange?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  inputClassName?: string;
  showPasswordToggle?: boolean;
}

export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<FormInputBaseProps, "name"> {
  name: TName | string;
  control?: Control<TFieldValues>;
  clearErrors?: UseFormClearErrors<TFieldValues>;
  error?: string;
}

interface FormInputFieldViewProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: string;
  label?: React.ReactNode;
  description?: string;
  requiredIndicator?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  inputClassName?: string;
  showPasswordToggle?: boolean;
  error?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

function FormInputFieldView({
  id,
  name,
  label,
  description,
  requiredIndicator,
  leftIcon,
  rightIcon,
  containerClassName,
  labelClassName,
  errorClassName,
  inputClassName,
  showPasswordToggle = true,
  type = "text",
  error,
  inputRef,
  value,
  onChange,
  onBlur,
  required,
  ...props
}: FormInputFieldViewProps) {
  const generatedId = React.useId();
  const inputId = id || `${name}-${generatedId}`;
  const [showPassword, setShowPassword] = React.useState(false);

  const hasError = Boolean(error);
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={cn("w-full space-y-1.5", containerClassName)}>
      {/* Label */}
      {label && (
        <Label
          htmlFor={inputId}
          requiredIndicator={requiredIndicator || required}
          className={cn(
            "block text-sm font-medium transition-colors",
            hasError
              ? "text-red-600 dark:text-red-400"
              : "text-zinc-700 dark:text-zinc-300",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}

      {/* Input container */}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500 [&_svg]:size-4">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={actualType}
          name={name}
          ref={inputRef}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${inputId}-error`
              : description
              ? `${inputId}-description`
              : undefined
          }
          className={cn(
            "flex h-10 w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500",
            leftIcon && "pl-9",
            (rightIcon || (isPassword && showPasswordToggle)) && "pr-10",
            hasError
              ? "border-red-500 text-red-900 placeholder:text-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20 dark:border-red-500 dark:text-red-200 dark:placeholder-zinc-600 dark:focus-visible:ring-red-500/30"
              : "border-zinc-300 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-zinc-700 dark:focus-visible:border-indigo-400 dark:focus-visible:ring-indigo-500/20",
            inputClassName
          )}
          required={required}
          {...props}
        />

        {/* Password toggle button */}
        {isPassword && showPasswordToggle ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 p-0.5 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 focus:outline-none transition-colors cursor-pointer"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        ) : rightIcon ? (
          <div className="absolute right-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500 [&_svg]:size-4">
            {rightIcon}
          </div>
        ) : null}
      </div>

      {/* Error Message */}
      {hasError ? (
        <p
          id={`${inputId}-error`}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 animate-in fade-in-50 duration-200",
            errorClassName
          )}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : description ? (
        <p
          id={`${inputId}-description`}
          className="text-xs text-zinc-500 dark:text-zinc-400"
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

// Sub-component for React Hook Form Controller usage
function RHFFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  clearErrors: manualClearErrors,
  clearErrorOnChange = true,
  error: manualError,
  onChange: manualOnChange,
  onBlur: manualOnBlur,
  ...props
}: FormInputProps<TFieldValues, TName> & { control: Control<TFieldValues> }) {
  const fieldName = name as FieldPath<TFieldValues>;
  const { field, fieldState } = useController({
    name: fieldName,
    control,
  });
  const formContext = useFormContext<TFieldValues>();

  const rawErrorMessage = manualError || fieldState.error?.message;
  const [prevRawError, setPrevRawError] = React.useState<string | undefined>(rawErrorMessage);
  const [dismissedByTyping, setDismissedByTyping] = React.useState(false);

  // Synchronize state during render when a new error occurs (standard React 19 pattern without useEffect)
  if (rawErrorMessage !== prevRawError) {
    setPrevRawError(rawErrorMessage);
    setDismissedByTyping(false);
  }

  const activeError = dismissedByTyping ? undefined : rawErrorMessage;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (clearErrorOnChange) {
      setDismissedByTyping(true);

      const clearFn = manualClearErrors || formContext?.clearErrors;
      if (clearFn) {
        clearFn(fieldName);
      }
    }
    field.onChange(e);
    manualOnChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur();
    manualOnBlur?.(e);
  };

  return (
    <FormInputFieldView
      name={String(name)}
      inputRef={field.ref}
      value={field.value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={activeError}
      {...props}
    />
  );
}

// Standalone input without RHF controller
function StandaloneFormInput({
  name,
  clearErrorOnChange = true,
  error: manualError,
  onChange: manualOnChange,
  ...props
}: FormInputProps) {
  const [prevManualError, setPrevManualError] = React.useState<string | undefined>(manualError);
  const [dismissedError, setDismissedError] = React.useState(false);

  if (manualError !== prevManualError) {
    setPrevManualError(manualError);
    setDismissedError(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (clearErrorOnChange && manualError) {
      setDismissedError(true);
    }
    manualOnChange?.(e);
  };

  const activeError = dismissedError ? undefined : manualError;

  return (
    <FormInputFieldView
      name={String(name)}
      onChange={handleChange}
      error={activeError}
      {...props}
    />
  );
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ control, ...props }: FormInputProps<TFieldValues, TName>) {
  const formContext = useFormContext<TFieldValues>();
  const effectiveControl = control || formContext?.control;

  if (effectiveControl) {
    return (
      <RHFFormInput
        {...(props as FormInputProps<TFieldValues, TName>)}
        control={effectiveControl}
      />
    );
  }

  return <StandaloneFormInput {...(props as FormInputProps)} />;
}

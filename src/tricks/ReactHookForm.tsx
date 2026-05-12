import { useMemo, useState, type ReactNode } from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  type UseFormRegister,
  useForm,
  useWatch,
} from "react-hook-form";

type ProjectFormValues = {
  name: string;
  email: string;
  companySize: "solo" | "team" | "enterprise";
  budget: string;
  timeline: string;
  goals: string[];
  notes: string;
  terms: boolean;
};

// Shared option shape keeps select, radio, and checkbox controls consistent.
type Option = {
  label: string;
  value: string;
};

const companySizeOptions: Option[] = [
  { label: "Solo founder", value: "solo" },
  { label: "Product team", value: "team" },
  { label: "Enterprise", value: "enterprise" },
];

const budgetOptions: Option[] = [
  { label: "Under $10k", value: "under-10k" },
  { label: "$10k - $50k", value: "10k-50k" },
  { label: "$50k+", value: "50k-plus" },
];

const timelineOptions: Option[] = [
  { label: "This month", value: "month" },
  { label: "This quarter", value: "quarter" },
  { label: "Flexible", value: "flexible" },
];

const goalOptions: Option[] = [
  { label: "Prototype", value: "prototype" },
  { label: "Design system", value: "design-system" },
  { label: "Analytics", value: "analytics" },
];

const defaultValues: ProjectFormValues = {
  name: "",
  email: "",
  companySize: "team",
  budget: "",
  timeline: "quarter",
  goals: ["prototype"],
  notes: "",
  terms: false,
};

// Pulls a displayable error message from React Hook Form's nested error map.
function getErrorMessage<TFormValues extends FieldValues>(
  errors: FieldErrors<TFormValues>,
  name: FieldPath<TFormValues>,
) {
  const error = name.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[segment];
  }, errors);

  if (!error || typeof error !== "object" || !("message" in error)) {
    return undefined;
  }

  return typeof error.message === "string" ? error.message : undefined;
}

// Shared wrapper keeps label and validation styling out of individual controls.
function FieldShell({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-normal text-text-tertiary">
        {label}
      </span>
      {children}
      {error ? (
        <span className="text-xs font-medium text-rose-600">{error}</span>
      ) : null}
    </label>
  );
}

// Uses register because native inputs can stay uncontrolled for better RHF perf.
function TextInput<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
>({
  label,
  name,
  type = "text",
  placeholder,
  register,
  rules,
  errors,
}: {
  label: string;
  name: TName;
  type?: "email" | "text";
  placeholder: string;
  register: UseFormRegister<TFormValues>;
  rules?: RegisterOptions<TFormValues, TName>;
  errors: FieldErrors<TFormValues>;
}) {
  return (
    <FieldShell label={label} error={getErrorMessage(errors, name)}>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-zinc-500"
      />
    </FieldShell>
  );
}

// Native textarea follows the same uncontrolled register pattern as TextInput.
function TextArea<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
>({
  label,
  name,
  placeholder,
  register,
}: {
  label: string;
  name: TName;
  placeholder: string;
  register: UseFormRegister<TFormValues>;
}) {
  return (
    <FieldShell label={label}>
      <textarea
        rows={4}
        placeholder={placeholder}
        {...register(name)}
        className="resize-none rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-zinc-500"
      />
    </FieldShell>
  );
}

// Native select can use register directly when it does not need custom state.
function SelectField<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
>({
  label,
  name,
  register,
  rules,
  options,
  errors,
}: {
  label: string;
  name: TName;
  register: UseFormRegister<TFormValues>;
  rules?: RegisterOptions<TFormValues, TName>;
  options: Option[];
  errors: FieldErrors<TFormValues>;
}) {
  return (
    <FieldShell label={label} error={getErrorMessage(errors, name)}>
      <select
        {...register(name, rules)}
        className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-zinc-500"
      >
        <option value="">Select one</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

// Controller bridges custom controlled UI to React Hook Form's form state.
function RadioGroup<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
>({
  label,
  name,
  control,
  options,
}: {
  label: string;
  name: TName;
  control: Control<TFormValues>;
  options: Option[];
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
          <legend className="text-xs font-semibold uppercase tracking-normal text-text-tertiary">
            {label}
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {options.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-2 py-2 text-center text-xs font-semibold transition-colors ${
                  field.value === option.value
                    ? "border-zinc-800 bg-zinc-900 text-white"
                    : "border-border bg-card text-text-secondary hover:text-text-primary"
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  checked={field.value === option.value}
                  onChange={() => field.onChange(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}
    />
  );
}

// Stores selected option values as a string array through a controlled wrapper.
function CheckboxGroup<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
>({
  label,
  name,
  control,
  options,
  errors,
}: {
  label: string;
  name: TName;
  control: Control<TFormValues>;
  options: Option[];
  errors: FieldErrors<TFormValues>;
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value) =>
          (Array.isArray(value) && value.length > 0) || "Choose one goal.",
      }}
      render={({ field }) => (
        <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
          <legend className="text-xs font-semibold uppercase tracking-normal text-text-tertiary">
            {label}
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {options.map((option) => {
              // Generic fields can be any value; normalize before array updates.
              const value: string[] = Array.isArray(field.value)
                ? field.value.filter(
                    (item: unknown): item is string => typeof item === "string",
                  )
                : [];
              const isChecked = value.includes(option.value);

              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center justify-center rounded-xl border px-2 py-2 text-center text-xs font-semibold transition-colors ${
                    isChecked
                      ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                      : "border-border bg-card text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(event) => {
                      const next = event.target.checked
                        ? [...value, option.value]
                        : value.filter((item) => item !== option.value);

                      field.onChange(next);
                    }}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
          {getErrorMessage(errors, name) ? (
            <span className="text-xs font-medium text-rose-600">
              {getErrorMessage(errors, name)}
            </span>
          ) : null}
        </fieldset>
      )}
    />
  );
}

// Handles custom boolean checkboxes while still accepting app-specific rules.
function BooleanCheckbox<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
>({
  label,
  name,
  control,
  rules,
  errors,
}: {
  label: string;
  name: TName;
  control: Control<TFormValues>;
  rules?: RegisterOptions<TFormValues, TName>;
  errors: FieldErrors<TFormValues>;
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <div className="flex flex-col gap-1">
          <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-border bg-card p-3 text-sm">
            <input
              type="checkbox"
              checked={Boolean(field.value)}
              onChange={(event) => field.onChange(event.target.checked)}
              className="mt-1 h-4 w-4 accent-zinc-900"
            />
            <span className="text-text-secondary">{label}</span>
          </label>
          {getErrorMessage(errors, name) ? (
            <span className="text-xs font-medium text-rose-600">
              {getErrorMessage(errors, name)}
            </span>
          ) : null}
        </div>
      )}
    />
  );
}

// Watches current form values without converting every input to local React state.
function LiveSummary({ control }: { control: Control<ProjectFormValues> }) {
  const values = useWatch({ control });
  const selectedGoals = values.goals ?? [];

  const filledFields = useMemo(() => {
    return [
      values.name,
      values.email,
      values.budget,
      values.notes,
      values.terms ? "accepted" : "",
      selectedGoals.length ? "goals" : "",
    ].filter(Boolean).length;
  }, [
    selectedGoals.length,
    values.budget,
    values.email,
    values.name,
    values.notes,
    values.terms,
  ]);

  return (
    <aside className="flex flex-col gap-3 rounded-2xl border border-border bg-zinc-50 p-4">
      <div>
        <h4 className="m-0 text-sm font-bold">Live form state</h4>
        <p className="m-0 text-xs text-text-secondary">
          `useWatch` keeps this preview in sync without wiring every input to
          local state.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-white p-3">
          <span className="block text-text-tertiary">Completed</span>
          <strong className="text-lg tabular-nums">{filledFields}/6</strong>
        </div>
        <div className="rounded-xl bg-white p-3">
          <span className="block text-text-tertiary">Timeline</span>
          <strong>{values.timeline || "Unset"}</strong>
        </div>
      </div>

      <pre className="m-0 max-h-56 overflow-auto rounded-xl bg-zinc-900 p-3 text-[11px] leading-relaxed text-zinc-100">
        {JSON.stringify(values, null, 2)}
      </pre>
    </aside>
  );
}

export default function ReactHookFormDemo() {
  const [submittedValues, setSubmittedValues] =
    useState<ProjectFormValues | null>(null);
  const {
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    handleSubmit,
    register,
    reset,
  } = useForm<ProjectFormValues>({
    // The form itself is strongly typed, but the field components remain generic.
    defaultValues,
    mode: "onBlur",
  });

  // The submit handler receives validated, typed values from react-hook-form.
  const onSubmit = (values: ProjectFormValues) => {
    setSubmittedValues(values);
  };

  return (
    <div className="w-[760px] max-w-full rounded-2xl border border-border bg-white p-5">
      <div className="mb-5">
        <h3 className="m-0 font-display text-xl font-bold">React Hook Form</h3>
        <p className="m-0 mt-1 max-w-[620px] text-sm text-text-secondary">
          A project intake form built from wrapped field components while React
          Hook Form owns registration, validation, and submission state.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_280px]">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput
              label="Name"
              name="name"
              placeholder="Mina Tanaka"
              register={register}
              rules={{ required: "Name is required." }}
              errors={errors}
            />
            <TextInput
              label="Email"
              name="email"
              type="email"
              placeholder="mina@example.com"
              register={register}
              rules={{
                required: "Email is required.",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email.",
                },
              }}
              errors={errors}
            />
          </div>

          <RadioGroup
            label="Company size"
            name="companySize"
            control={control}
            options={companySizeOptions}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField
              label="Budget"
              name="budget"
              register={register}
              rules={{ required: "Budget is required." }}
              options={budgetOptions}
              errors={errors}
            />
            <SelectField
              label="Timeline"
              name="timeline"
              register={register}
              options={timelineOptions}
              errors={errors}
            />
          </div>

          <CheckboxGroup
            label="Project goals"
            name="goals"
            control={control}
            options={goalOptions}
            errors={errors}
          />

          <TextArea
            label="Project notes"
            name="notes"
            placeholder="What should this product help your users do?"
            register={register}
          />

          <BooleanCheckbox
            label="I can be contacted about this project request."
            name="terms"
            control={control}
            rules={{ validate: (value) => value || "Approval is required." }}
            errors={errors}
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              Submit request
            </button>
            <button
              type="button"
              onClick={() => {
                reset(defaultValues);
                setSubmittedValues(null);
              }}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-zinc-100"
            >
              Reset
            </button>
          </div>
        </form>

        <LiveSummary control={control} />
      </div>

      {isSubmitSuccessful && submittedValues ? (
        <div
          role="status"
          className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          Request saved for {submittedValues.name} with{" "}
          {submittedValues.goals.length} selected goal
          {submittedValues.goals.length === 1 ? "" : "s"}.
        </div>
      ) : null}
    </div>
  );
}

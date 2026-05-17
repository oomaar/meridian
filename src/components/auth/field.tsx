type FieldProps = {
  label: string;
  type?: "text" | "email" | "password";
  defaultValue?: string;
  placeholder?: string;
  name?: string;
  autoComplete?: string;
};

export function Field({
  label,
  type = "text",
  defaultValue,
  placeholder,
  name,
  autoComplete,
}: FieldProps) {
  return (
    <label className="m-field">
      <span className="m-field__label">{label}</span>
      <input
        className="m-field__input"
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        name={name}
        autoComplete={autoComplete}
      />
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  name?: string;
  defaultValue?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
};

export function SelectField({
  label,
  name,
  defaultValue,
  options,
}: SelectFieldProps) {
  return (
    <label className="m-field">
      <span className="m-field__label">{label}</span>
      <select
        className="m-field__input m-field__select"
        name={name}
        defaultValue={defaultValue}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

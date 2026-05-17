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

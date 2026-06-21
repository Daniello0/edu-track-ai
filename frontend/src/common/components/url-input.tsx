import './url-input.styles.css';

interface UrlInputProps {
  value: string;
  placeholder: string;
  error?: string | null;
  disabled?: boolean;
  onChange: (value: string) => void;
}

/**
 * Text input for YouTube video URLs.
 */
export function UrlInput({
  value,
  placeholder,
  error,
  disabled = false,
  onChange,
}: UrlInputProps) {
  return (
    <div className="url-input-wrapper">
      <input
        id="video-url"
        type="url"
        className="url-input-field"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'video-url-error' : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id="video-url-error" className="url-input-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

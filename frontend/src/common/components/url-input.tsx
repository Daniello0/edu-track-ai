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
      <label className="url-input-label" htmlFor="video-url">
        Ссылка на видео
      </label>
      <input
        id="video-url"
        type="url"
        className="url-input-field"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <p className="url-input-error">{error}</p> : null}
    </div>
  );
}

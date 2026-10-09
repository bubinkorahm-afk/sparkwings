/** Four-point sparkle star — accent-2 by default. Decorative. */
interface SparkleProps {
  size?: number;
  className?: string;
  color?: string;
}

export function Sparkle({ size = 20, className, color = 'var(--accent-2)' }: SparkleProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M12 0C12.9 7.2 16.8 11.1 24 12C16.8 12.9 12.9 16.8 12 24C11.1 16.8 7.2 12.9 0 12C7.2 11.1 11.1 7.2 12 0Z" fill={color} />
    </svg>
  );
}

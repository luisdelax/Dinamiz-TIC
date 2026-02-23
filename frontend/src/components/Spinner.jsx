export default function Spinner({ size = 5 }) {
  return (
    <div
      className={`w-${size} h-${size} border-2 border-white/40 border-t-white rounded-full animate-spin`}
    />
  );
}

export default function Logo({ className = 'logo' }) {
  return (
    <img
      src="/logo.png"
      alt="GB logo"
      className={className}
      onError={(event) => {
        event.currentTarget.style.display = 'none';
      }}
    />
  );
}

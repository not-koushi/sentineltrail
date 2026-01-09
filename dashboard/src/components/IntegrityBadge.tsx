interface Props {
  valid: boolean;
}

export default function IntegrityBadge({ valid }: Props) {
  return (
    <span className={valid ? "badge ok" : "badge fail"}>
      {valid ? "✔ Integrity OK" : "✖ Integrity Failed"}
    </span>
  );
}
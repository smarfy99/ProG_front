// Chip.tsx
interface ChipProps {
  label: string;
  color: string;
}

const Chip: React.FC<ChipProps> = ({ label, color }) => {
  return (
    <span className={`inline-block px-3 py-1 text-sm ml-1 font-semibold text-white rounded-full ${color}`}>
      {label}
    </span>
  );
};

export default Chip;

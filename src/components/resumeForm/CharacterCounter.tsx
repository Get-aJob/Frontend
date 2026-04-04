import {
  useWatch,
  type Control,
  type FieldPath,
  type FieldValues,
  type PathValue,
} from 'react-hook-form';

interface CharacterCounterProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  limit: number;
}

const CharacterCounter = <T extends FieldValues>({
  control,
  name,
  limit,
}: CharacterCounterProps<T>) => {
  const value = useWatch({
    control,
    name,
    defaultValue: '' as PathValue<T, FieldPath<T>>,
  });

  return (
    <p className="hidden group-has-[textarea:focus]:block mt-2 text-[12px] font-medium text-end">
      <span className="text-btn-point">{value.length}</span>
      <span className="text-gray-400"> / {limit} 자</span>
    </p>
  );
};

export default CharacterCounter;

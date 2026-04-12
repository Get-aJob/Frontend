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
    <p className="hidden group-has-[textarea:focus]:block mt-2 w-full text-end text-xs font-semibold text-gray-400">
      {value.length}
      <span className="text-gray-300"> / {limit}</span>
    </p>
  );
};

export default CharacterCounter;

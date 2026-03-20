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
  limit?: number;
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
    <p className="hidden group-has-[textarea:focus]:block mt-10 w-full text-end">
      {value.length}
      <span className="text-black/40"> / {limit}</span>
    </p>
  );
};

export default CharacterCounter;

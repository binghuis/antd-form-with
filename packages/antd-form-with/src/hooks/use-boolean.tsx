/** https://usehooks-ts.com/react-hook/use-boolean */
import { Dispatch, SetStateAction, useCallback, useState } from "react";

interface UseBooleanOutput {
  state: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
}

function useBoolean(defaultValue?: boolean): UseBooleanOutput {
  const [state, setValue] = useState(!!defaultValue);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((x) => !x), []);

  return { state, setValue, setTrue, setFalse, toggle };
}

export default useBoolean;

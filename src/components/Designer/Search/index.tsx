import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  applyQuery,
  selectQuery,
  setQuery,
} from '@/redux/designer/slice/accordianSlice';

function Search() {
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectQuery);

  const [input, setInput] = useState(query ?? '');
  const [debouncedInput, setDebouncedInput] = useState(query ?? '');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedInput(input);
    }, 100);

    return () => {
      clearTimeout(timerId);
    };
  }, [input]);

  useEffect(() => {
    if (debouncedInput !== undefined && debouncedInput !== null) {
      dispatch(setQuery(debouncedInput));
      dispatch(applyQuery());
    }
  }, [debouncedInput]);

  return (
    <div className="w-full flex flex-row justify-start mt-1">
      <input
        type="text"
        className="input input-bordered input-xs w-11/12 w-xs bg-transparent rounded-sm ml-2 italic"
        placeholder="Starting with..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
}

export default Search;

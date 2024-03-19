'use client';

import TextInputWithSearchButton from '@/components/TextInputWithSearchButton';

const SearchWithCode = () => {
  return <TextInputWithSearchButton label="품번" onClickSearchButton={({ text }) => console.log(text)} />;
};

export default SearchWithCode;

import React, { ChangeEvent, FC, useState } from 'react';
import styles from './App.module.scss';

interface Props {
  options: string[];
  onSelect: (option: string) => void;
  onFinish: () => void;
  selected: string[];
}
const Options: FC<Props> = (props) => {
  const { options, onSelect, selected, onFinish } = props;
  const [search, setSearch] = useState('');
  const onSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    e.persist();
    setSearch(e.target.value);
  };
  return (
    <div className={styles.options}>
      <input
        style={{ backgroundColor: '#fff', width: '100%', marginBottom: 16, height: 24 }}
        className={styles.input}
        onChange={onSearch}
        placeholder="Search"
      />
      <div style={{ maxHeight: 160, overflowY: 'scroll' }}>
        {options
          .filter((option: string) => option.toLowerCase().includes(search.toLowerCase()))
          .map((option: string) => (
            <div key={option}>
              <button
                onClick={() => onSelect(option)}
                className={[styles.option, selected.includes(option) ? styles.selected : ''].join(' ')}
              >
                {option}
              </button>
            </div>
          ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onFinish} className={styles.finish}>
          Finish
        </button>
      </div>
    </div>
  );
};

export default Options;

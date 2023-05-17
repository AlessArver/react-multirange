import React, { useEffect, useState } from 'react';
import MultiRange, { IIMultiRangeItem } from './components/MultiRange';

import styles from './app.module.scss';

function App() {
  const [items, setItems] = useState<IIMultiRangeItem[]>([
    {
      min: 0,
      max: 49,
      value: 20,
      barColor: 'pink',
    },
    {
      min: 21,
      max: 79,
      value: 50,
      barColor: 'lightblue',
    },
    {
      min: 51,
      max: 110,
      value: 80,
      barColor: 'lightgreen',
    },
    {
      min: 81,
      max: 150,
      value: 111,
      barColor: '#f280ff',
    },
  ]);

  useEffect(() => {
    document.title = 'React MultiRange';
  }, []);

  const handleChangeItems = (data: IIMultiRangeItem[]) => {
    setItems(data);
  };

  return (
    <div className={styles.app}>
      <h1 className={styles.app__title}>React MultiRange</h1>
      <MultiRange
        items={items}
        onChange={handleChangeItems}
        lastBarColor="#ff5487"
        labels={items.map((i) => `${i.value}`)}
      />
    </div>
  );
}

export default App;

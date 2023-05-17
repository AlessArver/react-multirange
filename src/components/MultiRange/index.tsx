import React, {
  ChangeEvent, useRef,
} from 'react';
import clsx from 'clsx';

import styles from './index.module.scss';

export interface IIMultiRangeItem {
  min: number;
  max: number;
  value: number;
  barColor?: string;
}
interface IMultiRange {
  items: IIMultiRangeItem[];
  lastBarColor?: string;
  step?: number;
  labels?: string[];
  thumbColor?: string;
  className?: string;
  onChange: (data: IIMultiRangeItem[]) => void;
}
function MultiRange({
  items = [],
  step = 1,
  lastBarColor,
  labels = [],
  thumbColor,
  className,
  onChange,
}: IMultiRange) {
  const rootRef = useRef<HTMLDivElement>(null);

  const handleChange = (value: number, index: number) => {
    let newItems = items.map((i, iIndex) => {
      if (iIndex === index) {
        return { ...i, value };
      }
      return i;
    });
    newItems = newItems.map((i, iIndex) => ({
      ...i,
      min: iIndex === 0 ? 0 : newItems[iIndex - 1].value + 1,
      max:
        iIndex === newItems.length - 1
          ? items[items.length - 1].max
          : newItems[iIndex + 1].value - 1,
    }));
    onChange(newItems);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    let value = parseFloat(e.target.value);
    if (value > items[index].max - step) {
      value = items[index].max - step;
    }
    handleChange(value, index);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const startX = e.clientX;
    const bar: HTMLDivElement | null = rootRef.current;
    const barBox = bar ? bar.getBoundingClientRect() : null;
    const barValue = items[index].value;
    const barMax = items[index].max;
    const barMin = items[index].min;

    const onLeftThumbMousemove = (event: MouseEvent) => {
      const { clientX } = event;
      const dx = clientX - startX;
      const per = dx / (barBox ? barBox.width : 0);
      let val = barValue + (barMax - barMin) * per;

      if (val < barMin) {
        val = barMin;
      } else if (val > barMax - step) {
        val = barMax - step;
      }
      val = Math.ceil(val);

      handleChange(val, index);
    };
    const onLeftThumbMouseup = () => {
      // eslint-disable-next-line
      document.removeEventListener('mousemove', onLeftThumbMousemove);
      // eslint-disable-next-line
      document.removeEventListener('mouseup', onLeftThumbMouseup);
    };
      // eslint-disable-next-line
      document.addEventListener('mousemove', onLeftThumbMousemove);
    // eslint-disable-next-line
      document.addEventListener('mouseup', onLeftThumbMouseup);
  };

  return (
    <div className={clsx(styles.multiRange__root, className)}>
      <div ref={rootRef} className={styles.multiRange}>
        {!!items.length
          && items.map((i, index) => (
            <div
              key={index}
              style={{
                width:
                  index === 0
                    ? `${(i.value * 100) / items[items.length - 1].max}%`
                    : `${
                      ((i.value - items[index - 1].value) * 100)
                        / items[items.length - 1].max
                    }%`,
                display: 'flex',
              }}
            >
              <div
                className={styles.multiRange__bar}
                style={{
                  width: '100%',
                  backgroundColor: i?.barColor,
                }}
              />
              <input
                className={styles.multiRange__input}
                type="range"
                min={i.min}
                max={i.max}
                value={i.value}
                onInput={(e: ChangeEvent<HTMLInputElement>) => onInputChange(e, index)}
              />
              {/* eslint-disable-next-line */}
              <div
                className={styles.multiRange__thumb}
                style={{
                  backgroundColor: thumbColor,
                }}
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => onMouseMove(e, index)}
              >
                <div className={styles.multiRange__caption}>
                  <span>{i.value}</span>
                </div>
              </div>
            </div>
          ))}
        {items.length > 1 && (
          <div
            className={styles.multiRange__bar}
            style={{
              width: `${
                ((items[items.length - 1].max - items[items.length - 1].value)
                  * 100)
                / items[items.length - 1].max
              }%`,
              backgroundColor: lastBarColor,
            }}
          />
        )}
      </div>
      <div className={styles.multiRange__labels}>
        {labels?.map((l, index) => (
          <div key={index}>{l}</div>
        ))}
      </div>
    </div>
  );
}

export default MultiRange;

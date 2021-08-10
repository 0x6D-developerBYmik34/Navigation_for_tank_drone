import React, { useState } from 'react';
import { useCallback } from 'react';
import './ClearButton.css'


const animationDelay = 700 - 22;

const ClearButton = ({onClickClear, setIsActive}) => {
    const [isAnimate, setAnimate] = useState(false)

    const onClearAll = useCallback(() => {
      setAnimate(true)

      onClickClear()

      setTimeout(() => {
        setAnimate(false)
        setIsActive(false)
      }, animationDelay)
    }, [onClickClear, setIsActive]);

    return (
      <button className={isAnimate ? 'animate-deletion clear-button' : 'clear-button'} onClick={onClearAll}>
        Отчистить маршрут
      </button>
    );
}

export default ClearButton;

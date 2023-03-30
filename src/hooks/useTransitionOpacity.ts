import React from "react";

export const useTransitionOpacity = (ref: React.RefObject<HTMLElement>) => {
  const [isActionsVisible, setIsActionsVisible] = React.useState(false);

  const opacityDown = [
    {
      opacity: 1,
      transition: "all 0.3s ease-in-out",
    },
    {
      opacity: 0,
      transition: "all 0.3s ease-in-out",
    },
  ];

  const timing = {
    duration: 200,
    iterations: 1,
  };

  const onMouseOver = () => {
    if (!isActionsVisible) {
      setIsActionsVisible(true);
    }
  };

  const onMouseLeave = () => {
    ref?.current?.animate(opacityDown, timing);

    setTimeout(() => {
      setIsActionsVisible(false);
    }, 100);
  };

  return { onMouseOver, onMouseLeave, isActionsVisible };
};

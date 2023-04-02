import React from "react";

export const useTransitionOpacity = (ref: React.RefObject<HTMLElement>) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const opacityUp = [
    {
      opacity: 0,
      transition: "all 0.3s ease-in-out",
    },
    {
      opacity: 1,
      transition: "all 0.3s ease-in-out",
    },
  ];

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

  React.useEffect(() => {
    isVisible && ref?.current?.animate(opacityUp, timing);
  }, [isVisible]);

  const onMouseOver = () => setIsVisible(true);

  const onMouseLeave = () => {
    ref?.current?.animate(opacityDown, timing);

    setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  return { isVisible, onMouseOver, onMouseLeave };
};

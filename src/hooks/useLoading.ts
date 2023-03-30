import React, { useState } from "react";

export const useLoading = (timeout?: number) => {
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setTimeout(
      () => {
        setIsLoading(false);
      },
      timeout ? timeout : 2000
    );
  }, []);

  return { isLoading, setIsLoading };
};

import { useMemo } from "react";

const useIsBlocked = (me: any, currentUserId: string) => {
  return useMemo(() => {
    if (!me || !Array.isArray(me?.blockList)) return false;
    return me.blockList.includes(currentUserId);
  }, [me, currentUserId]);
};

export default useIsBlocked;
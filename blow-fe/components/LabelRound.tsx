import { cn } from "@heroui/theme";
import { FunctionComponent, ReactNode } from "react";

interface DLabelRoundProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "m" | "l";
}

const DLabelRound: FunctionComponent<DLabelRoundProps> = ({
  children,
  onClick,
  className,
  size = "m",
}) => {
  return (
    <button
      className={cn(
        "rounded-full bg-white cursor-pointer flex justify-center items-center shadow-md hover:shadow-lg overflow-hidden",
        {
          ["w-[25px] h-[25px]"]: size === "m",
          ["w-[50px] h-[50px]"]: size === "l",
        },
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default DLabelRound;

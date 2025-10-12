import { cn } from "@heroui/theme";
import { FunctionComponent } from "react";
import { AnimatedLogo } from "./AnimatedLogo"

interface LoaderProps {
  modal?: boolean;
  save?: boolean;
  text?: string;
}

const Loader: FunctionComponent<LoaderProps> = ({
  modal = false,
  save = false,
  text = save ? "Сохранение..." : "Загрузка...",
}) => {
  return (
    <div
      className={cn("flex justify-center items-center relative z-50", {
        ["w-screen h-screen"]: !modal,
        ["w-full h-full py-10"]: modal,
      })}
    >
      <div className="flex gap-6 items-center flex-col">
        <AnimatedLogo />
        <p className="text-[20px] loading">
          {text}
        </p>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Loader;

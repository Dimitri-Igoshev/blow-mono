import { getColClass } from "@/helper/grid";
import { getObjectKeyCount } from "@/helper/object";
import { Button } from "@heroui/button";
import { cn } from "@heroui/react";
import type { FC } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

interface WidgetListListCardProps {
  items: Record<string, unknown>[];
  index: number;
  length: number;
  onAction: (type: string) => void;
  color?: string;
}

export const WidgetListListCard: FC<WidgetListListCardProps> = ({
  items,
  index,
  length,
  onAction,
  color = ''
}) => {
  return (
    <div
      className={`w-full p-6 grid gap-6 rounded-3xl ${color === 'yellow' ? "bg-yellow-500" : "bg-foreground-200 "} group ${getColClass(getObjectKeyCount(items))}`}
    >
      {items?.map((i: any, idx: number) => (
        <>
          {i?.type !== "actions" ? (
            <div
              key={i.value}
              className={cn("flex flex-col", {
                ["items-start"]: idx === 0,
                // ['items-center']: idx !== 0 && idx !== items.length - 1,
                ["items-end"]: idx === items.length - 1,
              })}
            >
              <div className="flex flex-col items-start">
                <p className="text-xs text-left">{i.label}</p>
                {i?.link ? (
                  <a
                    href={i.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-left"
                  >
                    {i.value}
                  </a>
                ) : (
                  <>
                    <p className="group-hover:text-primary overflow-hidden break-words text-left max-w-full">
                      {i.value}
                    </p>
                    {i?.value2 ? (
                      <p className="group-hover:text-primary overflow-hidden break-words text-left max-w-full">
                        {i.value2}
                      </p>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div key={i.type} className="flex justify-end gap-3">
              {i?.actions?.map((a: any) => (
                <>
                  {a.active ? (
                    <>
                      {a.type === "up" && index !== 0 ? (
                        <Button
                          isIconOnly
                          radius="full"
                          onPress={() => onAction(a.type)}
                        >
                          <FaAngleUp />
                        </Button>
                      ) : null}
                      {a.type === "down" && index !== length - 1 ? (
                        <Button
                          isIconOnly
                          radius="full"
                          onPress={() => onAction(a.type)}
                        >
                          <FaAngleDown />
                        </Button>
                      ) : null}
                      {a.type !== "up" && a.type !== "down" ? (
                        <Button
                          key={a.type}
                          className="group-hover:text-primary overflow-hidden break-words cursor-pointer"
                          radius="full"
                          onPress={() => onAction(a.type)}
                        >
                          {a.label}
                        </Button>
                      ) : null}
                    </>
                  ) : null}
                </>
              ))}
            </div>
          )}
        </>
      ))}
    </div>
  );
};

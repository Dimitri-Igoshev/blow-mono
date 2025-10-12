import type { RootState } from "@/redux/store";

import { useSelector } from "react-redux";
import { Button, Card, CardBody, Image } from "@heroui/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Switch } from "@heroui/switch";
import { type FC } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { PiEye } from "react-icons/pi";
import { CiEdit, CiImageOff } from "react-icons/ci";
import { BsWallet } from "react-icons/bs";
import { FiMessageCircle } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosStats } from "react-icons/io";
import { BsRobot } from "react-icons/bs";

type WidgetUserCardProps = {
  user: any;
  onAction: (action: any, value?: any) => void;
  // changeStatus: (id: string, active: boolean) => void;
};

export const WidgetUserCard: FC<WidgetUserCardProps> = ({ user, onAction }) => {
  const { project } = useSelector((state: RootState) => state.project);

  // const [isActive, setIsActive] = useState(user.status === 'active');

  return (
    <Card className="">
      {/* <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">{user.firstName}</p>
        <small className="text-default-500">{user.firstName}</small>
        <h4 className="font-bold text-large">{user.firstName}</h4>
      </CardHeader> */}
      <CardBody className="overflow-visible relative">
        {user?.photos[0]?.url ? (
          <Image
            alt="Card background"
            className="object-cover rounded-xl w-full h-[400px]"
            src={`${project?.apiMediaUrl}/${user?.photos[0]?.url}` || ""}
          />
        ) : (
          <div className="bg-foreground-100 rounded-xl flex justify-center items-center h-[400px] w-full">
            <CiImageOff className="text-[100px] text-black/50" />
          </div>
        )}

        <div className="flex justify-between items-center gap-3 mt-2.5 mx-1">
          <div className="flex flex-col">
            <p className="font-semibold">
              {user?.firstName || "Имя не указано"}
            </p>
            <p>
              {user?.age ? user.age + ", " : ""}
              {user?.city || "Город не указан"}
            </p>
          </div>

          <Switch
            color="success"
            isSelected={user?.status === "active"}
            size="sm"
            onValueChange={() => {
              onAction("changeActivity");
            }}
          />
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              className="rotate-90 group-hover:flex absolute top-6 right-6 z-20 transition-all bg-white/10"
              radius="full"
            >
              <HiDotsHorizontal className="text-[22px] text-white" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Static Actions"
            color="success"
            variant="light"
          >
            <DropdownItem
              key="view"
              startContent={<PiEye className="px-[1px]" />}
              onClick={() => onAction("toProfile")}
            >
              Посмотреть
            </DropdownItem>
            <DropdownItem
              key="edit"
              startContent={<CiEdit />}
              onClick={() => onAction("toEdit")}
            >
              Редактировать
            </DropdownItem>
            <DropdownItem
              key="balance"
              startContent={<BsWallet className="px-[2px]" />}
              onClick={() => onAction("addMoney")}
            >
              Пополнить баланс
            </DropdownItem>
            <DropdownItem
              key="message"
              startContent={<FiMessageCircle className="px-[1px]" />}
              onClick={() => onAction("toMessages")}
            >
              Сообщения
            </DropdownItem>
            <DropdownItem
              key="view"
              startContent={<IoIosStats className="px-[1px]" />}
              onClick={() => onAction("toSession")}
            >
              Сессии
            </DropdownItem>
            <DropdownItem
              key="fake"
              startContent={<BsRobot className="px-[1px]" />}
              onClick={() => onAction("fake", user)}
            >
              {user?.isFake ? "Сделать реальной" : "Сделать фейковой"}
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<AiOutlineDelete />}
              onClick={() => onAction("toArchive")}
            >
              Удалить анкету
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardBody>
    </Card>
  );
};

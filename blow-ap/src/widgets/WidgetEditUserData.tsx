import { type FC } from "react";
import { WidgetEditData } from "./WidgetEditData";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Checkbox, Image, Select, SelectItem } from "@heroui/react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { AiOutlineDelete } from "react-icons/ai";
import { useGetCitiesQuery } from "@/redux/services/cityApi";

interface WidgetEditUserDataProps {
  data: any;
  onChange: (key: string, value: any) => void;
  className?: string;
}

export const WidgetEditUserData: FC<WidgetEditUserDataProps> = ({
  data,
  onChange,
  className,
}) => {
  const { project } = useSelector((state: RootState) => state.project);
  const { data: cities } = useGetCitiesQuery({ search: "", limit: 1000 });

  console.log(cities);

  const removePhoto = (item: any) => {
    const filtered = data?.photos?.filter((i: any) => i.url !== item?.url);
    onChange("photos", filtered);
  };

  return (
    <WidgetEditData className={className}>
      <p className="text-semibold text-lg pb-2 mt-1 text-primary">
        Данные входа
      </p>

      <div className="grid grid-cols-4 gap-6">
        <Input
          label="Email"
          type="email"
          value={data?.email}
          onValueChange={(value: any) => onChange("email", value)}
        />
        <Input
          label="Пароль"
          value={data?.password}
          onValueChange={(value: any) => onChange("password", value)}
        />
      </div>

      <p className="text-semibold text-lg pb-2 mt-6 text-primary">
        Данные пользователя
      </p>

      <div className="grid grid-cols-4 gap-6">
        <Input
          label="Имя"
          type="firstName"
          value={data?.firstName}
          maxLength={30} // Ограничение на уровне атрибута
          onValueChange={(value: string) =>
            onChange("firstName", value.slice(0, 30))
          }
        />
        <Select
          label="Пол"
          selectedKeys={[data?.sex]}
          onChange={(el: any) => {
            onChange("sex", el.target.value);
          }}
        >
          {[
            { label: "Мужчина", value: "male" },
            { label: "Девушка", value: "female" },
          ]?.map((i: any) => <SelectItem key={i.value}>{i.label}</SelectItem>)}
        </Select>
        <Input
          label="Возраст"
          value={data?.age}
          onValueChange={(value: any) => onChange("age", value)}
        />
        <Input
          label="Рост"
          value={data?.height}
          onValueChange={(value: any) => onChange("height", value)}
        />
        <Input
          label="Вес"
          value={data?.weight}
          onValueChange={(value: any) => onChange("weight", value)}
        />
        <Select
          label="Город"
          selectedKeys={[data?.city]}
          onChange={(el: any) => {
            onChange("city", el.target.value);
          }}
        >
          {cities?.map((i: any) => (
            <SelectItem key={i.value}>{i.label}</SelectItem>
          ))}
        </Select>
        <div />
        <div className="flex justify-end items-center">
          {data?.voice ? (
            <Button
              radius="full"
              variant="bordered"
              color="primary"
              onPress={() => onChange("voice", "")}
            >
              Удалить голос
            </Button>
          ) : null}
        </div>
        <div className="col-span-4 flex gap-6 my-4">
          <Checkbox
            value="sponsor"
            isSelected={data?.sponsor}
            onValueChange={(value) => onChange("sponsor", value)}
          >
            Спонсорство
          </Checkbox>
          <Checkbox
            value="traveling"
            isSelected={data?.traveling}
            onValueChange={(value) => onChange("traveling", value)}
          >
            Совместные путешествия
          </Checkbox>
          <Checkbox
            value="relationships"
            isSelected={data?.relationships}
            onValueChange={(value) => onChange("relationships", value)}
          >
            Постоянные отношения
          </Checkbox>
          <Checkbox
            value="evening"
            isSelected={data?.evening}
            onValueChange={(value) => onChange("evening", value)}
          >
            Провести вечер
          </Checkbox>
        </div>
        <Input
          className="col-span-4"
          label="О себе"
          value={data?.about}
          onValueChange={(value: any) => onChange("about", value)}
        />

        {data?.photos?.length ? (
          <p className="text-semibold text-lg pb-2 mt-6 text-primary">
            Фото пользователя
          </p>
        ) : null}
        <div className="col-span-4 grid grid-cols-6 gap-6">
          {data?.photos?.map((item: any) => (
            <div className="relative" key={item.url}>
              <Image
                alt="Card background"
                className="object-cover rounded-xl w-full h-[400px]"
                src={`${project?.apiMediaUrl}/${item?.url}` || ""}
              />
              <button
                className="absolute top-3 right-3 z-10 bg-primary w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
                onClick={() => removePhoto(item)}
              >
                <AiOutlineDelete className="text-[20px] text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </WidgetEditData>
  );
};

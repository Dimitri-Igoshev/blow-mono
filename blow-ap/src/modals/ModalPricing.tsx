import { onlyDigits } from '@/helper/onlyDigets';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useEffect, useState, type FC } from 'react';

interface ModalPricingProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAction?: (value: any[]) => void;
  title: string;
  pricing: any[];
}

export const ModalPricing: FC<ModalPricingProps> = ({
  isOpen,
  onOpenChange,
  onAction = () => null,
  title,
  pricing,
}) => {
  const [values, setValues] = useState<any[]>([]);

  useEffect(() => {
    setValues(pricing || []);
  }, [pricing]);

  return (
    <Modal
      backdrop="blur"
      className="bg-foreground-200 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
      classNames={{
        closeButton: 'm-3.5',
      }}
      isOpen={isOpen}
      isDismissable={false}
      placement="center"
      size="sm"
      onOpenChange={() => {
        // window.location.reload();
        setValues([])
        onOpenChange(isOpen)
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 text-[20px]">Цены - {title}</ModalHeader>
          <ModalBody>
            {values?.map((item: any, idx: number) => (
              <>
                {values[idx] && (
                  <Input
                    key={idx}
                    label={item.name}
                    radius="full"
                    value={values?.[idx]?.price ?? ''}
                    onValueChange={(value: any) => {
                      const arr: any[] = [...values];
                      arr[idx] = { ...arr[idx], price: Number(onlyDigits(value))};
                      setValues([...arr]);
                    }}
                  />
                )}
              </>
            ))}
          </ModalBody>
          <ModalFooter>
            <div className="flex flex-raw w-full gap-3">
              <Button
                className="w-full"
                color="primary"
                radius="full"
                onPress={() => {
                  onAction(values);
                }}
              >
                Сохранить
              </Button>
            </div>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

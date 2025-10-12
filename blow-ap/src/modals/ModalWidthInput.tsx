import { formatRubleWithThousands } from '@/helper/formatedRubleWithThousands';
import { onlyDigits } from '@/helper/onlyDigets';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@heroui/react';
import { useState, type FC } from 'react';

interface ModalWithInputProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAction?: (value: string) => void;
  type?: 'text' | 'amount' | 'textarea';
  title?: string;
  text?: string;
  action?: string;
  placeholder?: string;
}

export const ModalWithInput: FC<ModalWithInputProps> = ({
  isOpen,
  onOpenChange,
  onAction = () => null,
  type = 'text',
  title = 'Ввод данных',
  text = '',
  action = 'Сохранить',
  placeholder = 'Заполните поле',
}) => {
  const [value, setValue] = useState<string>('');

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
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 text-[20px]">{title}</ModalHeader>
          <ModalBody>
            {text ? <div>{text}</div> : null}
            {type === 'textarea' ? (
              <Textarea
                placeholder={placeholder}
                value={value}
                onValueChange={(value: any) => setValue(value)}
              />
            ) : null}
            {type === 'text' ? (
              <Input
                placeholder={placeholder}
                radius="full"
                value={value}
                onValueChange={(value: any) => setValue(value)}
              />
            ) : null}
            {type === 'amount' ? (
              <Input
                placeholder={placeholder}
                radius="full"
                value={value}
                onValueChange={(value: any) =>
                  setValue(formatRubleWithThousands(onlyDigits(value)))
                }
              />
            ) : null}
          </ModalBody>
          <ModalFooter>
            <div className="flex flex-raw w-full gap-3">
              <Button
                className="w-full"
                color="primary"
                radius="full"
                onPress={() => {
                  onAction(value);
                  setValue('');
                }}
              >
                {action}
              </Button>
            </div>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

import { Modal, ModalContent } from '@heroui/react';

import { AnimatedLogo } from './AnimatedLogo';

export const BlowLoader = ({ text = 'Загрузка ...' }: { text?: string }) => {
  return (
    <Modal
      closeButton
      isOpen
      backdrop="blur"
      className="bg-foreground-100 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
      classNames={{
        closeButton: 'hidden',
      }}
      isDismissable={false}
      placement="center"
      size="xs"
    >
      <ModalContent className="p-10">
        <div className="flex gap-3 items-center flex-col">
          <AnimatedLogo />
          <p className="text-[18px] loading">{text}</p>
        </div>
      </ModalContent>
    </Modal>
  );
};

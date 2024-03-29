import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { FC, ReactNode } from "react";

type Props = {
  modalIsOpen: boolean;
  title: string;
  children: ReactNode;
  onValidate: () => Promise<void>;
  onClose: () => void;
  className?: string;
};

const ModalComponent: FC<Props> = ({
  modalIsOpen,
  title,
  children,
  onValidate,
  onClose,
  className = "",
}) => {
  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        hideCloseButton={true}
        classNames={{ base: `${className} absolute top-0` }}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Fermer
              </Button>
              <Button color="primary" onPress={onValidate}>
                Valider
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalComponent;

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/modal";
import React from "react";

interface PopoverProps {
    handleOpen: any;
    handleClose: any;
    handleIsOpen: any;
}

const Popover: React.FC<PopoverProps> = ({ children, handleClose, handleOpen,handleIsOpen }) => {

  return (
    <Modal isOpen={handleIsOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Popover;

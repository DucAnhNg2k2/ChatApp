import styled from "styled-components";

const ModalStyled = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100%",
});

const Modal = ({ children }: any) => {
  return <ModalStyled> {children} </ModalStyled>;
};

export default Modal;

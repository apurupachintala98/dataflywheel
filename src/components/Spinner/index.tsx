import { Container, StyledSpinner } from "./styled.components";

import { SpinnerProps } from "interface";

const Spinner = ({ zIndex }: SpinnerProps) => (
  <Container zIndex={zIndex}>
    <StyledSpinner />
  </Container>
);
export default Spinner;

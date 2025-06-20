import { Container, StyledSpinner } from "./styled.components";

import { SpinnerProps } from "interface";
import loding from "assests/images/loding.png";

const Spinner = ({ zIndex }: SpinnerProps) => (
  <Container zIndex={zIndex}>
    <StyledSpinner src={loding} alt="Loading..." />
  </Container>
);
export default Spinner;

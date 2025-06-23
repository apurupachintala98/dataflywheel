import { Container, StyledSpinner } from "./styled.components";

import { SpinnerProps } from "interface";
import loading from "assests/images/loading.png";

const Spinner = ({ zIndex }: SpinnerProps) => (
  <Container zIndex={zIndex}>
    <StyledSpinner src={loading} alt="Loading..." />
  </Container>
);
export default Spinner;

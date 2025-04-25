import { useTranslation } from "react-i18next";

import { MainContainer, PageContainer, PageTitle } from "../styled.components";
import Header from "components/Header";

import { useWindowDimensions } from "utils/hooks";

import { TypeProps } from "interface";

function Create() {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();

  return (
    <MainContainer height={height}>
      <Header zIndex="999" type={TypeProps.Fixed} sidebarType="mini" />
      <PageContainer>
        <PageTitle>{t("create.title")}</PageTitle>
      </PageContainer>
    </MainContainer>
  );
}

export default Create;

import { Breadcrumb, BreadcrumbItem } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { HeaderContainer, MainContainer, PageContainer, PageTitle } from "../styled.components";

import { useWindowDimensions } from "utils/hooks";

function HomeContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { height } = useWindowDimensions();

  return (
    <MainContainer height={height}>
      <PageContainer>
        {/* <HeaderContainer>
          <PageTitle>{t("dashboard.title")}</PageTitle>
        </HeaderContainer>
        <Breadcrumb>
          <BreadcrumbItem>
            <div style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
              Home
            </div>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>{t("dashboard.BreadcrumbHomeText")}</BreadcrumbItem>
        </Breadcrumb> */}
      </PageContainer>
    </MainContainer>
  );
}

export default HomeContent;

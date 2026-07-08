import { Tabs } from "antd";
import type { TabsProps } from "antd";
import styled from "styled-components";
import { tokens } from "../../../design-system/tokens";

const { tabs } = tokens;

export const AppTabsStyled = styled(Tabs)`
  margin-bottom: 0;
  background: transparent;
  box-shadow: none;

  .ant-tabs-nav {
    background-color: ${tabs.barBg};
    margin: 0;
    padding: ${tabs.barPadding};
    box-shadow: none;

    &::before {
      border-bottom-color: ${tabs.barBorderColor};
      box-shadow: none;
    }
  }

  .ant-tabs-content-holder,
  .ant-tabs-tab {
    background: transparent;
    box-shadow: none;
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${tabs.activeColor} !important;
    font-weight: ${tabs.activeFontWeight} !important;
  }

  .ant-tabs-tab:not(.ant-tabs-tab-active):not(.ant-tabs-tab-disabled)
    .ant-tabs-tab-btn {
    color: ${tabs.inactiveColor} !important;
    font-weight: ${tabs.inactiveFontWeight} !important;
  }

  .ant-tabs-tab:not(.ant-tabs-tab-active):not(.ant-tabs-tab-disabled):hover
    .ant-tabs-tab-btn {
    color: ${tabs.hoverColor} !important;
  }

  .ant-tabs-tab.ant-tabs-tab-disabled .ant-tabs-tab-btn {
    color: ${tabs.disabledColor} !important;
    font-weight: ${tabs.inactiveFontWeight} !important;
  }

  .ant-tabs-ink-bar {
    background: ${tabs.inkBarColor};
  }
`;

export type AppTabsProps = TabsProps;

export function AppTabs(props: AppTabsProps) {
  return <AppTabsStyled {...props} />;
}

/** @deprecated Use AppTabs from @/components/ui */
export const StyledTabs = AppTabsStyled;

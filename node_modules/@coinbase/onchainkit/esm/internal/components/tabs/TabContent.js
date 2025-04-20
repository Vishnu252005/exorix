import { useTabsContext } from './Tabs.js';
import { jsx } from 'react/jsx-runtime';
function TabContent({
  children,
  value,
  className
}) {
  const _useTabsContext = useTabsContext(),
    selectedTab = _useTabsContext.selectedTab;
  if (selectedTab !== value) {
    return null;
  }
  return /*#__PURE__*/jsx("div", {
    className: className,
    role: "tabpanel",
    "aria-labelledby": `${value}-panel`,
    children: children
  });
}
export { TabContent };
//# sourceMappingURL=TabContent.js.map

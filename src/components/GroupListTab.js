import React from 'react';
import { Tab } from '@material-ui/core';
import { formatMessage, PublishedComponent } from '@openimis/fe-core';
import { GROUP_LIST_TAB_VALUE } from '../constants';
import GroupSearcherForEntities from './GroupSearcherForEntities';

function GroupListTabLabel({
  intl, onChange, tabStyle, isSelected, individual,
}) {
  if (!individual) return null;
  return (
    <Tab
      onChange={onChange}
      className={tabStyle(GROUP_LIST_TAB_VALUE)}
      selected={isSelected(GROUP_LIST_TAB_VALUE)}
      value={GROUP_LIST_TAB_VALUE}
      label={formatMessage(intl, 'individual', 'groupListTab.label')}
    />
  );
}

function GroupListTabPanel({
  value, rights, individual, group
}) {
  if (!individual) return null;

  return (
    <PublishedComponent
      pubRef="policyHolder.TabPanel"
      module="individual"
      index={GROUP_LIST_TAB_VALUE}
      value={value}
    >
      <GroupSearcherForEntities 
        rights={rights}
        individualId={individual?.id}
        groupId={group?.id}
        enableFilter={false}
      />
    </PublishedComponent>
  );
}

export {GroupListTabLabel, GroupListTabPanel};

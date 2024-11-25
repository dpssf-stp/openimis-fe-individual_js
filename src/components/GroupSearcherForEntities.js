import React, { useEffect, useState, useRef } from 'react';
import { injectIntl } from 'react-intl';
import {
  withModulesManager,
  formatMessage,
  formatMessageWithValues,
  Searcher,
  withHistory,
  historyPush,
  downloadExport,
  coreConfirm,
  clearConfirm,
  journalize,
} from '@openimis/fe-core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  IconButton, Tooltip, Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@material-ui/core';
import {
  deleteGroup, downloadGroups, fetchGroups, clearGroupExport,
} from '../actions';
import {
  DEFAULT_PAGE_SIZE,
  ROWS_PER_PAGE_OPTIONS,
  RIGHT_GROUP_UPDATE, RIGHT_GROUP_DELETE, SOCIAL_PROTECTION_MODULE_NAME, BENEFIT_PLAN_LABEL,
} from '../constants';
import GroupFilter from './GroupFilter';
import { applyNumberCircle } from '../util/searcher-utils';

function GroupSearcherForEntities({
  intl,
  modulesManager,
  history,
  rights,
  fetchGroups,
  fetchingGroups,
  fetchedGroups,
  errorGroups,
  groups,
  groupsPageInfo,
  groupsTotalCount,
  downloadGroups,
  groupExport,
  errorGroupExport,
  deleteGroup,
  confirmed,
  submittingMutation,
  clearGroupExport,
  mutation,
  coreConfirm,
  clearConfirm,
  journalize,
  CLEARED_STATE_FILTER,
  individualId,
  groupId,
  enableFilter=true,
}) {
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [deletedGroupUuids, setDeletedGroupUuids] = useState([]);
  const [appliedCustomFilters, setAppliedCustomFilters] = useState([CLEARED_STATE_FILTER]);
  const [appliedFiltersRowStructure, setAppliedFiltersRowStructure] = useState([CLEARED_STATE_FILTER]);
  const prevSubmittingMutationRef = useRef();

  function groupUpdatePageUrl(group) {
    return `${modulesManager.getRef('individual.route.group')}/${group?.id}`;
  }

  const openDeleteGroupConfirmDialog = () => coreConfirm(
    formatMessageWithValues(intl, 'individual', 'group.delete.confirm.title', {
      id: groupToDelete.id,
    }),
    formatMessage(intl, 'individual', 'group.delete.confirm.message'),
  );

  const onDoubleClick = (group, newTab = false) => rights.includes(RIGHT_GROUP_UPDATE)
  && !deletedGroupUuids.includes(group.id)
  && historyPush(modulesManager, history, 'individual.route.group', [group?.id], newTab);

  const onDelete = (group) => setGroupToDelete(group);

  useEffect(() => groupToDelete && openDeleteGroupConfirmDialog(), [groupToDelete]);

  useEffect(() => {
    if (groupToDelete && confirmed) {
      deleteGroup(
        groupToDelete,
        formatMessageWithValues(intl, 'individual', 'individual.delete.mutationLabel', {
          id: groupToDelete.id,
        }),
      );
      setDeletedGroupUuids([...deletedGroupUuids, groupToDelete.id]);
    }
    if (groupToDelete && confirmed !== null) {
      setGroupToDelete(null);
    }
    return () => confirmed && clearConfirm(false);
  }, [confirmed]);

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      journalize(mutation);
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  const fetch = (params) => {
    if (individualId) {
        params.push(`individualId: "${individualId}"`)
    }
    if (groupId) {
        params.push(`groupId: "${groupId}"`)
    }
    fetchGroups(params);
  }

  const headers = () => {
    const headers = [
      'group.code',
      'group.head',
    ];
    if (rights.includes(RIGHT_GROUP_UPDATE)) {
      headers.push('emptyLabel');
    }
    return headers;
  };

  const itemFormatters = () => {
    const formatters = [
      (group) => group.code,
      (group) => (group?.head
        ? `${group?.head?.fullname}`
        : formatMessage(intl, 'group', 'noHeadSpecified')),
    ];
    return formatters;
  };

  const rowIdentifier = (group) => group.id;

  const sorts = () => [
    ['code', false],
  ];

  const isRowDisabled = (_, group) => deletedGroupUuids.includes(group.id);

  const defaultFilters = () => ({
    isDeleted: {
      value: false,
      filter: 'isDeleted: false',
    },
  });

  const [failedExport, setFailedExport] = useState(false);

  useEffect(() => {
    setFailedExport(true);
  }, [errorGroupExport]);

  useEffect(() => {
    if (groupExport) {
      downloadExport(groupExport, `${formatMessage(intl, 'individual', 'export.filename.groups')}.csv`)();
      clearGroupExport();
    }
  }, [groupExport]);

  const groupFilter = (props) => (
    <GroupFilter
      intl={props.intl}
      classes={props.classes}
      filters={props.filters}
      onChangeFilters={props.onChangeFilters}
    />
  );

  return (
    <div>
      <Searcher
        module="individual"
        FilterPane={enableFilter && groupFilter}
        fetch={fetch}
        items={groups}
        itemsPageInfo={groupsPageInfo}
        fetchingItems={fetchingGroups}
        fetchedItems={fetchedGroups}
        errorItems={errorGroups}
        tableTitle={formatMessageWithValues(intl, 'individual', 'groups.searcherResultsTitle', {
          groupsTotalCount,
        })}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultOrderBy="id"
        rowIdentifier={rowIdentifier}
        onDoubleClick={onDoubleClick}
        defaultFilters={defaultFilters()}
        exportable
        exportFetch={downloadGroups}
        exportFields={[
          'code',
          'json_ext', // Unfolded by backend and removed from csv
        ]}
        exportFieldsColumns={{
          code: 'ID',
        }}
        exportFieldLabel={formatMessage(intl, 'individual', 'export.label')}
        cacheFiltersKey="groupsFilterCache"
        resetFiltersOnUnmount
        isCustomFiltering
        moduleName={SOCIAL_PROTECTION_MODULE_NAME}
        objectType={BENEFIT_PLAN_LABEL}
        additionalCustomFilterParams={{ type: 'GROUP' }}
        appliedCustomFilters={appliedCustomFilters}
        setAppliedCustomFilters={setAppliedCustomFilters}
        appliedFiltersRowStructure={appliedFiltersRowStructure}
        setAppliedFiltersRowStructure={setAppliedFiltersRowStructure}
        applyNumberCircle={applyNumberCircle}
        rowDisabled={isRowDisabled}
        rowLocked={isRowDisabled}
      />
      {failedExport && (
        <Dialog fullWidth maxWidth="sm">
          <DialogTitle>{errorGroupExport}</DialogTitle>
          <DialogActions>
            <Button onClick={setFailedExport(false)} variant="contained">
              {formatMessage(intl, 'individual', 'ok')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  fetchingGroups: state.individual.fetchingGroups,
  fetchedGroups: state.individual.fetchedGroups,
  errorGroups: state.individual.errorGroups,
  groups: state.individual.groups,
  groupsPageInfo: state.individual.groupsPageInfo,
  groupsTotalCount: state.individual.groupsTotalCount,
  selectedFilters: state.core.filtersCache.groupsFilterCache,
  fetchingGroupExport: state.individual.fetchingGroupExport,
  fetchedGroupExport: state.individual.fetchedGroupExport,
  groupExport: state.individual.groupExport,
  groupExportPageInfo: state.individual.groupExportPageInfo,
  errorGroupExport: state.individual.errorGroupExport,
  confirmed: state.core.confirmed,
  submittingMutation: state.individual.submittingMutation,
  mutation: state.individual.mutation,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    fetchGroups,
    downloadGroups,
    clearGroupExport,
    deleteGroup,
    coreConfirm,
    clearConfirm,
    journalize,
  },
  dispatch,
);

export default withHistory(
  withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(GroupSearcherForEntities))),
);
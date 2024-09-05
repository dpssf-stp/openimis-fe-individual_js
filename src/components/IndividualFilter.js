import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { TextInput, PublishedComponent, formatMessage } from '@openimis/fe-core';
import { Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles';
import _debounce from 'lodash/debounce';
import {
  CONTAINS_LOOKUP,
  DEFAULT_DEBOUNCE_TIME,
  EMPTY_STRING,
  INDIVIDUAL_MODULE_NAME,
  YEAR_LOOKUP,
  IEXACT_LOOKUP
} from '../constants';
import { compose, bindActionCreators } from 'redux';
import { connect, useSelector, useDispatch } from 'react-redux';
import IndividualSexPicker from "../pickers/IndividualSexPicker";
import BeneficiaryStatusPickerPT from "../pickers/BeneficiaryStatusPickerPT";
import SearchListPicker from "../pickers/SearchListPicker";
import { defaultFilterStyles } from '../util/styles';
import { fetchIndividualDistricts, fetchIndividualSubDistricts } from "../actions";

function IndividualFilter({
  intl, classes, filters, onChangeFilters,
}) {
  const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFAULT_DEBOUNCE_TIME);

  const filterValue = (k) => (!!filters && !!filters[k] ? filters[k].value : null);

  const filterTextFieldValue = (filterName) => filters?.[filterName]?.value ?? EMPTY_STRING;

  const onChangeStringFilter = (filterName, lookup = null) => (value) => {
    if (lookup) {
      debouncedOnChangeFilters([
        {
          id: filterName,
          value,
          filter: `${filterName}_${lookup}: "${value}"`,
        },
      ]);
    } else {
      onChangeFilters([
        {
          id: filterName,
          value,
          filter: `${filterName}: "${value}"`,
        },
      ]);
    }
  };

  const onChangeFilter = (k, v) => {
    onChangeFilters([
      {
        id: k,
        value: v,
        filter: `${k}: ${v}`,
      },
    ]);
  };

  const onChangeCheckbox = (key, value) => {
    const filters = [
      {
        id: key,
        value,
        filter: `${key}: ${value}`,
      },
    ];
    onChangeFilters(filters);
  };

  const isDistrictLoading = useSelector(
    (state) => state.individual.fetchingIndividualDistricts
  );

  const isSubDistrictLoading = useSelector(
    (state) => state.individual.fetchingIndividualSubDistricts
  );

  const uniqueDistricts = useSelector(
    (state) => state.individual.individualDistricts
  );

  const uniqueSubDistricts = useSelector(
    (state) => state.individual.individualSubDistricts
  );

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(fetchIndividualDistricts());
  //   dispatch(fetchIndividualSubDistricts());
  // }, []);

  return (
    <Grid container className={classes.form}>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="individual"
          label="individual.fullname"
          value={filterTextFieldValue("fullname")}
          onChange={onChangeStringFilter("fullname", )}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="individual"
          label="individual.nickname"
          value={filterTextFieldValue("nickname")}
          onChange={onChangeStringFilter("nickname", )}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="individual"
          label="individual.idNumber"
          value={filterTextFieldValue("idNumber")}
          onChange={onChangeStringFilter("idNumber", )}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <IndividualSexPicker
          withNull
          nullLabel={formatMessage(intl, "individual", "any")}
          value={filterValue("sex")}
          onChange={(value) =>
            onChangeFilters([
              {
                id: "sex",
                value,
                filter: `sex: "${value}"`,
              },
            ])
          }
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <PublishedComponent
          pubRef="core.YearPicker"
          module="individual"
          label="individual.dob"
          value={filterValue("dob")}
          min="1900"
          max={new Date().getFullYear()}
          onChange={(v) =>
            onChangeFilters([
              {
                id: "dob",
                value: v,
                filter: `dob_${YEAR_LOOKUP}: ${v}`,
              },
            ])
          }
        />
      </Grid>
      {/* <Grid item xs={2} className={classes.item}>
        <SearchListPicker
          module="individual"
          label={formatMessage(intl, "individual", "district")}
          options={uniqueDistricts?.map((option) => ({
            label: option?.node?.district,
            value: option?.node?.district,
          }))}
          isLoading={isDistrictLoading}
          getOptionLabel={(option) => option.label}
          handleOnChange={(option) => {
            onChangeStringFilter(
              "district",
              CONTAINS_LOOKUP
            )(option?.value || "");
          }}
          selectedValue={uniqueDistricts?.map((option) => ({
            label: option?.node?.district,
            value: option?.node?.district,
          }))?.find((option) => option?.value === filterValue("district"))}
          resetKey={Date.now()}
        />
      </Grid> */}
      {/* <Grid item xs={2} className={classes.item}>
        <SearchListPicker
          module="individual"
          label={formatMessage(intl, "individual", "subDistrict")}
          options={uniqueSubDistricts?.map((option) => ({
            label: option?.node?.subDistrict,
            value: option?.node?.subDistrict,
          }))}
          isLoading={isSubDistrictLoading}
          getOptionLabel={(option) => option.label}
          handleOnChange={(option) => {
            onChangeStringFilter(
              "subDistrict",
              CONTAINS_LOOKUP
            )(option?.value || "");
          }}
          selectedValue={uniqueSubDistricts?.map((option) => ({
            label: option?.node?.subDistrict,
            value: option?.node?.subDistrict,
          }))?.find((option) => {
            return option?.value === filterTextFieldValue("subDistrict")
          })}
          resetKey={Date.now()}
        />
      </Grid> */}
      <Grid item xs={2} className={classes.item}>
        <BeneficiaryStatusPickerPT
          withNull
          nullLabel={formatMessage(intl, "individual", "any")}
          value={filterValue("pfvStatus")}
          onChange={(value) =>
            onChangeFilters([
              {
                id: "pfvStatus",
                value,
                filter: `pfvStatus: "${value}"`,
              },
            ])
          }
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={filterValue("hasIdPhoto")}
              onChange={(event) =>
                onChangeCheckbox("hasIdPhoto", event.target.checked)
              }
            />
          }
          label={formatMessage(intl, "individual", "hasIdPhoto")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={filterValue("isIdProblem")}
              onChange={(event) =>
                onChangeCheckbox("isIdProblem", event.target.checked)
              }
            />
          }
          label={formatMessage(intl, "individual", "isIdProblem")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={filterValue("isChild")}
              onChange={(event) =>
                onChangeCheckbox("isChild", event.target.checked)
              }
            />
          }
          label={formatMessage(intl, "individual", "isChild")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <FormControlLabel
          control={(
            <Checkbox
              color="primary"
              checked={filterValue('isDeleted')}
              onChange={(event) => onChangeFilter('isDeleted', event.target.checked)}
              name="isDeleted"
            />
            )}
          label={formatMessage(intl, INDIVIDUAL_MODULE_NAME, 'isDeleted')}
        />
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state) => ({
  fetchingIndividualDistricts: state?.individual?.fetchingIndividualDistricts,
  fetchedIndividualDistricts: state?.individual?.fetchedIndividualDistricts,
  errorIndividualDistricts: state?.individual?.errorIndividualDistricts,
  individualDistricts: state?.individual?.individualDistricts,
});

const mapDispatchToProps = {
  fetchIndividualDistricts,
};

export default compose(
  injectIntl,
  withTheme,
  withStyles(defaultFilterStyles),
  connect(mapStateToProps, mapDispatchToProps)
)(IndividualFilter);

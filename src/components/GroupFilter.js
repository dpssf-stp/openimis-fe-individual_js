import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { TextInput, formatMessage } from '@openimis/fe-core';
import { Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles';
import _debounce from 'lodash/debounce';
import { DEFAULT_DEBOUNCE_TIME, EMPTY_STRING } from '../constants';
import { defaultFilterStyles } from '../util/styles';
import BeneficiaryStatusPickerPT from "../pickers/BeneficiaryStatusPickerPT";
import SearchListPicker from "../pickers/SearchListPicker";
import { useDispatch, useSelector } from "react-redux";
import { fetchIndividualDistricts, fetchIndividualSubDistricts } from "../actions";
import IndividualSexPicker from "../pickers/IndividualSexPicker";


function GroupFilter({
  intl, classes, filters, onChangeFilters,
}) {
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

  const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFAULT_DEBOUNCE_TIME);

  const filterValue = (filterName) => filters?.[filterName]?.value;
  const filterTextFieldValue = (filterName) => filters?.[filterName]?.value ?? EMPTY_STRING;

  const onChangeStringFilter = (filterName) => (value) => {
    debouncedOnChangeFilters([
      {
        id: filterName,
        value,
        filter: `${filterName}: "${value}"`,
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

  return (
    <Grid container className={classes.form}>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="individual"
          label="group.code"
          value={filterTextFieldValue('code_Icontains')}
          onChange={onChangeStringFilter('code_Icontains')}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="individual"
          label="group.individual.fullname"
          value={filterTextFieldValue("fullname")}
          onChange={onChangeStringFilter("fullname", )}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="individual"
          label="group.individual.nickname"
          value={filterTextFieldValue("nickname")}
          onChange={onChangeStringFilter("nickname", )}
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
            onChangeStringFilter("district")(option?.value || "");
          }}
          selectedValue={uniqueDistricts?.map((option) => ({
            label: option?.node?.district,
            value: option?.node?.district,
          }))?.find((option) => option?.value === filterValue("district"))}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
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
            onChangeStringFilter("subDistrict")(option?.value || "");
          }}
          selectedValue={uniqueSubDistricts?.map((option) => ({
            label: option?.node?.subDistrict,
            value: option?.node?.subDistrict,
          }))?.find((option) => {
            return option?.value === filterTextFieldValue("subDistrict")
          })}
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
              checked={filterValue("hasChild")}
              onChange={(event) =>
                onChangeCheckbox("hasChild", event.target.checked)
              }
            />
          }
          label={formatMessage(intl, "individual", "hasChild")}
        />
      </Grid>
    </Grid>
  );
}

export default injectIntl(withTheme(withStyles(defaultFilterStyles)(GroupFilter)));

import React, { useState, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
  withModulesManager,
  combine,
  useTranslations,
  useDebounceCb,
} from "@openimis/fe-core";
import _ from "lodash";

const styles = () => ({
  textField: {
    width: "100%",
  },
});

function SearchListPicker(props) {
  const {
    modulesManager,
    multiple,
    readOnly,
    options,
    isLoading,
    selectedValue,
    withLabel = true,
    label,
    placeholder,
    required,
    withPlaceholder,
    getOptionLabel,
    handleOnChange,
  } = props;
  const [open, setOpen] = useState(false);
  const [resetKey, setResetKey] = useState();
  const { formatMessage } = useTranslations("location", modulesManager);
  const [searchString, setSearchString] = useState("");
  const onInputChange = useDebounceCb(
    setSearchString,
    modulesManager.getConf("fe-location", "debounceTime", 400)
  );


  const handleChange = (__, option) => {
    handleOnChange(option);
  };

  return (
    <Autocomplete
      key={resetKey}
      loadingText={formatMessage("LocationPicker.loadingText")}
      openText={formatMessage("LocationPicker.openText")}
      closeText={formatMessage("LocationPicker.closeText")}
      clearText={formatMessage("LocationPicker.clearText")}
      openOnFocus
      options={options}
      loading={isLoading}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      autoComplete
      clearOnBlur
      clearOnEscape
      value={selectedValue || ''}
      defaultValue={selectedValue || ''}
      getOptionLabel={getOptionLabel}
      getOptionSelected={(option, value) => option.value === value}
      onChange={handleChange}
      onInputChange={(__, searchString) => onInputChange(searchString)}
      renderInput={(inputProps) => (
        <TextField
          {...inputProps}
          variant="standard"
          required={required}
          label={withLabel && label}
          placeholder={withPlaceholder && placeholder}
        />
      )}
    />
  );
}

const enhance = combine(withModulesManager, withTheme, withStyles(styles));

export default enhance(SearchListPicker);

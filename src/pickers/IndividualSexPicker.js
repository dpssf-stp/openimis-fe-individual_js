import React from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';
import {
  INDIVIDUAL_SEX_LIST,
} from '../constants';

function IndividualSexPicker(props) {
  const {
    required, withNull, readOnly, onChange, value, nullLabel, withLabel,
  } = props;
  return (
    <ConstantBasedPicker
      module="individual"
      label="individual.individualSexPicker"
      constants={INDIVIDUAL_SEX_LIST}
      onChange={onChange}
      value={value}
      required={required}
      readOnly={readOnly}
      withNull={withNull}
      nullLabel={nullLabel}
      withLabel={withLabel}
    />
  );
}

export default IndividualSexPicker;

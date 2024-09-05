import React from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';
import {
    BENEFICIARY_STATUS_LIST_PT,
} from '../constants';

function BeneficiaryStatusPickerPT(props) {
  const {
    required, withNull, readOnly, onChange, value, nullLabel, withLabel,
  } = props;
  return (
    <ConstantBasedPicker
      module="individual"
      label="individual.beneficiaryStatusPickerPT"
      constants={BENEFICIARY_STATUS_LIST_PT}
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

export default BeneficiaryStatusPickerPT;

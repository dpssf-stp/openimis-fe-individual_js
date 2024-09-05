import React from 'react';
import { Grid, Divider, Typography } from '@material-ui/core';
import {
  withModulesManager,
  FormPanel,
  TextInput,
  FormattedMessage,
  PublishedComponent,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';
import AdditionalFieldsDialog from './dialogs/AdditionalFieldsDialog';

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: '100%',
  },
});

class IndividualHeadPanel extends FormPanel {
  render() {
    const {
      edited, classes, mandatoryFieldsEmpty,
    } = this.props;
    const individual = { ...edited };
    const currentDate = new Date();
    const parseJsonExt = individual?.jsonExt ? JSON.parse(individual?.jsonExt) : null;

    return (
      <>
        <Grid container className={classes.tableTitle}>
          <Grid item>
            <Grid
              container
              align="center"
              justify="center"
              direction="column"
              className={classes.fullHeight}
            >
              <Grid item>
                <Typography>
                  <FormattedMessage module="individual" id="individual.headPanelTitle" />
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        {mandatoryFieldsEmpty && (
        <>
          <div className={classes.item}>
            <FormattedMessage module="individual" id="individual.mandatoryFieldsEmptyError" />
          </div>
          <Divider />
        </>
        )}
        <Grid container className={classes.item}>
        <Grid item xs={2} className={classes.item}>
          <TextInput
              module="individual"
              label="individual.fullname"
              required
              onChange={(v) => this.updateAttribute('fullname', v)}
              value={parseJsonExt?.nome}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <TextInput
              module="individual"
              label="individual.nickname"
              onChange={(v) => this.updateAttribute('nickname', v)}
              value={parseJsonExt?.vulgo}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <TextInput
              module="individual"
              label="individual.idNumber"
              onChange={(v) => this.updateAttribute('idNumber', v)}
              value={parseJsonExt?.num_doc_id}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <TextInput
              module="individual"
              label="individual.sex"
              required
              onChange={(v) => this.updateAttribute('sex', v)}
              value={parseJsonExt?.sexo}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="individual"
              label="individual.dob"
              required
              onChange={(v) => this.updateAttribute('dob', v)}
              value={individual?.dob}
              maxDate={currentDate}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <TextInput
              module="individual"
              label="individual.district"
              onChange={(v) => this.updateAttribute('district', v)}
              value={parseJsonExt?.distrito}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <TextInput
              module="individual"
              label="individual.subDistrict"
              onChange={(v) => this.updateAttribute('subDistrict', v)}
              value={parseJsonExt?.subDistrito}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <TextInput
              module="individual"
              label="individual.pfvStatus"
              value={parseJsonExt?.estado_pfv}
              readOnly={true}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module="individual"
              label="individual.vulnerabilityCategory"
              value={parseJsonExt?.vulnerability_category}
              readOnly={true}
            />
          </Grid>
          <Grid item xs={6} className={classes.item}>
            <PublishedComponent
              pubRef="individual.IndividualPhotoPicker"
              module="individual"
              label="individual.idFront"
              photo={!!individual ? individual.idFront : null}
              individual={individual}
              type={"id_front"}
              onChange={(v) => this.updateAttribute("idFront", !!v ? v : null)}
            />
          </Grid>
          <Grid item xs={6} className={classes.item}>
            <PublishedComponent
              pubRef="individual.IndividualPhotoPicker"
              module="individual"
              label="individual.idBack"
              photo={!!individual ? individual.idBack : null}
              individual={individual}
              type={"id_back"}
              onChange={(v) => this.updateAttribute("idBack", !!v ? v : null)}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <AdditionalFieldsDialog
              individualJsonExt={individual?.jsonExt}
            />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(IndividualHeadPanel))));

import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';
import { Avatar, Grid, IconButton, Button, Modal } from '@material-ui/core';
import { toISODate, useModulesManager, useTranslations, formatMessageWithValues, FormattedMessage } from '@openimis/fe-core';
import moment from 'moment';
import { createUpdateIndividualPhoto } from '../actions';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  bigAvatar: {
    width: 500, // Adjust width as needed
    height: 300, // Adjust height as needed
    marginBottom: theme.spacing(1), // Adds space below the image
  },
  hiddenInput: {
    display: 'none',
  },
  button: {
    margin: theme.spacing(1), // Adds space around the buttons
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto',
    display: 'block',
  },
});

const IndividualPhotoPicker = (props) => {
  const { intl, photo, classes, className, onChange, individual, type: photo_type, module, label } = props;
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations('individual', modulesManager);
  const [openModal, setOpenModal] = useState(false);

  const getUrl = (photo) => {
    if (photo?.photo) {
      return `data:image/png;base64,${photo.photo}`;
    }
    if (photo?.filename) {
      return `/photos/${photo.folder}/${photo.filename}`;
    }
    return null;
  };

  const onFileSelect = (event) => {
    if (event.target.files) {
      const file = event.target.files[0];
      var reader = new FileReader();
      reader.onloadend = (loaded) => {
        onChange({
          ...photo,
          folder: null,
          filename: null,
          type: photo_type,
          individualId: individual.id,
          photo: btoa(loaded.target.result),
          date: toISODate(moment().toDate()),
        });
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleSave = () => {
    // Implement save functionality here
    createUpdateIndividualPhoto(
      photo,
      formatMessageWithValues(intl, 'individual', 'individualPhoto.update.mutationLabel', {
        id: photo?.id,
      }),
    );

    console.log('Save button clicked');
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className={classes.container}>
      <Avatar src={getUrl(photo)} className={classes.bigAvatar} variant='square' onClick={handleOpenModal} />
      <Modal open={openModal} onClose={handleCloseModal}>
        <img src={getUrl(photo)} className={classes.modalImage} alt='Full preview' />
      </Modal>
      <div>
        <input type='file' className={classes.hiddenInput} onChange={onFileSelect} accept='image/*' id='file-input' />
        <label htmlFor='file-input'>
          <Button variant='contained' component='span' className={classes.button}>
            <FormattedMessage module="individual" id="individual.selectPhotoLabel" />
          </Button>
        </label>
        {/* <Button variant='contained' onClick={handleSave} className={classes.button}>
          Save
        </Button> */}
      </div>
    </div>
  );
};

export default injectIntl(withTheme(withStyles(styles)(IndividualPhotoPicker)));

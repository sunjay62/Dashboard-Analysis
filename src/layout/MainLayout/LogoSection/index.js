import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Logo2 from '../../../../src/assets/images/JakWiFi-logo.png';
import { ButtonBase } from '@mui/material';
import config from 'config';
import { MENU_OPEN } from 'store/actions';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();

  return (
    <ButtonBase
      disableRipple
      onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })}
      component={Link}
      to={config.defaultPath}
      style={{ textAlign: 'left' }}
    >
      <img src={Logo2} alt="" style={{ width: '50%', marginLeft: '-100px' }} />
    </ButtonBase>
  );
};

export default LogoSection;

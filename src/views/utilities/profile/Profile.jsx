import React, { useState, useContext, useEffect } from 'react';
import './profile.scss';
import MainCard from 'ui-component/cards/MainCard';
import { Grid } from '@mui/material';
import { gridSpacing } from 'store/constant';
import { Button, Checkbox, Form, Input } from 'antd';
import UserContext from 'UserContext';
import useAxiosPrivate from 'hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const Profile = () => {
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [passwordDisabled, setPasswordDisabled] = useState(false);
  const { user } = useContext(UserContext);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [fullnameEdit, setFullnameEdit] = useState(''); // Initialize with an empty string
  const [emailEdit, setEmailEdit] = useState(''); // Initialize with an empty string
  const [passwordEdit, setPasswordEdit] = useState('');

  useEffect(() => {
    // Check if the user object is not null before setting the states
    if (user) {
      setFullnameEdit(user.fullname); // Update the value with the user's current fullname
      setEmailEdit(user.email); // Update the value with the user's current email
    }
  }, [user]); // Run this effect whenever the 'user' object changes

  const getUpperCaseUserId = () => {
    return user ? user.id.toUpperCase() : '';
  };

  const getUpperCaseUserFullname = () => {
    return user ? user.fullname.toUpperCase() : '';
  };

  const getUserActiveStatus = () => {
    return user ? user.active : false;
  };

  // UPDATE DATA
  const handleSubmit = (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem('access_token');
    const updatedUserData = { id: user.id, fullname: fullnameEdit, email: emailEdit, password: passwordEdit };
    axiosPrivate
      .put(`/administrator`, updatedUserData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken
        }
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success('Updated Successfully.');
          setTimeout(() => {
            navigate(`/account/administrator`);
          }, 2000);
        } else {
          toast.error('Failed to update, please try again.'); // Use toast.error for error messages
        }
      })
      .catch((err) => {
        toast.error('Failed to update, please try again.'); // Use toast.error for error messages
        console.log(err);
      });
  };

  const handleNameChangeEdit = (event) => {
    setFullnameEdit(event.target.value);
  };

  const handleEmailChangeEdit = (event) => {
    setEmailEdit(event.target.value);
  };

  const handlePasswordChangeEdit = (event) => {
    setPasswordEdit(event.target.value);
  };

  const toHome = () => {
    navigate('/home');
  };

  return (
    <MainCard>
      <ToastContainer />
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <div className="containerHeadProfile">
            <h2>Setting Profile</h2>
          </div>
        </Grid>
        <Grid item xs={12} className="containerBottomProfile">
          <div className="profileLeft">
            <div className="imgContainer"></div>
            <p>{getUpperCaseUserFullname()}</p>
            <p>{getUpperCaseUserId()}</p>
          </div>
          <div className="profileRight">
            <div className="rightTop">
              <h3>
                <button onClick={toHome}>
                  <KeyboardBackspaceIcon />
                  <span>Back to Home</span>
                </button>
              </h3>
              <h3>
                <Checkbox checked={componentDisabled} onChange={(e) => setComponentDisabled(e.target.checked)}>
                  Edit Profile
                </Checkbox>
              </h3>
            </div>
            <div className="rightMiddle">
              <Form disabled={!componentDisabled}>
                <div className="input">
                  <label htmlFor="id">ID :</label>
                  <Input id="id" value={getUpperCaseUserId()} />
                </div>
                <div className="input">
                  <label htmlFor="fullname">Full Name :</label>
                  <Input id="fullname" value={fullnameEdit} onChange={handleNameChangeEdit} />
                </div>
                <div className="input">
                  <label htmlFor="email">Email :</label>
                  <Input id="email" value={emailEdit} onChange={handleEmailChangeEdit} />
                </div>
                <div className="input">
                  <label htmlFor="status">Status :</label>
                  <Input id="status" value={getUserActiveStatus() ? 'Active' : 'Disable'} disabled />
                </div>
                <div className="input">
                  <Checkbox checked={passwordDisabled} onChange={(e) => setPasswordDisabled(e.target.checked)}>
                    Change Password :
                  </Checkbox>
                  <Input id="password" disabled={!passwordDisabled} onChange={handlePasswordChangeEdit} />
                </div>
                <div className="submitBtn">
                  <Button onClick={handleSubmit}>Save Profile</Button>
                </div>
              </Form>
            </div>
            <div className="rightBottom"></div>
          </div>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Profile;

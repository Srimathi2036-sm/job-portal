import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPersonalSettings, getRecruiterSettings, updatePersonalSettings, logoutUser } from "../../actions/authActions";
import Swal from 'sweetalert2';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import { faStar, faSortNumericUp, faSortNumericDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import Slider from '@material-ui/core/Slider';

import Topbar from './Topbar.js';

class Profile extends Component {

  constructor() {
      super();
      this.state = {
        activeSection: 0,
        name: -1,
        email: -1,
        photo: -1,
        contactNum: -1,
        bio: -1
      };
  }

  componentDidMount = () => {
    this.props.getPersonalSettings({"id": this.props.auth.user.id});
    this.props.getRecruiterSettings({"id": this.props.auth.user.id});
  };

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  
  handleChange = (event, newValue) => {
    this.setState({
      value: newValue
    });
  };

  switchPersonalSettings = () => {
    this.setState({
      activeSection: 0
    })
  };

  switchRecruiterSettings = () => {
    this.setState({
      activeSection: 1
    })
  };

  onChange = e => {
      this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = async e => {
      e.preventDefault();

      if(this.state.name===-1){
        await this.setState({
          name: this.props.auth.personal.name
        })
      }
      if(this.state.email===-1){
        await this.setState({
          email: this.props.auth.personal.email
        })
      }

      if(this.state.name.trim()===""){
        await Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Your name cannot be empty',
            footer: 'Dont keep too many secrets.'
        })
        return;
      }

      if(this.state.email.trim()===""){
        await Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Your email cannot be empty',
            footer: 'Dont keep too many secrets.'
        })
        return;
      }
      
      const userData = {
        id: this.props.auth.user.id,
        name: this.state.name,
        email: this.state.email
      };

      this.props.updatePersonalSettings(userData);
  };

  onRecruiterSubmit = async e => {
      e.preventDefault();

      if(this.state.contactNum===-1){
        await this.setState({
          contactNum: this.props.auth.personal.contactNum
        })
      }
      if(this.state.bio===-1){
        await this.setState({
          bio: this.props.auth.personal.bio
        })
      }
      
      const userData = {
        id: this.props.auth.user.id,
        contactNum: this.state.contactNum,
        bio: this.state.bio
      };

      axios
          .post('/api/users/updateRecruiter', userData)
          .then(async res => {
            await Swal.fire({
              icon: 'success',
              title: 'Recruiter Settings updated!',
              text: 'Your settings were updated successfully.',
            })
          })
          .catch(err => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
              footer: JSON.stringify(err.response.data)
            })
          });
  };

  handlePhoto = async e => {
    await this.setState({
      photo: e.target.files[0]
    })
  };

  handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userType', this.props.auth.user.userType);
    formData.append('id', this.props.auth.user.id);
    formData.append('photo', this.state.photo);

    axios
      .post('/api/users/uploadProfilePic', formData)
       .then(res => {
        Swal.fire({
            icon: 'success',
            title: 'Profile Picture Updated!',
            text: 'Your new profile picture has been updated',
            footer: 'You look good!'
          })
      })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: JSON.stringify(err.response.data)
        })
      });
  };

  simulateUploadClick = () => {
    document.getElementById("imageUpload").click();
  };

  render() {
    const { user, personal, recruiter } = this.props.auth;
    return (
      <>
        <Topbar />

        <div className="container">

          <div className="mt-5 profile-card">
            <div className="row">
              <div className="col-lg-3 desktop-only">
                <div className="settings-tabs my-5 ml-4 py-4">
                  <div className="settings-header pt-2 pb-4 pl-3">My Settings</div>
                  <div className={this.state.activeSection == 0 ? " settings-active settings-item py-2 pl-3" : "settings-item py-2 pl-3"} onClick={this.switchPersonalSettings}>Personal Settings</div>
                  <div className={this.state.activeSection == 1 ? " settings-active settings-item py-2 pl-3" : "settings-item py-2 pl-3"} onClick={this.switchRecruiterSettings}>Recruiter Settings</div>
                </div>
              </div>
              <div className="col-lg-9">
                {this.state.activeSection == 0 ? 
                <div className="detailed-section m-5">
                  <div className="image-upload">
                    <form onSubmit={this.handleSubmit} encType='multipart/form-data'>
                      <img className="d-inline-block" src={"../images/profilepics/"+recruiter.profilePic} onClick={this.simulateUploadClick} />
                      <input id="imageUpload" type="file" accept=".png, .jpg, .jpeg" onChange={this.handlePhoto} className="d-none" name="profile_photo" placeholder="Photo" capture />
                      {this.state.photo === -1 ? <div className="text-danger float-right m-5">Click on the picture to change your profile picture.</div> : <><div className="text-danger float-right m-5">Click on the button to continue.</div><button type="submit" className="ml-5 btn rounded-pill btn-info">UPLOAD NEW PHOTO </button></> }
                    </form>
                  </div>
                  <form onSubmit={this.onSubmit}>
                    <div className="form-details mt-5">
                      <div className="form-group">
                        <label className="pl-3" htmlFor="formGroupExampleInput">FULL NAME</label>
                        <input type="text" className="pl-3 form-control bg-white" id="name" defaultValue={personal.name} onChange={this.onChange} required/>
                      </div>
                      <div className="form-group">
                        <label className="pl-3" htmlFor="formGroupExampleInput">EMAIL</label>
                        <input type="text" className="pl-3 form-control bg-white" id="email" defaultValue={personal.email} onChange={this.onChange} required/>
                      </div>
                      <button className="float-right ml-5 btn rounded-pill btn-info">SAVE DETAILS </button>
                    </div>
                  </form>
                </div> :
                <div className="detailed-section m-5">
                  <form onSubmit={this.onRecruiterSubmit}>
                    <div className="form-details mt-5">
                      <div className="form-group">
                        <label className="pl-3" htmlFor="formGroupExampleInput">PHONE NUMBER</label>
                        <input type="text" className="pl-3 form-control bg-white" id="contactNum" defaultValue={recruiter.contactNum} onChange={this.onChange} required/>
                      </div>
                      <div className="form-group">
                        <label className="pl-3" htmlFor="formGroupExampleInput">BIO</label>
                        <input type="text" className="pl-3 form-control bg-white" id="bio" defaultValue={recruiter.bio} onChange={this.onChange} required/>
                      </div>
                      <button className="float-right ml-5 btn rounded-pill btn-info">SAVE DETAILS </button>
                    </div>
                  </form>
                </div> 
                }
              </div>
            </div>
          </div>
          
        </div>
        

      </>
    );
  }
}

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getPersonalSettings: PropTypes.func.isRequired,
  getRecruiterSettings: PropTypes.func.isRequired,
  updatePersonalSettings: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  personal: state.personal,
  recruiter: state.recruiter
});
export default connect(
  mapStateToProps,
  { getPersonalSettings, getRecruiterSettings, updatePersonalSettings, logoutUser }
)(Profile);
import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const UserEdit = ({className, children, user, onStore = null, onUpdate = null, roles}) => {
  const [userForm, setUserForm] = useState({
    cbShowLN: '',
    aRoleIds: [],
    txtEmail: '',
    txtFirstName: '',
    txtLastName: '',
    txtLocation: '',
    txtPassword: '',
  });

  const [cbShowLN, setCBShowLN] = useState();

  useEffect(() => {
    console.log(user);
    if (user) {
      setCBShowLN(user.showLastName);
      setUserForm({
        cbShowLN: user.showLastName,
        aRoleIds: user._roleIds,
        txtEmail: user.email,
        txtFirstName: user.firstName,
        txtLastName: user.lastName,
        txtLocation: user.location,
      });
    }
  }, [user])

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log('submit');

    const newUser = {
      showLastName: userForm.cbShowLN,
      roleIds: userForm.aRoleIds,
      email: userForm.txtEmail,
      firstName: userForm.txtFirstName,
      lastName: userForm.txtLastName,
      location: userForm.txtLocation,
      password: userForm.txtPassword,
    };
    console.log(newUser);

    if (user && user._id) {
      onUpdate({
        ...newUser,
        _id: user._id,
      });      
    } else {
      onStore(newUser);
    }
  }

  const handleInputChange = (ev) => {
    console.log(ev.target.name, ev.target.value);
    setUserForm({
      ...userForm,
      [ev.target.name]: ev.target.value
    });
  }

  const handleCheckboxChange = (ev) => {
    console.log(ev.target.name, ev.target.checked);
    setUserForm({
      ...userForm,
      [ev.target.name]: ev.target.checked
    });
  }

  const handleCheckboxArrayChange = (ev) => {
    let newIds = Array.isArray(userForm[ev.target.name]) ? [...userForm[ev.target.name]] : [];
    if (ev.target.checked) {
      !newIds.includes(ev.target.id) && newIds.push(ev.target.id)
    } else {
      newIds = newIds.filter(id => id !== ev.target.id)
    }
    setUserForm({
      ...userForm,
      [ev.target.name]: newIds
    });
  }
  
  return (
    <div className={classnames(className)}>
      <div className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">{!!user ? <Fragment>Update the user: {user.body}</Fragment> : <Fragment>Create a new user</Fragment>}</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="txtEmail">Email</label>
              <input type="text" className="form-control" id="txtEmail" name="txtEmail" required defaultValue={userForm['txtEmail']} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="txtPassword">Password</label>
              <input type="password" className="form-control" id="txtPassword" name="txtPassword" onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="txtFirstName">First name</label>
              <input type="text" className="form-control" id="txtFirstName" name="txtFirstName" required defaultValue={userForm['txtFirstName']} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="txtLastName">Last name</label>
              <input type="text" className="form-control" id="txtLastName" name="txtLastName" required defaultValue={userForm['txtLastName']} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="cbShowLN">Show last name</label>
              <input type="checkbox" className="form-control" id="cbShowLN" name="cbShowLN" defaultChecked={cbShowLN} onClick={handleCheckboxChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="txtLocation">Location</label>
              <input type="text" className="form-control" id="txtLocation" name="txtLocation" required defaultValue={userForm['txtLocation']} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="aRoleIds">Roles</label>
              <div className="checkboxes">
                {roles && roles.map(role => {
                  return (
                    <div key={role.id}>
                      <input type="checkbox" className="mr-3" id={role.id} name={'aRoleIds'} checked={Array.isArray(userForm['aRoleIds']) && userForm['aRoleIds'].includes(role.id)} onChange={handleCheckboxArrayChange}/>
                      <label htmlFor={role.id} >{role.name}</label>
                    </div>
                  );
                })}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">{!!user ? 'Update' : 'Save'} user</button>
          </form>
        </div>
      </div>
    </div>
  );
};

UserEdit.prototypes = {
  className: PropTypes.string,
  viewModel: PropTypes.object
};

export default UserEdit;
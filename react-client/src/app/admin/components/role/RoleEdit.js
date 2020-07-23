import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const RoleEdit = ({className, children, role, onStore = null, onUpdate = null}) => {
  const [roleForm, setRoleForm] = useState({
    txtName: role && role.name,
  });

  useEffect(() => {
    console.log(role);
    if (role) {
      setRoleForm({
        txtName: role.name,
      });
    }
  }, [role])

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log('submit');
    console.log(roleForm);

    const newRole = {
      name: roleForm.txtName,
    };

    if (role && role._id) {
      onUpdate({
        ...newRole,
        _id: role._id,
      });      
    } else {
      onStore(newRole);
    }
  }

  const handleInputChange = (ev) => {
    console.log(ev.target.name, ev.target.name);
    setRoleForm({
      ...roleForm,
      [ev.target.name]: ev.target.value
    });
  }
  
  return (
    <div className={classnames(className)}>
      <div className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">{!!role ? <Fragment>Update the role: {role.name}</Fragment> : <Fragment>Create a new role</Fragment>}</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="txtName">Name</label>
              <input type="text" className="form-control" id="txtName" name="txtName" required defaultValue={roleForm['txtName']} onChange={handleInputChange}/>
            </div>
            <button type="submit" className="btn btn-primary">{!!role ? 'Update' : 'Save'} role</button>
          </form>          
        </div>
      </div>
    </div>
  );
};

RoleEdit.prototypes = {
  className: PropTypes.string,
  viewModel: PropTypes.object
};

export default RoleEdit;
import React, { } from 'react';
import { useHistory, Link } from 'react-router-dom';

import * as Routes from '../../routes';
import { RoleList } from '../components';

const RolesPage = ({ children }) => {
  let history = useHistory();

  const handleEdit = (roleId) => {
    console.log('edit: ', roleId);
    history.push(Routes.BACKOFFICE_ROLES_EDIT.replace(':id', roleId));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <Link className="btn btn-primary" to={Routes.BACKOFFICE_ROLES_CREATE}>Create Role</Link>
        </div>
        <RoleList className="col-12 col-sm-12 col-md-12 col-lg-12 ol-xl-6 post-list" limit={10} skip={1} onEdit={handleEdit}  />:
      </div>
    </div>
  )
};
export default RolesPage;
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import * as Routes from '../../routes';
import { useApi } from '../../services';
import { useToast } from '../services';
import RoleEdit from '../components/role/RoleEdit';

const RoleEditPage = ({ children }) => {
    const { addToast } = useToast();
    const { id } = useParams();
    const [ role, setRole ] = useState();
    const { findRole, updateRole, storeRole } = useApi();
//   const [ postViewModel, setPostViewModel ] = useState(null);


  let history = useHistory();

//   useEffect(() => {
//     const fetchPostViewModel = async () => {        
//       const data = await editPostViewModel(id);
//       setPostViewModel(data);
//     }

//     fetchPostViewModel();
//   }, [editPostViewModel, id]);

  useEffect(() => {
    const fetchRole = async () => {        
      if (id) {
        const data = await findRole(id);
        setRole(data);
      }
    }

    fetchRole();
  }, [findRole, id]);

  const handleOnUpdate = async (role) => {
    const updatedRole = await updateRole(role);
    addToast({
      title: `Administration: Update Role`,
      message: `Successfully updated an existing role with id: ${updatedRole._id} and name: ${updatedRole.name}`
    });
    history.push(Routes.BACKOFFICE_ROLES);
  }

  const handleOnStore = async (role) => {
    const updatedRole = await storeRole(role);
    addToast({
      title: `Administration: Created Role`,
      message: `Successfully created a new role with name: ${updatedRole.name}`
    });
    history.push(Routes.BACKOFFICE_ROLES);
  }
  
  return (
    <div className="container">
      <div className="row">
        <RoleEdit className="col-12 col-sm-12 col-md-12 col-lg-12 ol-xl-6 role-edit" role={role} onUpdate={handleOnUpdate} onStore={handleOnStore}/>
      </div>
    </div>
  )
};
export default RoleEditPage;
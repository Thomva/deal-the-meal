import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import * as Routes from '../../routes';
import { useApi } from '../../services';
import { useToast } from '../services';
import UserEdit from '../components/user/UserEdit';

const UserEditPage = ({ children }) => {
  const { addToast } = useToast();
  const { id } = useParams();
  const [ user, setUser ] = useState();
  const { findUser, findAllRoles, updateUser, storeUser } = useApi();
  const [ roles, setRoles ] = useState();


  let history = useHistory();

  
  useEffect(() => {
    const fetchRoles = async () => {        
      const data = await findAllRoles();
      const formattedData = data.map(role => ({
        name: role.name,
        id: role.id,
      }))
      setRoles(formattedData);
    }

    fetchRoles();
  }, [findAllRoles]);

//   useEffect(() => {
//     const fetchPostViewModel = async () => {        
//       const data = await editPostViewModel(id);
//       setPostViewModel(data);
//     }

//     fetchPostViewModel();
//   }, [editPostViewModel, id]);

  useEffect(() => {
    const fetchUser = async () => {        
      if (id) {
        const data = await findUser(id);
        setUser(data);
      }
    }

    fetchUser();
  }, [findUser, id]);

  const handleOnUpdate = async (user) => {
    const updatedUser = await updateUser(user);
    addToast({
      title: `Administration: Update User`,
      user: `Successfully updated an existing user with id: ${updatedUser._id} and name: ${updatedUser.name}`
    });
    history.push(Routes.BACKOFFICE_USERS);
  }

  const handleOnStore = async (user) => {
    const updatedUser = await storeUser(user);
    addToast({
      title: `Administration: Created User`,
      user: `Successfully created a new user with name: ${updatedUser.name}`
    });
    history.push(Routes.BACKOFFICE_USERS);
  }
  
  return (
    <div className="container">
      <div className="row">
        <UserEdit className="col-12 col-sm-12 col-md-12 col-lg-12 ol-xl-6 user-edit" user={user} onUpdate={handleOnUpdate} onStore={handleOnStore} roles={roles}/>
      </div>
    </div>
  )
};
export default UserEditPage;
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import * as Routes from '../../routes';
import { useApi } from '../../services';
import { useToast } from '../services';
import MessageEdit from '../components/message/MessageEdit';

const MessageEditPage = ({ children }) => {
  const { addToast } = useToast();
  const { id } = useParams();
  const [ message, setMessage ] = useState();
  const { findMessage, findAllItems, findAllUsers, updateMessage, storeMessage } = useApi();
  const [ items, setItems ] = useState();
  const [ users, setUsers ] = useState();


  let history = useHistory();

  
  useEffect(() => {
    const fetchItems = async () => {        
      const data = await findAllItems();
      const formattedData = data.map(d => ({
        title: d.title,
        id: d.id,
      }))
      setItems(formattedData);
    }

    fetchItems();
  }, [findAllItems]);
  
  useEffect(() => {
    const fetchUsers = async () => {        
      const data = await findAllUsers();
      const formattedData = data.map(d => ({
        id: d.id,
        name: `${d.firstName} ${d.lastName}`,
      }))
      setUsers(formattedData);
    }

    fetchUsers();
  }, [findAllUsers]);

//   useEffect(() => {
//     const fetchPostViewModel = async () => {        
//       const data = await editPostViewModel(id);
//       setPostViewModel(data);
//     }

//     fetchPostViewModel();
//   }, [editPostViewModel, id]);

  useEffect(() => {
    const fetchMessage = async () => {        
      if (id) {
        const data = await findMessage(id);
        setMessage(data);
      }
    }

    fetchMessage();
  }, [findMessage, id]);

  const handleOnUpdate = async (message) => {
    const updatedMessage = await updateMessage(message);
    addToast({
      title: `Administration: Update Message`,
      message: `Successfully updated an existing message with id: ${updatedMessage._id} and name: ${updatedMessage.name}`
    });
    history.push(Routes.BACKOFFICE_MESSAGES);
  }

  const handleOnStore = async (message) => {
    const updatedMessage = await storeMessage(message);
    addToast({
      title: `Administration: Created Message`,
      message: `Successfully created a new message with name: ${updatedMessage.name}`
    });
    history.push(Routes.BACKOFFICE_MESSAGES);
  }
  
  return (
    <div className="container">
      <div className="row">
        <MessageEdit className="col-12 col-sm-12 col-md-12 col-lg-12 ol-xl-6 message-edit" message={message} onUpdate={handleOnUpdate} onStore={handleOnStore} items={items} users={users}/>
      </div>
    </div>
  )
};
export default MessageEditPage;
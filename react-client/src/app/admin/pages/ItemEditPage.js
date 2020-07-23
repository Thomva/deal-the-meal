import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import * as Routes from '../../routes';
import { useApi } from '../../services';
import { useToast } from '../services';
import ItemEdit from '../components/item/ItemEdit';

const ItemEditPage = ({ children }) => {
  const { addToast } = useToast();
  const { id } = useParams();
  const [ item, setItem ] = useState();
  const { findItem, findAllCategories, findAllUsers, updateItem, storeItem } = useApi();
  const [ categories, setCategories ] = useState();
  const [ users, setUsers ] = useState();

  let history = useHistory();

  useEffect(() => {
    const fetchCategories = async () => {        
      const data = await findAllCategories();
      const formattedData = data.map(category => ({
        name: category.name,
        id: category.id,
      }))
      setCategories(formattedData);
    }

    fetchCategories();
  }, [findAllCategories]);

  useEffect(() => {
    const fetchUsers = async () => {        
      const data = await findAllUsers();
      const formattedData = data.map(user => ({
        name: user.name,
        id: user.id,
      }))
      setUsers(formattedData);
    }

    fetchUsers();
  }, [findAllUsers]);

  useEffect(() => {
    const fetchItem = async () => {        
      if (id) {
        const data = await findItem(id);
        setItem(data);
        console.log(data);
      }
    }

    fetchItem();
  }, [findItem, id]);

  const handleOnUpdate = async (item) => {
    const updatedItem = await updateItem(item);
    addToast({
      title: `Administration: Update Item`,
      message: `Successfully updated an existing item with id: ${updatedItem._id} and name: ${updatedItem.name}`
    });
    history.push(Routes.BACKOFFICE_ITEMS);
  }
  
  const handleOnStore = async (item) => {
    const updatedItem = await storeItem(item);
    addToast({
      title: `Administration: Created Item`,
      message: `Successfully created a new item with name: ${updatedItem.name}`
    });
    history.push(Routes.BACKOFFICE_ITEMS);
  }

  return (
    <div className="container">
      <div className="row">
        <ItemEdit className="col-12 col-sm-12 col-md-12 col-lg-12 ol-xl-6 post-edit" item={item} onUpdate={handleOnUpdate} onStore={handleOnStore} categories={categories} users={users}/>
      </div>
    </div>
  )
};
export default ItemEditPage;
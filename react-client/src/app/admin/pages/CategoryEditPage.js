import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import * as Routes from '../../routes';
import { useApi } from '../../services';
import { useToast } from '../services';
import CategoryEdit from '../components/category/CategoryEdit';

const CategoryEditPage = ({ children }) => {
    const { addToast } = useToast();
    const { id } = useParams();
    const [ category, setCategory ] = useState();
    const { findCategory, updateCategory, storeCategory } = useApi();
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
    const fetchCategory = async () => {       
      if (id) {
        const data = await findCategory(id);
        setCategory(data);
      } 
    }

    fetchCategory();
  }, [findCategory, id]);

  const handleOnUpdate = async (category) => {
    const updatedCategory = await updateCategory(category);
    addToast({
      title: `Administration: Update Category`,
      message: `Successfully updated an existing category with id: ${updatedCategory._id} and name: ${updatedCategory.name}`
    });
    history.push(Routes.BACKOFFICE_CATEGORIES);
  }

  const handleOnStore = async (category) => {
    const updatedCategory = await storeCategory(category);
    addToast({
      title: `Administration: Created Category`,
      message: `Successfully created a new category with name: ${updatedCategory.name}`
    });
    history.push(Routes.BACKOFFICE_CATEGORIES);
  }
  
  return (
    <div className="container">
      <div className="row">
        <CategoryEdit className="col-12 col-sm-12 col-md-12 col-lg-12 ol-xl-6 category-edit" category={category} onUpdate={handleOnUpdate} onStore={handleOnStore}/>
      </div>
    </div>
  )
};
export default CategoryEditPage;
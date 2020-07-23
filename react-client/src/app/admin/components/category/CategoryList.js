import { default as React, useEffect, useState, Fragment } from 'react';
import { default as classnames } from 'classnames';

import $ from 'jquery'; 

import { useApi } from '../../../services';
import { useToast } from '../../services';

import CategoriesTable from './CategoriesTable';

import './ItemList.scss';

const CategoryList = ({children, className, limit = 10, skip = 1, onEdit}) => {  
  const { deleteCategory, findAllCategories } = useApi();
  const { addToast } = useToast();
  const [ categories, setCategories ] = useState();
  const [ categoryToDelete, setCategoryToDelete ] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {        
      const data = await findAllCategories();
      setCategories(data);
    }

    if (categoryToDelete === null) {
      fetchCategories();
    }
    
  }, [findAllCategories, categoryToDelete]);

  const handleDelete = (categoryId, mode) => {
    setCategoryToDelete({
      category: categories.find(category => category.id === categoryId),
      mode,
    });
    
    $('#confirmModal').modal('show');
  }

  const handleDeleteConfirm = async () => {
    const deletedCategory = await deleteCategory(categoryToDelete.category.id, categoryToDelete.mode);

    addToast({
      title: `Admin: Category`,
      message: `Succesfully ${categoryToDelete.mode} the category with id ${deletedCategory.id} and title ${deletedCategory.name}`
    });

    $('#confirmModal').modal('hide');

    setCategoryToDelete(null);
  }

  const handleEdit = (categoryId) => {
    if (typeof onEdit === 'function') {
      onEdit(categoryId);
    }
  }

  return (
    <div className={className}>
      <div className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Categories</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <CategoriesTable categories={categories} onDelete={handleDelete} onEdit={handleEdit}  />
          </div>          
        </div>
      </div>
      <div className="modal fade" id="confirmModal" tabIndex="-1" role="dialog" aria-labelledby="confirmModal" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{!!categoryToDelete ? (
                <Fragment>{categoryToDelete.mode} the selected category</Fragment>
              ) : ''}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {!!categoryToDelete ? (
                <p>Dou yo wish to {categoryToDelete.mode} the category with id: {categoryToDelete.category.id} and name: {categoryToDelete.category.name}?</p>
              ) : ''}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={ev => handleDeleteConfirm(ev)}>{!!categoryToDelete ? (
                <Fragment>{categoryToDelete.mode}</Fragment>
              ) : ''}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
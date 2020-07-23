import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const CategoryEdit = ({className, children, category, onStore = null, onUpdate = null}) => {
  const [categoryForm, setCategoryForm] = useState({
    txtName: category && category.name,
  });

  useEffect(() => {
    console.log(category);
    if (category) {
      setCategoryForm({
        txtName: category.name,
      });
    }
  }, [category])

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log('submit');
    console.log(categoryForm);

    const newCategory = {
      name: categoryForm.txtName,
    };

    if (category && category._id) {
      onUpdate({
        ...newCategory,
        _id: category._id,
      });      
    } else {
      onStore(newCategory);
    }
  }

  const handleInputChange = (ev) => {
    console.log(ev.target.name, ev.target.name);
    setCategoryForm({
      ...categoryForm,
      [ev.target.name]: ev.target.value
    });
  }
  
  return (
    <div className={classnames(className)}>
      <div className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">{!!category ? <Fragment>Update the category: {category.name}</Fragment> : <Fragment>Create a new category</Fragment>}</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="txtName">Name</label>
              <input type="text" className="form-control" id="txtName" name="txtName" required defaultValue={categoryForm['txtName']} onChange={handleInputChange}/>
            </div>
            <button type="submit" className="btn btn-primary">{!!category ? 'Update' : 'Save'} category</button>
          </form>          
        </div>
      </div>
    </div>
  );
};

CategoryEdit.prototypes = {
  className: PropTypes.string,
  viewModel: PropTypes.object
};

export default CategoryEdit;
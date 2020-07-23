import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const ItemEdit = ({className, children, item, onSave = null, onUpdate = null}) => {
  const [itemForm, setItemForm] = useState({
    txtTitle: '',
    txtSynopsis: '',
    txtBody: '',
    ddlCategory: '',
    txtImageUrl: ''
  });

  useEffect(() => {
    if (item) {
      setItemForm({
        txtTitle: item.title,
        txtDescription: item.description,
        ddlCategory: item._categoryId,
      });
    }
  }, [item])

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log('submit');
  }

  const handleInputChange = (ev) => {
    setItemForm({
      ...itemForm,
      [ev.target.name]: ev.target.value
    });
  }

  const handleSelectChange = (ev) => {
    setItemForm({
      ...itemForm,
      [ev.target.name]: ev.target.options[ev.target.selectedIndex].value
    });
  }
  
  return (
    <div className={classnames(className)}>
      <div className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">{!!item ? <Fragment>Update the item: {item.title}</Fragment> : <Fragment>Create a new item</Fragment>}</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="txtTitle">Title</label>
              <input type="text" className="form-control" id="txtTitle" name="txtTitle" required value={itemForm['txtTitle']} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="txtDescription">description</label>
              <textarea className="form-control" id="txtDescription" name="txtDescription" rows="3" required value={itemForm['txtDescription']} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="ddlCategory">Category</label>
              <select className="form-control" id="ddlCategory" name="ddlCategory" onChange={handleSelectChange} value={itemForm['ddlCategory']}>
                {item && item.categories && item.categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">{!!item ? 'Update' : 'Save'} item</button>
          </form>          
        </div>
      </div>
    </div>
  );
};

ItemEdit.prototypes = {
  className: PropTypes.string,
  viewModel: PropTypes.object
};

export default ItemEdit;
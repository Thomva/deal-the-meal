import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CrossIcon } from '../../../components/icons';

const ItemEdit = ({className, children, item, onSave = null, onUpdate = null, onStore = null, categories, users}) => {
  const [itemForm, setItemForm] = useState({
    txtTitle: '',
    txtDescription: '',
    aCategoryIds: [],
    txtPriceCurrency: '',
    numPriceAmount: '',
    ddlOwner: '',
    aImageUrls: [],
    aImageUrlsToDelete: [],
    aImages: [],
  });
  const [allImages, setAllImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  useEffect(() => {
    if (item) {
      let fixedUrls = [...item.imageUrls].map(url => `/api/${url}`);
      
      setItemForm({
        txtTitle: item.title,
        txtDescription: item.description,
        aCategoryIds: item._categoryIds,
        txtPriceCurrency: item.price.currency,
        numPriceAmount: item.price.amount,
        aImageUrls: fixedUrls,
        aImageUrlsToDelete: [],
      });
    }
  }, [item]);

  useEffect(() => {
    if (Array.isArray(users)) {
      setItemForm(prevItem => ({
        ...prevItem,
        ddlOwner: users[0].id,
      }));
    }
  }, [users]);

  useEffect(() => {
    // allImages
    if (Array.isArray(itemForm['aImageUrls'])) {
      if (Array.isArray(itemForm['aImages'])) {
        setAllImages([...itemForm['aImageUrls'], ...itemForm['aImages'].map(i => i.url)]);
      } else {
        setAllImages([...itemForm['aImageUrls']]);
      }
    }
  }, [itemForm['aImageUrls'], itemForm['aImages']])

  useEffect(() => {
    // allImages
    setSelectedCategories(itemForm['aCategoryIds']);
  }, [itemForm['aCategoryIds']])

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log('submit');

    const imageFiles = Array.isArray(itemForm.aImages) && itemForm.aImages.map(i => i.file);
    let imageUrls = Array.isArray(itemForm.aImageUrls) && itemForm.aImageUrls.map(url => url.substring(5));
    const imageUrlsToDelete = Array.isArray(itemForm.aImageUrlsToDelete) && itemForm.aImageUrlsToDelete.map(url => url.substring(5));
    imageUrls = imageUrls.filter(url => !imageUrlsToDelete.includes(url))
    
    const newItem = {
      title: itemForm.txtTitle,
      description: itemForm.txtDescription,
      priceAmount: itemForm.numPriceAmount,
      priceCurrency: itemForm.txtPriceCurrency,
      imageUrls: imageUrls || [],
      imageUrlsToDelete: imageUrlsToDelete,
      images: imageFiles || [],
      order: [],
      _categoryIds: itemForm.aCategoryIds,
    };

    console.log(newItem);

    if (item) {
      onUpdate({
        ...newItem,
        _id: item._id
      });
    } else {
      onStore({
        ...newItem,
        _userId: itemForm.ddlOwner,
      });
    }
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

  const handleCheckboxArrayChange = (ev) => {
    let newIds = Array.isArray(itemForm[ev.target.name]) ? [...itemForm[ev.target.name]] : [];
    if (ev.target.checked) {
      !newIds.includes(ev.target.id) && newIds.push(ev.target.id)
    } else {
      newIds = newIds.filter(id => id !== ev.target.id)
    }
    setItemForm({
      ...itemForm,
      [ev.target.name]: newIds
    });
  }

  const handleImgDelete = (url) => {
    if (Array.isArray(itemForm['aImageUrls']) && itemForm['aImageUrls'].includes(url)) {
      setItemForm({
        ...itemForm,
        aImageUrlsToDelete: [...itemForm['aImageUrlsToDelete'], url],
      });
    } else {
      // Remove from aImages
      let aImages = itemForm['aImages'];
      aImages.splice(aImages.indexOf(aImages.find(i => i.url === url)), 1);
      setItemForm({
        ...itemForm,
        aImages: [...aImages],
      });
    }
  }

  const fileUploadHandler = (e) => {
    const files = Array.from(e.target.files);
    if(!files) return;
    let errorMessage;
    let newFiles = [];
    files.forEach(file => {
      let fileErrorMessage;
      if ((newFiles.length + newFiles.length) > 19) fileErrorMessage = 'You can max add 20 photos per item.';
      if (file && file.size > 1024 * 500) fileErrorMessage = 'File size must be lower then 500 kb.';
      if (file && file.type !== 'image/jpeg' && file.type !== 'image/png') fileErrorMessage = 'File must be of type jpeg or png.';
      if (fileErrorMessage) errorMessage = fileErrorMessage;
      !fileErrorMessage && newFiles.push({file: file, url: URL.createObjectURL(file)});
    });

    if (Array.isArray(itemForm['aImages'])) {
      setItemForm({
        ...itemForm,
        aImages: [...itemForm['aImages'], ...newFiles],
      });
    } else {
      setItemForm({
        ...itemForm,
        aImages: [...newFiles],
      });
    }
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
              <label htmlFor="aImageUrls">Images</label>
              <input type="file" name="aImageUrls" id="aImageUrls" onChange={fileUploadHandler} accept=".jpg,.jpeg,.png" multiple/>
              <div className="images d-flex">
                {allImages && allImages.map(url => {
                  if (Array.isArray(itemForm['aImageUrlsToDelete']) && itemForm['aImageUrlsToDelete'].includes(url)) {
                    return <Fragment key={url} />
                  }
                  return (
                    <div key={url} className="img-thumbnail">
                      <p>{url}</p>
                      <CrossIcon classes="icon--turn45" onClick={() => handleImgDelete(url)}/>
                      <img src={url} alt="" style={{height: '200px'}}/>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="txtTitle">Title</label>
              <input type="text" className="form-control" id="txtTitle" name="txtTitle" required defaultValue={itemForm['txtTitle']} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="txtDescription">Description</label>
              <textarea className="form-control" id="txtDescription" name="txtDescription" rows="3" required defaultValue={itemForm['txtDescription']} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="aCategoryIds">Roles</label>
              <div className="checkboxes">
                {categories && categories.map(category => {
                  const isChecked = (Array.isArray(selectedCategories) && selectedCategories.includes(category.id));
                  return (
                    <div key={category.id}>
                      <input type="checkbox" className="mr-3" id={category.id} name={'aCategoryIds'} checked={isChecked} onChange={handleCheckboxArrayChange}/>
                      <label htmlFor={category.id}>{category.name}</label>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="txtPriceCurrency">Price Currency</label>
              <input type="text" className="form-control" id="txtPriceCurrency" name="txtPriceCurrency" required defaultValue={itemForm['txtPriceCurrency']} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="numPriceAmount">Price Amount</label>
              <input type="number" className="form-control" id="numPriceAmount" name="numPriceAmount" required defaultValue={itemForm['numPriceAmount']} onChange={handleInputChange}/>
            </div>
            {!item && 
              <div className="form-group">
                <label htmlFor="ddlOwner">Owner</label>
                <select className="form-control" id="ddlOwner" name="ddlOwner" onChange={handleSelectChange} value={itemForm['ddlOwner']}>
                  {users && users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
            }
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
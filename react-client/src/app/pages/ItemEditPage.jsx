import { default as React, Fragment, useCallback } from 'react';

import { PageSection, ArrowIcon, Button, DragHandle, CrossIcon, ActionButton } from '../components';
import * as Routes from '../routes';
import { Input, TextArea, CheckboxList, Checkbox } from '../components/inputs';
import { useApi, useAuth, useModal } from '../services';
import { useState } from 'react';
import { useEffect } from 'react';
import { default as classnames } from 'classnames';
import { useParams, useHistory } from 'react-router-dom';
import Utils from '../utilities/Utils'
import { apiConfig } from '../config';

const ItemEditPage = ({ children }) => {
  const [ isOwn, setIsOwn ] = useState();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { showModal } = useModal();
  const { findAllCategories, findItem, updateItem, storeItem } = useApi();
  const [ categories, setCategories ] = useState();
  const [ allImages, setAllImages ] = useState([]);
  const [ orderedImages, setOrderedImages ] = useState({});
  const [ imageError, setImageError ] = useState([]);
  const [ isFree, setIsFree ] = useState(false);
  const [ item, setItem ] = useState();
  const [ newItem, setNewItem ] = useState({
    priceAmount: null,
    priceCurrency: '€',
    title: null,
    description: null,
    imageUrls: [],
    images: [],
    imageUrlsToDelete: [],
    _categoryIds: [],
    _userId: null,
  });
  const [ errors, setErrors ] = useState();
  const [ isDragging, setIsDragging ] = useState(false);
  const [ tempOrder, setTempOrder ] = useState();
  const history = useHistory();

  const fetchCategories = useCallback(
    async (itemCategories = null) => {
      let fetchedCategories = [];
      fetchedCategories = await findAllCategories();
      const newCategories = fetchedCategories.map((category) => {
        return ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          checked: itemCategories ? (itemCategories.includes(category.id) && true) : false,
        })
      });
      setCategories(newCategories);
    },
    [findAllCategories]
  );

  const fetchItem = useCallback(
    async (id) => {
      const fetchedItem = await findItem(id);
      setItem(fetchedItem);
      fetchedItem && fetchedItem.price.amount < 0.00 && setIsFree(true);
    }
    , [findItem]
  );


  useEffect(() => {
    id && fetchItem(id);
  }, [fetchItem, id]);

  useEffect(() => {
    !currentUser && history.push(`${Routes.LANDING}`);
    currentUser && setNewItem(prevItem => ({
      ...prevItem,
      _userId: currentUser.id,
    }));
    item && currentUser && setIsOwn(item._userId === currentUser.id);
  }, [currentUser, id, item, history]);

  useEffect(() => {
    fetchCategories(item && item._categoryIds);
  }, [fetchCategories, item]);
  
  useEffect(() => {
    if (id && (isOwn === false)) {
      currentUser ?
        history.push(`${Routes.USER_DETAIL.replace(':id', currentUser.id)}`) :
        history.push(`${Routes.LANDING}`);
    }
  }, [isOwn, id, history, currentUser]);
  
  useEffect(() => {
    item && setNewItem({
      priceAmount: item.price.amount,
      priceCurrency: item.price.currency,
      title: item.title,
      description: item.description,
      imageUrls: item.imageUrls,
      images: [],
      imageUrlsToDelete: [],
      _categoryIds: item._categoryIds,
      _userId: item._userId,
    });
  }, [item]);

  useEffect(() => {
    let inputUrls = newItem.images.map((image) => !!image && image.url);
    
    setOrderedImages(oIs => {
      if (Object.keys(oIs).length < 1) {
        let newOrderedImages = {};
        newItem.imageUrls.forEach((url, i) => {
          newOrderedImages[i] = {
            url: url,
          }
        });
        return newOrderedImages;
      }
      return oIs;
    });
    setAllImages(prevImgs => ([
      ...newItem.imageUrls,
      ...inputUrls,
    ]));
  }, [newItem]);

  const isFreeChangeHandler = (isChecked) => {
    setIsFree(isChecked);
  }

  const titleChangeHandler = (e) => {
    const newTitle = e.target.value;
    
    setNewItem(prevItem => ({
      ...prevItem,
      title: typeof newTitle === 'string' ? newTitle.trim() : null,
    }));
  }

  const descChangeHandler = (e) => {
    const newDesc = e.target.value;
    setNewItem(prevItem => ({
      ...prevItem,
      description: typeof newDesc === 'string' ? newDesc.trim() : null,
    }));
  }

  const catChangeHandler = (checkedCategories) => {
    const checkedCategoryIds = checkedCategories.map((cat) => cat.id);
    setNewItem(prevItem => ({
      ...prevItem,
      _categoryIds: checkedCategoryIds || [],
    }));
  }

  const formatPrice = (number) => {
    return parseFloat(Utils.clamp(parseFloat(number), 0.00, 99.99).toFixed(2));
  }

  const priceChangeHandler = (e) => {
    const newPrice = formatPrice(e.target.value);
    setNewItem(prevItem => ({
      ...prevItem,
      priceAmount: !isNaN(newPrice) ? newPrice : null,
    }));
  }

  const fileUploadHandler = (e) => {
    setImageError('');
    const files = Array.from(e.target.files);
    if(!files) return;
    let errorMessage;
    let newFiles = [];
    files.forEach(file => {
      let fileErrorMessage;
      if ((newItem.images.length + newItem.imageUrls.length) > 19) fileErrorMessage = 'You can max add 20 photos per item.';
      if (file && file.size > 1024 * 500) fileErrorMessage = 'File size must be lower then 500 kb.';
      if (file && file.type !== 'image/jpeg' && file.type !== 'image/png') fileErrorMessage = 'File must be of type jpeg or png.';
      if (fileErrorMessage) errorMessage = fileErrorMessage;
      !fileErrorMessage && newFiles.push({file: file, url: URL.createObjectURL(file)});
    });

    if (errorMessage) {
      console.log(errorMessage);
      setImageError(errorMessage);
    }

    setNewItem(prevItem => ({
      ...prevItem,
      images: [...prevItem.images, ...newFiles],
    }));

    // Add images to orderedImages
    let newOrderedImages = {...orderedImages};
    newFiles.forEach((file, i) => {
      newOrderedImages[(Object.keys(orderedImages).length) + i] = {
        ...file,
      }
    });
    setOrderedImages(prevItem => ({
      ...newOrderedImages,
    }))
  }

  const deleteImgClickHandler = async (url) => {
    // Remove from orderedImages
    const orderedKeys = Object.keys(orderedImages);
    let urlInOrderedImageUrlsIndex;
    orderedKeys.forEach(key => {
      if (orderedImages[key].url === url) {
        urlInOrderedImageUrlsIndex = key;
      }
    });

    let newOrderedImages = {...orderedImages};
    orderedKeys.forEach(key => {
      if (key === urlInOrderedImageUrlsIndex) {
        // Delete
        delete newOrderedImages[key];
      } else if (parseInt(key) > parseInt(urlInOrderedImageUrlsIndex)) {
        // Shift places
        newOrderedImages[(parseInt(key) - 1)] = orderedImages[key];
      }

      if (parseInt(key) === (orderedKeys.length - 1)) {
        delete newOrderedImages[key];
      }
    });
    setOrderedImages(newOrderedImages);

    // If url is in newItem.imageUrls: remove
    const urlInImageUrlsIndex = newItem.imageUrls.indexOf(url);
    if (urlInImageUrlsIndex !== -1) {
      const newImageUrls = newItem.imageUrls;
      newImageUrls.splice(urlInImageUrlsIndex, 1);
      setNewItem(prevItem => ({
        ...prevItem,
        imageUrls: newImageUrls,
      }))

      if (url.startsWith('uploads/')) {
        setNewItem(prevItem => ({
          ...prevItem,
          imageUrlsToDelete: [...prevItem.imageUrlsToDelete, url],
        }));
      }
      return;
    }

    const foundImage = newItem.images.find(i => i.url === url);
    const urlInImageIndex = newItem.images.indexOf(foundImage);
    const newImages = newItem.images;
    newImages.splice(urlInImageIndex, 1);
    setNewItem(prevItem => ({
      ...prevItem,
      images: newImages,
    }))
  }

  const publishClickHandler = async (e) => {
    // If free checked: price = 0
    let errorMessages = [];
    (allImages.length < 1 || newItem.imageUrls === null) && errorMessages.push('Please upload at least 1 photo.');
    (newItem.title === '' || newItem.title === null) && errorMessages.push('Please fill in the title.');
    (newItem.description === '' || newItem.description === null) && errorMessages.push('Please fill in the description.');
    (newItem._categoryIds.length < 1 || newItem._categoryIds === null) && errorMessages.push('Please choose at least 1 category.');
    (newItem.priceAmount === '' || newItem.priceAmount === null) && isFree !== true && errorMessages.push('Please choose a price.');
    
    setErrors(errorMessages);

    let newImages = [];
    const orderedUrls = [];
    let order = Object.keys(orderedImages).map(key => {
      if (!orderedImages[key].file) {
        orderedUrls.push(orderedImages[key].url);
        return false;
      }
      newImages.push(orderedImages[key].file);
      return true;
    });
    console.log(newImages);

    const saveItem = {
      ...newItem,
      priceAmount: isFree ? 0.00 : newItem.priceAmount,
      priceCurrency: '€',
      images: newImages,
      imageUrls: orderedUrls,
      _id: item && item.id,
      order,
    };

    if (errorMessages.length > 0) return;

    // Save updated item
    try {
      if (item) {
        await updateItem(saveItem);
        history.push(`${Routes.USER_DETAIL.replace(':id', currentUser.id)}`);
        return null;
      }
      console.log('store new item');
      await storeItem(saveItem);
      history.push(`${Routes.USER_DETAIL.replace(':id', currentUser.id)}`);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  const startDragging = (e) => {
    setIsDragging(e.target.id);
  }

  
  const endDragging = (e) => {
    setIsDragging(false);
    setTempOrder(null);
  }
  
  const onDragEnter = (e) => {
    const eventId = e.target.id;
    if (!eventId || eventId === '') return;
    const order = !tempOrder ? isDragging : tempOrder;
    shiftOrder(order, eventId);
  }

  const shiftOrder = (orderToShift, newOrder) => {
    if (orderToShift === newOrder) return;

    const orderedKeys = Object.keys(orderedImages);
    let orderedImagesAsArray = [];
    orderedKeys.forEach(key => {
      orderedImagesAsArray.push(orderedImages[key]);
    });
    const imageToShift = orderedImagesAsArray.splice(parseInt(orderToShift), 1)[0];
    orderedImagesAsArray.splice(parseInt(newOrder), 0, imageToShift);
    let newOrderedImages = {};
    orderedImagesAsArray.map((image, i) => {
      newOrderedImages[i] = image;
      return null;
    });
    setTempOrder(newOrder);
    setOrderedImages(newOrderedImages);
  }
  
  const cancelClickHandler = (e) => {
    showModal('cancelItem', () => {
      console.log('cancelled');
      history.go(-1);
    });
  }

	return (
		<Fragment>
			<PageSection classes="itemEdit" title={'ItemEdit'}>
				<section className="itemEdit__photoSection">
					<h1 className="itemEdit__title">Photos</h1>
					<div className="itemEdit__uploadZone">
            <CrossIcon color="#ff6c31" classes="itemEdit__uploadZoneIcon" />
            <input type="file" name="inputFile" id="inputFile" onChange={fileUploadHandler} accept=".jpg,.jpeg,.png" multiple/>
            {imageError && imageError.length > 0 && (
							<div className="itemEdit__error itemEdit__error--upload">
								<ArrowIcon classes="Icon icon--turn180" color="#ff6c31"/> <div className="itemEdit__errorMessage itemEdit__errorMessage--upload">{imageError}</div>
							</div>
						)}
          </div>
          <div className="itemEdit__photoOrder">
            {Object.keys(orderedImages).map((orderIndex) => {
              const image = orderedImages[orderIndex];
              const url = image.url;
              return (
                <div key={orderIndex} className="itemEdit__photoElement">
                  <div className="itemEdit__photoNumber">{parseInt(orderIndex) + 1}</div>
                    <div
                    className={classnames('itemEdit__photoDraggable', isDragging && orderIndex === isDragging && 'itemEdit__photoDraggable--preview')}
                    id={orderIndex}
                    onDragEndCapture={endDragging}
                    onDragStartCapture={startDragging}
                    onDragEnterCapture={onDragEnter}
                    draggable
                    >
                      <img className="itemEdit__photo" key={orderIndex} src={url.startsWith('uploads/') ? `${apiConfig.baseURL}/${url}` : url} alt="test" draggable="false"/>
                      <ActionButton variant="delete" classes="itemEdit__deleteButton" onClick={() => deleteImgClickHandler(url)} />

                      <div className="itemEdit__photoBottom">
                        <DragHandle color="#f5f2ca" />
                      </div>
                    </div>
                </div>
              )
            })}
          </div>
				</section>
				<section className="itemEdit__generalSection">
					<h1 className="itemEdit__title">General</h1>
					<Input
						type="text"
						classes="itemEdit__input itemEdit__input--title"
						label="Title"
            placeholder="HomeMade Jam"
            defaultValue={item && item.title}
						name="inputTitle"
            isRequired={true}
            onChange={titleChangeHandler}
					/>
					<TextArea
						classes="itemEdit__input itemEdit__input--description"
						label="Description"
						placeholder="Homemade strawberry jam made from homegrown strawberries. Expiration date: around 6/2021"
						name="inputDescription"
            isRequired={true}
            defaultValue={item && item.description}
            onChange={descChangeHandler}
					/>
          <CheckboxList classes="itemEdit__categories" choices={categories} isRequired={true} label="Category" onChange={catChangeHandler} />
				</section>
				<section className="itemEdit__priceSection">
					<h1 className="itemEdit__title">Price</h1>
          <Checkbox classes="itemEdit__freeCheckbox" id="freeCheckbox" label="Free" name="freeCheckbox" onChange={isFreeChangeHandler} />
          <div className={classnames('itemEdit__priceInput', isFree && 'itemEdit__priceInput--disabled')}>
            <span className="itemEdit__priceCurrency">€</span>
            <Input type="number" placeholder="2,00" name="priceInput" classes="itemEdit__priceInputfield" isRequired={true} min={0} max={99} pattern={.01} defaultValue={item && (item.price.amount > 0.00) && item.price.amount} onChange={priceChangeHandler} onBlur={(e) => e.target.value = newItem.priceAmount} />
          </div>
				</section>
        <div className="itemEdit__buttonContainer">
          <Button text="Publish" onClick={publishClickHandler} />
          <Button text="Cancel" variant="light" onClick={cancelClickHandler} />
        </div>

        <section className="itemEdit__errorSection">
          {errors && errors.map((error, i) => (
            <h4 key={i} className="itemEdit__error">{error}</h4>
          ))}
        </section>
			</PageSection>
		</Fragment>
	);
};

export default ItemEditPage;

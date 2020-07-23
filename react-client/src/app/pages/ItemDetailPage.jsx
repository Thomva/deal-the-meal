import { default as React, useEffect, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router';
import { useApi } from '../services';
import * as Routes from '../routes';
import { default as classnames } from 'classnames';

import { PageSection, Button, LocationIcon, SearchHeader } from '../components';
import Utils from '../utilities/Utils';
import { RatingStars } from '../components/rating';
import ImageGallery from '../components/images/ImageGallery';
import { LoadingIndicator } from '../components/loading';

const ItemDetailPage = ({children}) => {
  const { id } = useParams();
  const { findItem } = useApi();
  const [ item, setItem ] = useState(null);
  const history = useHistory();

  const fetchItem = useCallback(
    async (itemId) => {
      const fetchedItem = await findItem(itemId);
      setItem(fetchedItem);
    }, [findItem]
  );

  const price = () => {
    const itemPrice = item && parseFloat(item.price.amount);
    
    return (itemPrice && itemPrice > 0) ? `${item.price.currency}${itemPrice.toFixed(2).replace('.', ',')}` : 'Free';
  }

  useEffect(() => {
    fetchItem(id);
  }, [id, fetchItem]);

  const senMessageClickHandler = (e) => {
    // if own: edit,
    // if someone elses: send message
    item && history.push(`${Routes.MESSAGES_NEW.replace(':id', item._id)}`);
  }

  const userClickHandler = (userId) => {
    history.push(`${Routes.USER_DETAIL.replace(':id', userId)}`);
  }

  const categoryClickHandler = (categoryId) => {
    history.push(`${Routes.RESULTS}?c=${categoryId}`);
  }

  return item && item !== undefined ? (
    <>
      <SearchHeader />
      <PageSection classes="itemDetail page-section--centered" title={'ItemDetail'}>
        <div className="itemDetail__side">
          <ImageGallery images={item.imageUrls} />
        </div>
        <div className="itemDetail__side">
          <div className="itemDetail__top">
            <h1 className="itemDetail__title">{item.title}</h1>
            <div className="itemDetail__categoryContainer">
              {item.categories.map((category) => (
                <div key={category.id} className="clickableText itemDetail__category" onClick={() => categoryClickHandler(category.id)}>{category.name}</div>
              ))}
            </div>
            <p className="itemDetail__paragraph">{item.description}</p>
            <p className="itemDetail__timeAgo">{Utils.timeAgo(item._createdAt)}</p>
          </div>
          <div className="itemDetail__top">
            <div className="itemDetail__infoCard" onClick={() => userClickHandler(item.user.id)}>
              <div className="itemDetail__priceContainer">
                <div className="itemDetail__price">{price()}</div>
              </div>
              <div className="itemDetail__userInfo">
                <div className="itemDetail__userInfo--left">
                  <div className="itemDetail__userName">{item.user.name}</div>
                  <RatingStars classes={classnames('itemDetail__userRating', !item.user.userrating.average && 'itemDetail__userRating--hide')} rating={item.user.userrating.average} />
                </div>
                <div className="itemDetail__userInfo--right">
                  <LocationIcon />
                  <div className="itemDetail__userLocation">{item.user.location && item.user.location.name}</div>
                </div>
              </div>
            </div>
            <Button classes="itemDetail__messageBtn" text="Send Message" onClick={senMessageClickHandler} />
          </div>
        </div>
      </PageSection>
    </>) : (
      <LoadingIndicator />
    );
};

export default ItemDetailPage;
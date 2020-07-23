import { default as React, useState } from 'react';
import { default as classnames } from 'classnames';
import { useEffect } from 'react';
import { useApi } from '../../services';
import Card from './Card';
import { ArrowIcon } from '../icons';
import { useCallback } from 'react';

const CardCarousel = ({ max = null, limit = 3, userId = null, isOwn = false }) => {
  const [itemResponse, setItemrespons] = useState();
  const { findAllItems } = useApi();

  const maxPages = max ? Math.ceil(max / limit) : Infinity;

  const fetchItems = useCallback(
    (itemRes = null, page = 1 ) => {
      const fetchIs = async ( itemRes, page ) => {
        let fetchedItems = {};
        if (itemRes && limit) {
          const total = itemRes.total;
          const tempLastLimit = max % limit;
          const lastLimit = tempLastLimit === 0 ? limit : tempLastLimit;
    
          fetchedItems = await findAllItems({
            limit: max >= total ? limit : (page < maxPages ? limit : lastLimit),
            skip: page,
            userId: userId || '',
            showDeleted: isOwn || '',
          });
        } else {
          fetchedItems = await findAllItems({
            limit: (max && max < limit) ? max : limit,
            skip: page,
            userId: userId || '',
            showDeleted: isOwn || '',
          });
        }
        setItemrespons(fetchedItems);
      }
      fetchIs(itemRes, page);
    },
    [max, limit, findAllItems, maxPages, isOwn, userId]
  ) 

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const isLastPage = () => {
    if (itemResponse) {
      return max ? (itemResponse.page > (maxPages - 1)) : (itemResponse.page === itemResponse.pages);
    }
    return false;
  }

  const isFirstPage = () => {
    if (itemResponse) {
      return itemResponse.page === 1;
    }
    return true;
  }
  
  const clickHandlerPrev = (e) => {
    itemResponse &&
      !isFirstPage() &&
      fetchItems(itemResponse, itemResponse.page - 1);
  }

  const clickHandlerNext = (e) => {
    itemResponse &&
      !isLastPage() &&
      fetchItems(itemResponse, itemResponse.page + 1);
  }

	return (
    <div className="cardCarousel">
      <ArrowIcon color="#ff6c31" classes={classnames('icon--turn180', !isFirstPage() ? 'icon--clickable' : 'icon--hide')} onClick={(e) => clickHandlerPrev(e)} />
      <div className="cardCarousel__cardsContainer">
        {itemResponse && itemResponse.docs.map((item) => {
          if(item) return <Card key={item.id} item={item} type={userId && 'noUser'} isOwn={isOwn} />
          return <></>
        })}

      </div>
      <ArrowIcon color="#ff6c31" classes={!isLastPage() ? 'icon--clickable' : 'icon--hide'}onClick={(e) => clickHandlerNext(e)} />
    </div>
	);
};

export default CardCarousel;

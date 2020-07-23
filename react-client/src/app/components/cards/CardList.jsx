import { default as React, useState } from 'react';
import { default as classnames } from 'classnames';
import { Button } from '../buttons';
import { useEffect } from 'react';
import { useApi } from '../../services';
import Card from './Card';
import { useCallback } from 'react';

const CardList = ({ limit = 8, sortBy, filters}) => {
  const batchSize = limit;
  const [amount, setAmount] = useState(batchSize);
  const [itemResponse, setItemrespons] = useState();
  const { findAllItems } = useApi();

  const fetchItems = useCallback(
    async ( page = 1 ) => {
      let fetchedItems = {};
      fetchedItems = await findAllItems({
        limit: amount,
        skip: page,
        sortBy: JSON.stringify(sortBy),
        title: filters.title || '',
        category: filters.category || '-1',
        location:  typeof filters.location === 'string' ? filters.location : '',
      });
      setItemrespons(fetchedItems);
    },
    [findAllItems, filters, amount, sortBy]
  );

  useEffect(() => {
    fetchItems();
  }, [filters, amount, fetchItems]);

  useEffect(() => {
    setAmount(batchSize);
  }, [filters, batchSize]);

  const isLastPage = () => {
    if (itemResponse) {
      return (itemResponse.page < itemResponse.pages);
    }
    return false;
  }

  const getContainerAmountClass = () => {
    if (!itemResponse) return '';
    switch (itemResponse.docs.length) {
      case 1:
        return 'cardList__cardsContainer--single';
      case 2:
        return 'cardList__cardsContainer--double';
      case 3:
        return 'cardList__cardsContainer--triple';
    
      default:
        return '';
    }
  }

  const handleMore = (e) => {
    setAmount(amount + batchSize);
  };

	return (
    <div className="cardList">
      <div className={classnames('cardList__cardsContainer', getContainerAmountClass())}>
        {itemResponse && itemResponse.docs.map((item) => (
          <Card key={item.id} item={item} classes="card--compact" />
          ))}
      </div>
      {isLastPage() && <Button onClick={handleMore} text="More" classes="button--mt100" />}
    </div>
    );
};

export default CardList;

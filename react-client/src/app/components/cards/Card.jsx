import { default as React, useCallback } from 'react';
import { default as classnames } from 'classnames';
import * as Routes from '../../routes';
import { useHistory } from 'react-router-dom';
import Utils from '../../utilities/Utils';
import { ActionButton } from '../buttons';
import { useApi, useModal } from '../../services';
import { useState } from 'react';
import { apiConfig } from '../../config';
import { isArray } from 'util';

const Card = ({ classes, item, type, isOwn }) => {
  const history = useHistory();
  const { deleteItem } = useApi();
  const { showModal } = useModal();
  const [ givenItem, setGiveItem ] = useState(item);

  const showAction = useCallback(() => {
    return isOwn;
  }, [isOwn]);

  const getImgSrc = useCallback(
    () => {
      if (!givenItem) return;
      if (!isArray(givenItem.imageUrls) || !givenItem.imageUrls[0]) return;
      if (givenItem.imageUrls[0].startsWith('uploads/')) return `${apiConfig.baseURL}/${givenItem.imageUrls[0]}`;
      return givenItem.imageUrls[0];
    }, [givenItem]
  );

  const cardClickHandler = (itemId) => {
    history.push(`${Routes.ITEM_DETAIL.replace(':id', itemId)}`);
  }

  const showHideClickHandler = async () => {
    const response = await deleteItem(givenItem.id, givenItem._deletedAt ? 'softundelete' : 'softdelete');
    response.item && setGiveItem(response.item);
  }

  const editClickHandler = async () => {
    history.push(`${Routes.ITEM_EDIT.replace(':id', givenItem.id)}`);
  }

  const deleteClickHandler = async () => {
    showModal('deleteItem', async () => {
      console.log('deleting');
      // Loading
      return deleteItem(givenItem.id, 'delete');
    }, () => {
      console.log('done! refreshing page');
      history.go(0);
    });
  }

	return (
    <div className="cardContainer">
      { showAction() &&
        <div className="actionButtons actionButtons--triple">
          <ActionButton variant="edit" onClick={editClickHandler} />
          <ActionButton variant={givenItem._deletedAt ? 'show' : 'hide'} onClick={showHideClickHandler} />
          <ActionButton variant="delete" onClick={deleteClickHandler} />
        </div>
      }
      <div className={classnames('card', classes)} key={givenItem.id} onClick={() => cardClickHandler(givenItem.id)}>
        {givenItem._deletedAt && <div className="card__hideContainer"></div> }
        <div className="card__top">
          <h2 className="card__title">{givenItem.title}</h2>
        </div>
        <div className="card__imageContainer">
          <img src={getImgSrc()} alt={givenItem.title} className="card__image"/>
        </div>
        <div className="card__bottom">
          <div className="card__info">
            {(type !== 'noUser') && <h3 className="card__userName">{givenItem.user && givenItem.user.name}</h3>}
            <h4 className="card__timeAgo">{Utils.timeAgo(givenItem._createdAt)}</h4>
          </div>
          <div className="card__moreInfo">More Info</div>
        </div>
      </div>
    </div>
	);
};

export default Card;

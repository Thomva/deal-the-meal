import React, { useEffect, useState, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import * as Routes from '../../routes';
import { useApi } from '../../services';
import { useToast } from '../services';
import ReviewEdit from '../components/review/ReviewEdit';

const ReviewEditPage = ({ children }) => {
  const { addToast } = useToast();
  const { id } = useParams();
  const [ review, setReview ] = useState();
  const { findReview, findAllItems, findAllUsers, updateReview, storeReview } = useApi();
  const [ users, setUsers ] = useState();
  // const [ receiver, setReceiver ] = useState();
  console.log('tete');

  let history = useHistory();


  // const getchUsers = useCallback(
  useEffect(() => {
      const fetchUsers = async () => {        
        const data = await findAllUsers();
        // Array.isArray(data) && data.forEach(user => {
        //   const reviews = user.userrating.reviews;
        //   const foundReview = Array.isArray(reviews) && reviews.find(r => r._id === id);
        //   !!foundReview && setReceiver(user.id);
        // })
        const formattedData = data.map(d => ({
          id: d.id,
          name: `${d.firstName} ${d.lastName}`,
        }))
        // console.log(formattedData);
        setUsers(formattedData);
      }
  
      fetchUsers();
    }, [findAllUsers]);

  useEffect(() => {
    const fetchReview = async () => {        
      if (id) {
        const data = await findReview(id);
        setReview(data);
        // getchUsers();
      }
    }

    fetchReview();
  }, [findReview, id]);

  // useEffect(() => {
  //   if (review && receiver) {
  //     setReview(prevReview => ({
  //       ...prevReview,
  //       receiver,
  //     }));
  //   }
  // }, [receiver]);

  const handleOnUpdate = async (review) => {
    const updatedReview = await updateReview(review);
    addToast({
      title: `Administration: Update Review`,
      review: `Successfully updated an existing review with id: ${updatedReview._id} and name: ${updatedReview.name}`
    });
    history.push(Routes.BACKOFFICE_REVIEWS);
  }

  const handleOnStore = async (review) => {
    const updatedReview = await storeReview(review);
    addToast({
      title: `Administration: Created Review`,
      review: `Successfully created a new review with name: ${updatedReview.name}`
    });
    history.push(Routes.BACKOFFICE_REVIEWS);
  }
  
  return (
    <div className="container">
      <div className="row">
        <ReviewEdit className="col-12 col-sm-12 col-md-12 col-lg-12 ol-xl-6 review-edit" review={review} onUpdate={handleOnUpdate} onStore={handleOnStore} users={users}/>
      </div>
    </div>
  )
};
export default ReviewEditPage;
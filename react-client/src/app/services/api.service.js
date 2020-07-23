import { default as React, useContext, createContext } from 'react';

import { apiConfig } from '../config';

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {
  const BASE_URL = `${apiConfig.baseURL}`;

  const findAllUsers = async (query = null) => {
    let url = `${BASE_URL}/users`;
    if (query !== null) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(query);
    }
    const response = await fetch(url);
    return response.json();
  }

  const findAllItems = async (query = null) => {
    let url = `${BASE_URL}/items`;
    if (query !== null) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(query);
    }
    const response = await fetch(url);
    return response.json();
  }

  const findAllRoles = async (query = null) => {
    let url = `${BASE_URL}/roles`;
    if (query !== null) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(query);
    }
    const response = await fetch(url);
    return response.json();
  }

  const findAllCategories = async (query = null) => {
    let url = `${BASE_URL}/categories`;
    if (query !== null) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(query);
    }
    const response = await fetch(url);
    return response.json();
  }

  const findAllMessages = async (query = null) => {
    let url = `${BASE_URL}/messages`;
    if (query !== null) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(query);
    }
    const response = await fetch(url);
    return response.json();
  }

  const findAllReviews = async (query = null) => {
    let url = `${BASE_URL}/reviews`;
    if (query !== null) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(query);
    }
    const response = await fetch(url);
    return response.json();
  }
  

  const findItem = async (id) => {
    let url = `${BASE_URL}/items/${id}`;
    const response = await fetch(url);
    return response.json();
  }

  const findUser = async (id) => {
    let url = `${BASE_URL}/users/${id}`;
    const response = await fetch(url);
    return response.json();
  }

  const findCategory = async (id) => {
    let url = `${BASE_URL}/categories/${id}`;
    const response = await fetch(url);
    return response.json();
  }

  const findRole = async (id) => {
    let url = `${BASE_URL}/roles/${id}`;
    const response = await fetch(url);
    return response.json();
  }

  const findMessage = async (id) => {
    let url = `${BASE_URL}/messages/${id}`;
    const response = await fetch(url);
    return response.json();
  }

  const findReview = async (id) => {
    let url = `${BASE_URL}/reviews/${id}`;
    const response = await fetch(url);
    return response.json();
  }


  const updateUser = async (user) => {
    const options = {
      method: "put",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    };

    let url = `${BASE_URL}/users/${user._id}`;
    const response = await fetch(url, options);
    return response.json();
  }

  const updateCategory = async (category) => {
    console.log('update category');
    console.log(category);
    const options = {
      method: "put",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    };

    let url = `${BASE_URL}/categories/${category._id}`;
    const response = await fetch(url, options);
    return response.json();
  }

  const updateRole = async (role) => {
    console.log('update role');
    console.log(role);
    const options = {
      method: "put",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(role)
    };

    let url = `${BASE_URL}/roles/${role._id}`;
    const response = await fetch(url, options);
    return response.json();
  }

  const updateMessage = async (message) => {
    console.log('update message');
    console.log(message);
    const options = {
      method: "put",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    };

    let url = `${BASE_URL}/messages/${message._id}`;
    const response = await fetch(url, options);
    return response.json();
  }

  const updateReview = async (review) => {
    console.log('update review');
    console.log(review);
    const options = {
      method: "put",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(review)
    };

    let url = `${BASE_URL}/reviews/${review._id}`;
    const response = await fetch(url, options);
    return response.json();
  }

  const updateItem = async (item) => {
    let formData = new FormData();
    Object.keys(item).forEach(key => formData.append(key, item[key]));
    formData.delete('images');
    item.images.forEach(image => {
      console.log(image);
      formData.append('images', image, image.name)
    });
    formData.delete('imageUrls');
    item.imageUrls.forEach(imageUrl => {
      formData.append('imageUrls', imageUrl)
    });
    formData.delete('order');
    item.order.forEach(isNewImg => {
      formData.append('order', isNewImg)
    });
    formData.delete('imageUrlsToDelete');
    item.imageUrlsToDelete.forEach(imageUrl => {
      formData.append('imageUrlsToDelete', imageUrl)
    });
    formData.delete('_categoryIds');
    item._categoryIds.forEach(id => {
      formData.append('_categoryIds', id)
    });
    console.log(item);
    for(let pair of formData.entries()) {
      console.log(pair[0]+ ', '+ pair[1]); 
    }
    const options = {
      method: "put",
      body: formData
    };

    let url = `${BASE_URL}/items/${item._id}`;
    const response = await fetch(url, options);
    return response.json();
  }

  const storeItem = async (item) => {
    let formData = new FormData();
    Object.keys(item).forEach(key => formData.append(key, item[key]));
    formData.delete('images');
    item.images.forEach(image => {
      console.log(image);
      formData.append('images', image, image.name)
    });
    formData.delete('imageUrls');
    item.imageUrls.forEach(imageUrl => {
      formData.append('imageUrls', imageUrl)
    });
    formData.delete('order');
    item.order.forEach(isNewImg => {
      formData.append('order', isNewImg)
    });
    formData.delete('_categoryIds');
    item._categoryIds.forEach(id => {
      formData.append('_categoryIds', id)
    });
    const options = {
      method: "post",
      body: formData
    };

    let url = `${BASE_URL}/items`;
    const response = await fetch(url, options);
    return response.json();
  }

  const storeUser = async (user) => {
    const options = {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    };

    let url = `${BASE_URL}/users`;
    const response = await fetch(url, options);
    return response.json();
  }

  const storeMessage = async (message) => {
    const options = {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    };

    let url = `${BASE_URL}/messages`;
    const response = await fetch(url, options);
    return response.json();
  }

  const storeCategory = async (category) => {
    console.log('store category');
    const options = {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    };

    let url = `${BASE_URL}/categories`;
    const response = await fetch(url, options);
    return response.json();
  }

  const storeRole = async (role) => {
    console.log('store role');
    const options = {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(role)
    };

    let url = `${BASE_URL}/roles`;
    const response = await fetch(url, options);
    return response.json();
  }

  const storeReview = async (review) => {
    const options = {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(review)
    };

    let url = `${BASE_URL}/reviews`;
    const response = await fetch(url, options);
    return response.json();
  }


  const deleteItem = async (id, mode = '') => {
    const options = {
      method: "delete",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }
    const response = await fetch(`${BASE_URL}/items/${id}?mode=${mode}`, options);
    return await response.json();
  }

  const deleteUser = async (id, mode = '') => {
    const options = {
      method: "delete",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }
    const response = await fetch(`${BASE_URL}/users/${id}?mode=${mode}`, options);
    return await response.json();
  }

  const deleteCategory = async (id, mode = '') => {
    const options = {
      method: "delete",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }
    const response = await fetch(`${BASE_URL}/categories/${id}?mode=${mode}`, options);
    return await response.json();
  }

  const deleteRole = async (id, mode = '') => {
    const options = {
      method: "delete",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }
    const response = await fetch(`${BASE_URL}/roles/${id}?mode=${mode}`, options);
    return await response.json();
  }

  const deleteMessage = async (id, mode = '') => {
    const options = {
      method: "delete",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }
    const response = await fetch(`${BASE_URL}/messages/${id}?mode=${mode}`, options);
    return await response.json();
  }

  const deleteReview = async (id, mode = '') => {
    const options = {
      method: "delete",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }
    const response = await fetch(`${BASE_URL}/reviews/${id}?mode=${mode}`, options);
    return await response.json();
  }



  const findReviewByUsers = async (data) => {
    let url = `${BASE_URL}/users/${data.ownerId}`;
    const response = await fetch(url);
    const json = await response.json();

    const reviews = json.userrating.reviews;
    const matchingReview = reviews.find(r => r._userId === data.assessorId);
    console.log(matchingReview);

    return matchingReview;
  }

  const queryParams = (options) => {
    return Object.keys(options)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(options[key])).join('&');
  }

  const exports = {
    deleteCategory,
    deleteItem,
    deleteMessage,
    deleteReview,
    deleteRole,
    deleteUser,
    findCategory,
    findAllCategories,
    findAllItems,
    findAllMessages,
    findAllReviews,
    findAllRoles,
    findAllUsers,
    findItem,
    findMessage,
    findReview,
    findReviewByUsers,
    findRole,
    findUser,
    storeCategory,
    storeItem,
    storeMessage,
    storeReview,
    storeRole,
    storeUser,
    updateCategory,
    updateItem,
    updateMessage,
    updateReview,
    updateRole,
    updateUser,
  }

  return (
    <ApiContext.Provider value={exports}>
      {children}
    </ApiContext.Provider>
  );
};

export {
  ApiContext,
  ApiProvider,
  useApi,
}
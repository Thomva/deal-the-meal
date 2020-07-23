// import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';

// import * as Routes from '../../routes';
// import { PostEdit } from '../components';
// import { useApi } from '../../services';
// import { useToast } from '../services';


// const PostCreatePage = ({ children }) => {
//   const { addToast } = useToast();
//   const { createPostViewModel, storePost } = useApi();
//   const [ postViewModel, setPostViewModel ] = useState(null);

//   let history = useHistory();

//   useEffect(() => {
//     const fetchPostViewModel = async () => {        
//       const data = await createPostViewModel();
//       setPostViewModel(data);
//     }

//     fetchPostViewModel();    
//   }, [createPostViewModel]);

//   const handleOnSave = async (post) => {
//     const storedPost = await storePost(post);
//     addToast({
//       title: `Administration: New Post`,
//       message: `Successfully created a new post with id: ${storedPost._id} and title: ${storedPost.title}`
//     });
//     history.push(Routes.BACKOFFICE_POSTS);
//   }
  
//   return (
//     <div className="container">
//       <div className="row">
//         <PostEdit className="col-12 col-sm-12 col-md-12 col-lg-12 ol-xl-6 post-edit" viewModel={postViewModel} onSave={handleOnSave} />
//       </div>
//     </div>
//   )
// };
// export default PostCreatePage;
import { default as React, Fragment, useCallback } from 'react';

import { PageSection, ArrowIcon, SendIcon } from '../components';
import * as Routes from '../routes';
import { Input } from '../components/inputs';
import { useApi, useAuth, useModal } from '../services';
import { useState } from 'react';
import { useEffect } from 'react';
import { default as classnames } from 'classnames';
import { useParams, useHistory } from 'react-router-dom';
import Utils from '../utilities/Utils'
import { useRef } from 'react';

const MessagePage = ({ children }) => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { findUser, findAllUsers, findAllItems, storeMessage } = useApi();
  const { showModal } = useModal();
  const [ user, setUser ] = useState();
  const [ items, setItems ] = useState();
  const [ users, setUsers ] = useState(null);
  const [ conversations, setConversations ] = useState();
  const [ selectedConversation, setSelectedConversation ] = useState();
  const [ inputMessage, setInputMessage ] = useState();
  const sendInputField = useRef(null);
  const history = useHistory();


  const fetchUser = useCallback(
    async (userId) => {
      const fetchedUser = await findUser(userId);
      setUser(fetchedUser);
    }
    , [findUser]
  );

  const fetchUsers = useCallback(
    async ( ids ) => {
      let fetchedUsers = [];
      fetchedUsers = await findAllUsers({
        ids: JSON.stringify(ids),
      });
      let newUsers = fetchedUsers && fetchedUsers.map(fUser => ({
        id: fUser.id,
        name: fUser.name,
      }));
      setUsers(newUsers);
    },
    [findAllUsers]
  );

  const fetchItems = useCallback(
    async ( ids ) => {
      let fetchedItems = [];
      fetchedItems = await findAllItems({
        ids: JSON.stringify(ids),
      });
      let newItems = fetchedItems && fetchedItems.map(fItem => ({
        id: fItem.id,
        title: fItem.title,
        ownerId: fItem._userId,
        amIOwner: fItem._userId === user.id,
      }));
      setItems(newItems);
      
      return newItems;
    },
    [findAllItems, user]
  );

  const fetchMessages = useCallback(
    async () => {
      // if (!user) return;

      let allMessages = user.messages;
      console.log(user);
      
      // Get all unique items
      const messagesGroupedByItemsId = Utils.groupBy(allMessages, '_itemId');
      // If id in params: add to items
      if (id) messagesGroupedByItemsId[id] = null;
      const allItemIds = Object.keys(messagesGroupedByItemsId);
      const allItems = await fetchItems(allItemIds);

      // Get all unique users
      const allSenders = Utils.groupBy(allMessages, '_senderId');
      const allReceiverIds = Object.keys(Utils.groupBy(allMessages, '_receiverId'));
      allReceiverIds.forEach(receiverId => {
        allSenders[receiverId] = null;
      });

      // If id in params: item owner to users
      if(id) {
        const ItemOfNewConvo = allItems.find(i => i.id === id);
        allSenders[ItemOfNewConvo.ownerId] = null;
      }

      const allUniqueUserIds = Object.keys(allSenders)
      fetchUsers(allUniqueUserIds);
    },
    [user, fetchItems, fetchUsers, id]
  );

  const makeConversations = useCallback((users) => {
    if (!user) return;
    if (!users) return;

    // Make conversation (for each group of messages) containing:
    // messages, name (possibly with last name) + id of other users, name + id of item
    const convos = [];
    user.messages.forEach(message => {
      const otherId = [message._senderId, message._receiverId].find(oId => oId !== user.id);

      const existingConvoIndex = convos.indexOf(convos.find(c => c.id === `${message._itemId}${otherId}`));

      const formattedMessage = {
        ...message,
        isMine: message._senderId === user.id,
      }
      
      if (existingConvoIndex !== -1) {
        convos[existingConvoIndex].messages.unshift(formattedMessage);
      } else {
        const otherUser = users.find(u => u.id === otherId);

        const item = items.find(i => i.id === message._itemId);
        if (!item) {
          console.log('Item not found');
          return;
        }

        const newConvo = {
          id: `${item.id}${otherId}`,
          item,
          otherUser,
          messages: [formattedMessage],
        }

        convos.push(newConvo);
      }
    });

    // When all 'normal' conversations are made:
    // add new conversation (if id in params and the)
    if (id && !user._itemIds.includes(id)) {
      const item = items.find(i => i.id === id);
      console.log(item);
      const otherUser = users.find(u => u.id === item.ownerId);
      const convoId = `${id}${otherUser.id}`;
      const existingConvoIndex = convos.indexOf(convos.find(c => c.id === convoId));
      if (existingConvoIndex !== -1) {
        // Move convo to index 0
        const newConvo = convos.splice(existingConvoIndex, 1)[0];
        console.log(newConvo);
        convos.unshift(newConvo);
      } else {
        const newConvo = {
          id: convoId,
          item,
          otherUser,
          messages: [],
        }
        convos.unshift(newConvo);
      }
    }
    setConversations(convos);
  }, [user, items, id]);

  
  useEffect(() => {
    // If not signed in, go back
    if (!currentUser) {
      history.go(-1);
      return;
    }

    // Else, load user
    fetchUser(currentUser.id);
  }, [currentUser, fetchUser, history]);

  useEffect(() => {
    // If user is loaded, fetch messages, unique users and unique items 
    user && fetchMessages();
  }, [user, fetchMessages]);

  useEffect(() => {
    // If all users and items are loaded, make conversations
    if (users && items) {
      makeConversations(users);
    }
  }, [users, items, makeConversations]);

  useEffect(() => {
    // If conversations are made, select first
    if (conversations) {
      console.log(conversations);
      setSelectedConversation(conversations[0]);
    }
  }, [conversations]);



  const onLoadChatWindowsElement = (element) => element && element.scroll(0, element.scrollHeight);


  const convoClickHandler = (convoId) => {
    const convo = conversations.find((c) => c.id === convoId);
    setSelectedConversation(convo);
  }

  const itemClickHandler = () => {
    selectedConversation && history.push(`${Routes.ITEM_DETAIL.replace(':id', selectedConversation.item.id)}`);
  }

  const messageChangeHandler = (e) => {
    const newInput = e.target.value;
    setInputMessage(typeof newInput === 'string' ? newInput.trim() : null);
  }

  const sendHandler = async (e) => {
    e.preventDefault();
    if (sendInputField) sendInputField.current.value = '';
    if (!inputMessage || !selectedConversation || !currentUser) return;

   
    const saveMessage = {
      body: inputMessage,
      senderId: currentUser.id,
      receiverId: selectedConversation.otherUser.id,
      itemId: selectedConversation.item.id,
    };

    try {
      // Save message to the database
      const saveMsg = await storeMessage(saveMessage);
      const newConvoMsg = {
        ...saveMsg.message,
        isMine: true,
      }

      // Update conversation in conversations state
      const convo = conversations.find((c) => selectedConversation.id);
      
      console.log(selectedConversation);
      console.log(conversations);
      console.log(convo);
      const updatedConvo = {
        ...convo,
        messages: [newConvoMsg, ...convo.messages],
      }
      const updatedConvos = conversations;
      updatedConvos[conversations.indexOf(convo)] = updatedConvo;
      setConversations(updatedConvos);

      // Update conversation in selecteConversation state
      console.log(selectedConversation);
      setSelectedConversation(prev => ({
        ...prev,
        messages: [newConvoMsg, ...prev.messages],
      }))
    } catch (error) {
      console.log(error);
    }
  }

	return selectedConversation ? (
		<Fragment>
			<PageSection classes="messagePage page-section--no-space-above" title={'MessagePage'}>
        <section className="messageManager">
          <div className="messageManager__side--users">
            {conversations && conversations.map(convo => (
              <div
                key={convo.id}
                className={classnames('messageManager__conversationButton', selectedConversation.id === convo.id && 'messageManager__conversationButton--selected')}
                onClick={(e) => convoClickHandler(convo.id)}
              >
                {convo.otherUser.name}
              </div>
            ))}
          </div>
          <div className="messageManager__side--chat">
            <div className="messageManager__chatTop">
              <div className="messageManager__itemLink" onClick={itemClickHandler}>
                <div className="messageManager__itemLinkCenter">
                  <div className="messageManager__itemLinkUser">{`${selectedConversation.otherUser.name} is ${selectedConversation.item.amIOwner ? 'interested in' : 'owner of'}`}</div>
                  <div className="messageManager__itemLinkItem">{selectedConversation.item.title}</div>
                </div>
                <ArrowIcon color="#ff6c31" classes="messageManager__itemLinkIcon" />
              </div>
              <div className="messageManager__reviewLink" onClick={() => showModal('review', null, null, selectedConversation.otherUser.id )}>Review This User</div>
            </div>
            <div className="messageManager__chatMid" ref={onLoadChatWindowsElement}>
              <div className="messageManager__messageContainer">
                {selectedConversation.messages.map((message) => (
                  <div key={message.id} className={classnames('messageManager__chatMessage', message.isMine && 'messageManager__chatMessage--own')}>{message.body}</div>
                ))}
              </div>
            </div>
            <div className="messageManager__chatBottom">
              <form className="messageManager__sendBox" onSubmit={sendHandler}>
                <Input type="text" classes="messageManager__sendInput" placeholder="Message" onChange={messageChangeHandler} inputRef={sendInputField} />
                <div className="messageManager__sendButton" onClick={sendHandler}>
                  <SendIcon color="#ffffff" classes="messageManager__sendIcon" />
                </div>
              </form>
            </div>
          </div>
        </section>
			</PageSection>
		</Fragment>
	) : (
    <PageSection classes="messagePage page-section--no-space-above page-section--centered" title={'MessagePage'}>
      <h1>No messages yet</h1>
    </PageSection>
  );
};

export default MessagePage;


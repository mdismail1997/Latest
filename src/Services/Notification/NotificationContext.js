import React from 'react';
const NotificationContext = React.createContext();
const NotificationProvider = NotificationContext.Provider;
const NotificationConsumer = NotificationContext.Consumer;
export {NotificationProvider, NotificationConsumer};
export default NotificationContext;

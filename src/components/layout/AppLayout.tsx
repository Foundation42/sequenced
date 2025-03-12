import React from 'react';
import Header from './Header';
import Timeline from '../timeline/Timeline';
import TransportControls from '../transport/TransportControls';
import DevicePanel from './DevicePanel';

const AppLayout: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <TransportControls />
        <Timeline />
      </main>
      <DevicePanel />
    </div>
  );
};

export default AppLayout;
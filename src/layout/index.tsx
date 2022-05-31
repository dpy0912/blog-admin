import React, { useState } from 'react';
import { Layout } from 'antd';

import Sider from './sider';
import LayoutHeader from './header';
import LayoutContent from './content';
const LayoutApp: React.FC = () => {
  return (
    <Layout>
      <Sider />
      <Layout className="bg-light-50">
        <LayoutHeader />
        <LayoutContent />
      </Layout>
    </Layout>
  );
};
export default LayoutApp;

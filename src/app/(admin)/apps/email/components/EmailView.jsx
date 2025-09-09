import { Col, TabContainer } from 'react-bootstrap';
import EmailNavigationMenu from './EmailNavigationMenu';
import EmailTabList from './EmailTabList';
const EmailView = () => {
  return <TabContainer mountOnEnter defaultActiveKey="Inbox">
      <Col xxl={2}>
        <EmailNavigationMenu />
      </Col>
      <Col xxl={10}>
        <EmailTabList />
      </Col>
    </TabContainer>;
};
export default EmailView;
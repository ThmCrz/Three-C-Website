import React from 'react';
import { UserInfo } from '../types/User';
import Card from 'react-bootstrap/Card'; // Import Card from react-bootstrap

type AccountDisplayProps = {
  accountData: UserInfo;
};

const AccountCard: React.FC<AccountDisplayProps> = ({ accountData }) => {
  return (
    <Card className="Card AccountCard">
      <Card.Body>
        <Card.Title>{accountData.name}</Card.Title> 
        <Card.Text>
          Email: <br/> {accountData.email}
        </Card.Text>
        <Card.Text>
          Role: <br/>{accountData.role}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default AccountCard;
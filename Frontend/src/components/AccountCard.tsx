import React from 'react';
import { UserInfo } from '../types/User';

// The AccountDisplay component
type AccountDisplayProps = {
  accountData: UserInfo;
};

const AccountCard: React.FC<AccountDisplayProps> = ({ accountData }) => {
  return (
    <div>
      <h2>{accountData.name}</h2>
      <p>Email: {accountData.email}</p>
      <p>Role: {accountData.role}</p>
      {/* Display the first item's image from the currentCart as an example */}
    </div>
  );
};

export default AccountCard;
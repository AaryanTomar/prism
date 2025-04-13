import React from 'react';

const CompanyProfile = ({ profile }) => {
  if (!profile) {
    return <div className="profile-container">No company profile available</div>;
  }

  return (
    <div className="profile-container">
      <h3>Company Profile</h3>
      
      <div className="profile-details">
        <p>
          <span className="profile-label">Exchange: </span>
          {profile.exchange}
        </p>
        
        <p>
          <span className="profile-label">Industry: </span>
          {profile.finnhubIndustry}
        </p>
        
        <p>
          <span className="profile-label">IPO Date: </span>
          {profile.ipo}
        </p>
        
        <p>
          <span className="profile-label">Website: </span>
          <a href={profile.weburl} target="_blank" rel="noopener noreferrer">
            {profile.weburl}
          </a>
        </p>
                
        <p className="company-description">
          {profile.description}
        </p>
      </div>
    </div>
  );
};

export default CompanyProfile;
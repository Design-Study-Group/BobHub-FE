import React, { useState, useEffect } from 'react';
import ProfileSection from './components/ProfileSection';
import ActivitySection from './components/ActivitySection';
import { getUserActivity } from '../../api/oauth';
import './MyPage.css';

const MyPage = ({ currentUser, setCurrentUser }) => {
  const [activityHistory, setActivityHistory] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [activityError, setActivityError] = useState(null);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setLoadingActivities(true);
        const response = await getUserActivity();
        console.log('Activity data from API:', response.data);
        if (response && response.data) {
          setActivityHistory(response.data);
        } else {
          throw new Error('서버에서 받아온 데이터가 없습니다.');
        }
      } catch (err) {
        setActivityError(err.message || '활동 내역을 가져오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchActivityData();
  }, []);

  return (
    <div className="mypage-container">
      <div className="container">
                {currentUser && <ProfileSection userProfile={currentUser} setCurrentUser={setCurrentUser} />}
        <ActivitySection 
          activityHistory={activityHistory}
          loading={loadingActivities}
          error={activityError} 
        />
      </div>
    </div>
  );
};

export default MyPage;
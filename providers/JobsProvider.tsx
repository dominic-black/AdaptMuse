'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

import { db } from '@/firebase/firebase-config';
import { useAuth } from '@/hooks/useAuth';
import { Job } from '@/types/job';

interface JobsContextType {
  jobs: Job[];
  loading: boolean;
}

export const JobsContext = createContext<JobsContextType | undefined>(
  undefined
);

export const JobsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const jobsRef = collection(db, 'users', user.uid, 'jobs');
      const q = query(jobsRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const newJobs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Job, 'id'>),
          }));
          setJobs(newJobs);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching jobs:', error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      setJobs([]);
      setLoading(false);
    }
  }, [user]);

  return (
    <JobsContext.Provider value={{ jobs, loading }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};

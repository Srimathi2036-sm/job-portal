import React, { useState } from "react";
import ApplicationsTable from "./ApplicationsTable";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([
    {
      applicant: { name: "John Doe" },
      application: { createdAt: "2024-03-23" },
      applicantDets: { rating: 4, ratedBy: [1, 2, 3] }
    },
    {
      applicant: { name: "Jane Smith" },
      application: { createdAt: "2024-03-22" },
      applicantDets: { rating: -1, ratedBy: [] }
    }
  ]);

  const viewApplication = (applicant, application, applicantDets) => {
    alert(`Viewing application of ${applicant.name}`);
  };

  return (
    <div>
      <h2 className="text-center">Applications</h2>
      <ApplicationsTable applications={applications} viewApplication={viewApplication} />
    </div>
  );
};

export default ApplicationsPage;

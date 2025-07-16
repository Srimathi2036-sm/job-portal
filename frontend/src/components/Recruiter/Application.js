import React from "react";

const ApplicationsTable = ({ applications, viewApplication }) => {
  return (
    <div className="table-container">
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col" className="text-center" style={{ width: "5%" }}>#</th>
            <th scope="col" className="text-center" style={{ width: "20%" }}>NAME</th>
            <th scope="col" className="text-center" style={{ width: "20%" }}>DATE</th>
            <th scope="col" className="text-center" style={{ width: "15%" }}>RATING</th>
            <th scope="col" className="text-center" style={{ width: "20%" }}>DETAILS</th>
          </tr>
        </thead>
        <tbody>
          {applications && applications.map((application, index) => (
            <tr key={index} style={{ fontSize: "14px" }}>
              <th scope="row" className="text-center pt-2">{index + 1}</th>
              <td className="text-center pt-2">{application.applicant.name}</td>
              <td className="text-center pt-2">{application.application.createdAt}</td>
              <td className="text-center pt-2">
                {application.applicantDets.rating === -1 ? "UNRATED" : 
                (application.applicantDets.rating / application.applicantDets.ratedBy.length).toFixed(1)}
              </td>
              <td className="text-center">
                <button className="btn btn-sm btn-info" onClick={() => viewApplication(application.applicant, application.application, application.applicantDets)}>VIEW</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsTable;

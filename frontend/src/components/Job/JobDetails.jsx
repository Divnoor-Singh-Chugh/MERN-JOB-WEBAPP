import React, { useContext, useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Context } from "../../main";
import axios from "axios";
const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    axios
      .get(`https://mern-job-webapp.onrender.com/api/v1/job/${id}`, {
        withCredentials: true,
        crossDomain: true,
        mode: 'cors',
        credentials: 'cross-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Credentials':'true',
          'Access-Control-Allow-Origin':
            'https://mern-jobz-webapp.onrender.com',
        }
    })
      .then((res) => {
        setJob(res.data.job);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <div className="jobDetail page">
        <div className="container">
          <h3>Job Details</h3>
          <div className="banner">
            <p>
              Title: <span>{job.title}</span>
            </p>
            <p>
              Category: <span>{job.category}</span>
            </p>
            <p>
              Country: <span>{job.country}</span>
            </p>
            <p>
              City: <span>{job.city}</span>
            </p>
            <p>
              Location: <span>{job.location}</span>
            </p>
            <p>
              Description: <span>{job.description}</span>
            </p>
            <p>
              Job Posted On: <span>{job.jobPostedOn}</span>
            </p>
            <p>
              Salary:
              {job.fixedSalary ? (
                <span>{job.fixedSalary}</span>
              ) : (
                <span>{job.salaryFrom} - {job.salaryTo}</span>
              )}
            </p>
            <p>
              {
                user && user.role==='Employer' ?<></>:<Link to={`/application/${job._id}`}>Apply Now</Link>
              }
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetails;

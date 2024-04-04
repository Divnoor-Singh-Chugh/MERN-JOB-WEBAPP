import React, { useContext, useEffect, useState } from "react";
import {Link, Navigate} from 'react-router-dom'
import { Context } from "../../main";
import axios from "axios";
const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const { isAuthorized } = useContext(Context);
  useEffect(() => {
    try {
      axios
        .get("https://mern-job-webapp.onrender.com/api/v1/job/getall", {
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
          setJobs(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
if(!isAuthorized)
{
  return <Navigate to={'/login'}/>
}

  return <>
  <section className="jobs page">
    <div className="container">
      <h1>ALL AVAILABLE JOBS</h1>
      <div className="banner">
        {jobs.jobs && jobs.jobs.map((element)=>{
          return(
            <div className="card" key={element._id}>
             <p>{element.title}</p>
             <p>{element.category}</p>
             <p>{element.country}</p>
             <Link to={`/job/${element._id}`}>JOB DETAILS</Link>
            </div>
          )
        })}
      </div>
    </div>
  </section>
  </>;
};

export default Jobs;

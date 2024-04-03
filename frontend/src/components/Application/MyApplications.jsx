import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import ResumeModal from "./ResumeModal";
import { Navigate } from "react-router-dom";

const MyApplications = () => {
  const [application, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const { user, isAuthorized } = useContext(Context);

  useEffect(() => {
    try {
      if (user && user.role === "Employer") {
        axios
          .get("https://mern-job-webapp.onrender.com/api/v1/application/employer/getall", {
            withCredentials: true,
            crossDomain: true,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'Access-Control-Allow-Credentials':'true',
              'Access-Control-Allow-Origin':
                'https://mern-jobz-webapp.onrender.com',
            }
        })
          .then((res) => {
            setApplications(res.data.applications);
          });
      } else {
        axios
          .get("https://mern-job-webapp.onrender.com/api/v1/application/jobseeker/getall", {
            withCredentials: true,
            crossDomain: true,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'Access-Control-Allow-Credentials':'true',
              'Access-Control-Allow-Origin':
                'https://mern-jobz-webapp.onrender.com',
            }
        })
          .then((res) => {
            setApplications(res.data.applications);
          });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    <Navigate to={"/login"} />;
  }

  const deleteApplication =  (id) => {
    try {
       axios
        .delete(`https://mern-job-webapp.onrender.com/api/v1/application/delete/${id}`, {
          withCredentials: true,
          crossDomain: true,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Credentials':'true',
            'Access-Control-Allow-Origin':
              'https://mern-jobz-webapp.onrender.com',
          }
      })
        .then((res) => {
          console.log(res);
          toast.success(res.data.message);
          setApplications((prevApplications) => 
            prevApplications.filter((application) => application._id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <section className="my_applications page">
        {user && user.role === "Job Seeker" ? (
          <div className="container">
            <h3>My Applications</h3>
            {console.log(application)}
            {application.length <= 0 ? (
              <>
                <h4>No Applications Found</h4>
              </>
            ) : (
              application.map((element) => {
                return (
                  <JobSeekerCard
                    element={element}
                    key={element._id}
                    deleteApplication={deleteApplication}
                    openModal={openModal}
                  />
                );
              })
            )}
          </div>
        ) : (
          <div className="container">
            <h3>Applications from Job Seekers</h3>
            {application.map((element) => {
              return (
                <EmployerCard
                  element={element}
                  key={element._id}
                  openModal={openModal}
                />
              );
            })}
          </div>
        )}
        {modalOpen && (
          <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
        )}
      </section>
    </>
  );
};

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span>
            {element.name}
          </p>
          <p>
            <span>Email:</span>
            {element.email}
          </p>
          <p>
            <span>Phone:</span>
            {element.phone}
          </p>
          <p>
            <span>Address:</span>
            {element.address}
          </p>
          <p>
            <span>CoverLetter:</span>
            {element.coverLetter}
          </p>
        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        </div>
        <div className="btn_area">
          <button onClick={() => deleteApplication(element._id)}>
            Delete Application
          </button>
        </div>
      </div>
    </>
  );
};

const EmployerCard = ({ element, openModal }) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span>
            {element.name}
          </p>
          <p>
            <span>Email:</span>
            {element.email}
          </p>
          <p>
            <span>Phone:</span>
            {element.phone}
          </p>
          <p>
            <span>Address:</span>
            {element.address}
          </p>
          <p>
            <span>CoverLetter:</span>
            {element.coverLetter}
          </p>
        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        </div>
      </div>
    </>
  );
};

export default MyApplications;

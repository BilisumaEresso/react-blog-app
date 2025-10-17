import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/context/AuthContext";
import axios from "../../utils/axiosInstance";
import { useState } from "react";
import { toast } from "react-toastify";
import verificationCodeValidator from "../../validators/verificationCodeValidator";

const VerifyUser = () => {
  const auth = useAuth();
  const email = auth.email;
  const [sendLoad, setSendLoad] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState({ code: "" });
  const [load, setLoad] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitting....");
    const errors = verificationCodeValidator({ code: code }) || { code: "" };
    if (errors.code) {
      setCodeError(errors);
    } else {
      try {
        setSendLoad(true);
        const response = await axios.post("/auth/user-verification", {
          email: email,
          code: code,
        });
        const data = response.data;
        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setSendLoad(false);
      } catch (error) {
        setSendLoad(false);
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
      }
    }
  };

  const sendVerificationCode = async () => {
    try {
      setLoad(true);
      console.log(email);
      const response = await axios.post("/auth/send-verification-email", {
        email: email,
      });
      console.log(response);
      const data = response.data;
      toast.success(data.message, {
        position: "top-right",
        autoClose: true,
      });
      setLoad(false);
      setEmailSent(true);
    } catch (error) {
      setLoad(false);
      setEmailSent(false);
      const response = error.response;
      const data = response.data;
      toast.error(data.message, {
        position: "top-right",
        autoClose: true,
      });
    }
  };

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate(-1)} className="button button-block">
        Go back
      </button>
      <button
        disabled={load}
        onClick={sendVerificationCode}
        className="button button-block"
      >
        {load ? <p>Sending...</p> : <p>Send Verification Code</p>}
      </button>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="inner-container">
          <h2 className="form-title">User Verification</h2>
          <div className="form-group">
            <label>Confirmation Code</label>
            <input
              type="text"
              value={code}
              onChange={handleChange}
              name="code"
              className="form-control"
              placeholder="234567"
            />
            {codeError.code && <p className="error">{codeError.code}</p>}
          </div>
          <div className="form-group">
            <input
              disabled={!emailSent}
              type="submit"
              value={sendLoad ? "Sending.." : "Send"}
              className="button"
            />
          </div>
        </form>
      </div>
      {emailSent && (
        <div style={{textAlign:"center"}}>
          <p style={{ margin: "5px auto " }}>
            did'nt get the code{" "}
            <button className="button"
              style={{ borderRadius: "5px",border:"2px #ccc solid"}}
              onClick={() => {
                sendVerificationCode();
                setEmailSent(false);
                setLoad(true);
              }}
            >
              {" "}
              resend
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default VerifyUser;

import React, { useEffect, useState, useRef } from "react";
import NextLink from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import style from "../styles/Navbar.module.css";
import { useRouter } from "next/router";

interface NavbarProps {
  name: string;
  profileUrl: string;
}

export const Navbar: React.FC<NavbarProps> = ({ name, profileUrl }) => {
  const [showLogout, setShowLogout] = useState(false);
  const profileRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShowLogout(false);
    }
  };

  const handleLogout = () => {
    router.push("/");
  };

  const logout = showLogout ? (
    <div className={style.logout} onClick={handleLogout}>
      Logout
    </div>
  ) : null;

  return (
    <div className={style.Navbar}>
        <div className={style.graphify}>graphify</div>
      <div
        className={style.profile}
        ref={profileRef}
        onClick={() => {
          setShowLogout(!showLogout);
        }}
      >
        <img className={style.profilePic} src={profileUrl}></img>
        {name}
        <FontAwesomeIcon className = {style.angle} icon = {faAngleDown}/>
      </div>
      {logout}
    </div>
  );
};

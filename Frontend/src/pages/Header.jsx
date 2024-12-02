import {
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const userData = useSelector((state) => state.cart);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  return (
    <div>
      <div className="d-flex ">
        <div
          style={{
            color: "#47478C",
            fontSize: "25px",
            fontWeight: "bold",
            margin: "7px",
            marginLeft: "10px",
            width: "300px",
          }}
        >
          <span
            onClick={() => {
              navigate("/"), localStorage.removeItem("topicId");
            }}
            style={{ cursor: "pointer" }}
          >
            E-NoteBook
          </span>
        </div>

        <div className="d-flex justify-content-end w-100">
          {/* <div className=" my-1 ">
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={0} color="error">
                <MailIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </div> */}

          <div className="">
            <Tooltip title="My Profile" placement="bottom-end">
              <span className="fw-bold ">
                {" "}
                Hey, {userData?.name?.split(" ")[0] ?? "user"}
              </span>
              <IconButton onClick={handleOpenUserMenu}>
                {" "}
                <span className="fs-6 fw-bold text-primary "></span>
                <Avatar></Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography
                  textAlign="center"
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  <AccountBoxIcon className="mx-2" />
                  Profile
                </Typography>
              </MenuItem>

              <MenuItem onClick={handleCloseUserMenu}>
                <Typography
                  textAlign="center"
                  onClick={() => {
                    navigate("/settings");
                  }}
                >
                  <SettingsIcon className="mx-2" /> Settings
                </Typography>
              </MenuItem>

              <MenuItem>
                <Typography
                  textAlign="center"
                  onClick={async () => {
                    navigate("/login");
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    dispatch(remove());
                  }}
                >
                  <LogoutIcon className="mx-2" /> Logout
                </Typography>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}

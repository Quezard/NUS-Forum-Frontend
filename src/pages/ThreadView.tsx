import SearchBar from "../components/SearchBar";
import SideBar from "../components/SideBar";
import { Box } from "@mui/material";
import React from "react";

const ThreadView: React.FC = () => {
    return (
        <Box display={"flex"}>
            <SearchBar />
            <SideBar />
        </Box>
    );
};

export default ThreadView;

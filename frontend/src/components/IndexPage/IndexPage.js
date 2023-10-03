import { Link, Container, Stack, Typography } from "@mui/material"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IndexPage = () => {
    const navigate = useNavigate();
    useEffect(() => navigate(`/admin`))

    return <>
        <Container sx={{ height: "100vh" }}>
            <Stack height={"100%"} justifyItems={"center"} justifyContent={"center"} alignItems={"center"}>
                <Typography>Перенаправляю на <Link component="button" onClick={() => navigate(`/admin`)}>админ панель</Link></Typography>
            </Stack>
        </Container>
    </>;
};
export default IndexPage;
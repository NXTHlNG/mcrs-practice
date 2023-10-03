import { Link, Container, Stack, Typography } from "@mui/material"

const IndexPage = () => {
    window.location.href = "admin"

    return <>
        <Container sx={{ height: "100vh" }}>
            <Stack height={"100%"} justifyItems={"center"} justifyContent={"center"} alignItems={"center"}>
                <Typography>Перенаправляю на <Link component="button" onClick={() => window.location.href = "admin"}>админ панель</Link></Typography>
            </Stack>
        </Container>
    </>;
};
export default IndexPage;
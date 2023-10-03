import { Container, Stack, Typography } from "@mui/material"

const NotFoundPage = () => {

    return <>
        <Container sx={{ height: "100vh" }}>
            <Stack height={"100%"} justifyItems={"center"} justifyContent={"center"} alignItems={"center"}>
                <Typography>Такой страницы нет</Typography>
            </Stack>
        </Container>
    </>;
};
export default NotFoundPage;
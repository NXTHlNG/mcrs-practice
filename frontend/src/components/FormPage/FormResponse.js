import { Button, Container, Stack, Typography } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom";

const FormResponse = () => {
    const navigate = useNavigate();
    const { alias } = useParams();

    return <>
        <Container sx={{ height: "100vh" }}>
            <Stack height={"100%"} justifyItems={"center"} justifyContent={"center"} alignItems={"center"}>
                <Typography>Ответ сохранен</Typography>
                <Button onClick={() => navigate(`/form/${alias}`)}>Заполнить ещё раз</Button>
            </Stack>
        </Container>

    </>;
};
export default FormResponse;

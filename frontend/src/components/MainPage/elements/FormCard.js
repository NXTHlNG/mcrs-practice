import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import DownloadIcon from "@mui/icons-material/Download";
import { IconButton } from "@material-ui/core";

const FormCard = ({ title, description }) => {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent sx={{ minHeight: 50 }}>
                {/* <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom>
                    Form Title
                </Typography> */}
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    adjective
                </Typography> */}
                <Typography variant="body2">{description}</Typography>
            </CardContent>
            <CardActions>
                <IconButton>
                    <EditIcon></EditIcon>
                </IconButton>
                <IconButton>
                    <DeleteIcon></DeleteIcon>
                </IconButton>
                <IconButton>
                    <ShareIcon></ShareIcon>
                </IconButton>
                <IconButton>
                    <DownloadIcon></DownloadIcon>
                </IconButton>
            </CardActions>
        </Card>
    );
};
export default FormCard;

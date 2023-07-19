import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import DownloadIcon from "@mui/icons-material/Download";
import { IconButton } from "@material-ui/core";
import { CardActionArea } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useState } from "react";

const FormCard = ({
    title,
    description,
    onEdit,
    onOpenForm,
    onDelete,
    onShare,
    onDownload,
}) => {
    const [open, setOpen] = useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
    };
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardActionArea onClick={onOpenForm}>
                <CardContent sx={{ minHeight: 50 }}>
                    <Typography variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography
                        sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            height: 50,
                        }}
                        variant="body2">
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <IconButton onClick={onEdit}>
                    <EditIcon></EditIcon>
                </IconButton>
                <IconButton onClick={onDelete}>
                    <DeleteIcon></DeleteIcon>
                </IconButton>
                <ClickAwayListener onClickAway={handleTooltipClose}>
                    <Tooltip
                        PopperProps={{
                            disablePortal: true,
                        }}
                        onClose={handleTooltipClose}
                        open={open}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        placement="bottom"
                        title="Ссылка скопирована">
                        <IconButton
                            onClick={() => {
                                handleTooltipOpen();
                                onShare();
                            }}>
                            <ShareIcon></ShareIcon>
                        </IconButton>
                    </Tooltip>
                </ClickAwayListener>
                <IconButton onClick={onDownload}>
                    <DownloadIcon></DownloadIcon>
                </IconButton>
            </CardActions>
        </Card>
    );
};
export default FormCard;

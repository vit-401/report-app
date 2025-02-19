import {styled, Tooltip, tooltipClasses} from "@mui/material";

const CustomTooltip = styled(({ className, ...props }: any) => (
    <Tooltip
        {...props}
        enterTouchDelay={0}
        leaveTouchDelay={300}
        classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        fontSize: "1rem",
        padding: "5px",
        textAlign: "center",
    },
});

export default CustomTooltip;
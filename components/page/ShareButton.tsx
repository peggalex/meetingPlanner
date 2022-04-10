import Icons from "../../utilities/icons";
import PinkButton from "./PinkButton";

const ShareButton = () => <PinkButton 
    text="share" 
    icon={Icons.share} 
    onClick={async ()=>{
        navigator.clipboard.writeText(window.location.href);
        alert(`Copied url to clipboard: ${window.location.href}`);
    }} 
    title="Share meeting" 
    isDisabled={false}
/>;

export default ShareButton;